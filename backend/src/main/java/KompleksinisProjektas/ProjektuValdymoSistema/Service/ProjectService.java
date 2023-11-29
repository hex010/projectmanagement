package KompleksinisProjektas.ProjektuValdymoSistema.Service;

import KompleksinisProjektas.ProjektuValdymoSistema.Exceptions.*;
import KompleksinisProjektas.ProjektuValdymoSistema.Model.*;
import KompleksinisProjektas.ProjektuValdymoSistema.Repository.ProjectRepository;
import KompleksinisProjektas.ProjektuValdymoSistema.Repository.UserRepository;
import KompleksinisProjektas.ProjektuValdymoSistema.dtos.*;
import lombok.AllArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.io.ByteArrayOutputStream;

@AllArgsConstructor
@Service
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Value("${file-storage}")
    private String fileStorageRootPath;

    public ProjectDTO createNewProject(ProjectCreationFDTO projectCreationFDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = (String) authentication.getPrincipal();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserDoesNotExistException("Naudotojas su paštu: " + email + " neegzistuoja"));


        Project project = new Project(projectCreationFDTO, currentUser);
        project = projectRepository.save(project);

        return new ProjectDTO(project);
    }

    public ProjectDTO getProjectById(int id) {
        Project project = projectRepository.findById(id).orElseThrow(() -> new ProjectDoesNotExistException("Toks projektas neegzsituoja"));
        return new ProjectDTO(project);
    }

    public List<UserDTO> addUsersToProjectTeam(int projectId, List<Integer> userIds) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectDoesNotExistException("Toks projektas neegzsituoja"));

        List<User> usersToAdd = new ArrayList<>();

        for (Integer userId : userIds) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new UserDoesNotExistException("Naudotojas su ID: " + userId + " neegzistuoja"));

            if(!user.getRole().equals(Role.KOMANDOS_NARYS)) {
                throw new UserRoleNotMatch("Naudotojas su ID " + userId + ", jo rolė nėra komandos nario.");
            }
            if (!project.getTeamMembers().contains(user)) {
                usersToAdd.add(user);
            } else {
                throw new UserAlreadyExistsInProjectException("Naudotojas su ID " + userId + " jau egzistuoja projekte.");
            }
        }

        project.getTeamMembers().addAll(usersToAdd);

        project = projectRepository.save(project);

        return project.getTeamMembers()
                .stream()
                .map(UserDTO::new)
                .toList();
    }

    public void addProjectDocument(int projectId, MultipartFile projectFile) throws IOException {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectDoesNotExistException("Toks projektas neegzsituoja"));

        if(projectFile.getOriginalFilename() == null) {
            throw new UploadFileException("Pasirintas projekto failas yra pažeistas");
        }

        long currentTimeMillis = System.currentTimeMillis();
        String fileName = currentTimeMillis + "_" + projectFile.getOriginalFilename();
        Path filePath = Paths.get(fileStorageRootPath, "Projects", fileName);

        projectFile.transferTo(filePath.toFile());

        project.setFilePath(filePath.toString());
        projectRepository.save(project);
    }

    public List<ProjectDTO> getAssignedProjects(String filterOption) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = (String) authentication.getPrincipal();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserDoesNotExistException("Naudotojas su paštu: " + email + " neegzistuoja"));

        List<Project> assignedProjects;

        switch (filterOption) {
            case "Vykdomi": {
                assignedProjects = getAssignedProjectsWithIngoingFilter(currentUser);
                break;
            }
            case "Pasibaigę": {
                assignedProjects = getAssignedProjectsWithFinishedFilter(currentUser);
                break;
            }
            case "Visi": {
                assignedProjects = getAssignedProjectsWithAllFilter(currentUser);
                break;
            }
            default:{
                throw new IllegalArgumentException("Netinkamas filtras: " + filterOption);
            }
        }

        List<ProjectDTO> assignedProjectsDTOs = new ArrayList<>();
        for(Project assignedProject : assignedProjects) {
            assignedProjectsDTOs.add(new ProjectDTO(assignedProject));
        }

        return assignedProjectsDTOs;
    }

    private List<Project> getAssignedProjectsWithAllFilter(User currentUser) {
        List<Project> assignedProjects;

        switch (currentUser.getRole()) {
            case KOMANDOS_VADOVAS: {
                assignedProjects = projectRepository.findByTeamLeaderId(currentUser.getId());
                break;
            }
            case KOMANDOS_NARYS: {
                assignedProjects = currentUser.getProjects();
                break;
            }
            case DIREKTORIUS: {
                assignedProjects = projectRepository.findAll();
                break;
            }
            default:{
                throw new IllegalArgumentException("Netinkama rolė: " + currentUser.getRole().name());
            }
        }

        return assignedProjects;
    }

    private List<Project> getAssignedProjectsWithFinishedFilter(User currentUser) {
        List<Project> assignedProjects;

        switch (currentUser.getRole()) {
            case KOMANDOS_VADOVAS: {
                assignedProjects = projectRepository.findByTeamLeaderIdAndProjectStatus(currentUser.getId(), ProjectStatus.Finished);
                break;
            }
            case KOMANDOS_NARYS: {
                assignedProjects = currentUser.getProjects()
                        .stream()
                        .filter(project -> project.getProjectStatus() == ProjectStatus.Finished)
                        .toList();
                break;
            }
            case DIREKTORIUS: {
                assignedProjects = projectRepository.findByProjectStatus(ProjectStatus.Finished);
                break;
            }
            default:{
                throw new IllegalArgumentException("Netinkama rolė: " + currentUser.getRole().name());
            }
        }

        return assignedProjects;
    }

    private List<Project> getAssignedProjectsWithIngoingFilter(User currentUser) {
        List<Project> assignedProjects;

        switch (currentUser.getRole()) {
            case KOMANDOS_VADOVAS: {
                assignedProjects = projectRepository.findByTeamLeaderIdAndProjectStatus(currentUser.getId(), ProjectStatus.InProgress);
                break;
            }
            case KOMANDOS_NARYS: {
                assignedProjects = currentUser.getProjects()
                        .stream()
                        .filter(project -> project.getProjectStatus() == ProjectStatus.InProgress)
                        .toList();
                break;
            }
            case DIREKTORIUS: {
                assignedProjects = projectRepository.findByProjectStatus(ProjectStatus.InProgress);
                break;
            }
            default:{
                throw new IllegalArgumentException("Netinkama rolė: " + currentUser.getRole().name());
            }
        }

        return assignedProjects;
    }

    public ProjectStatus finishProject(ProjectFinishFDTO projectFinishFDTO) {
        Project project = projectRepository.findById(projectFinishFDTO.getProjectId())
                .orElseThrow(() -> new ProjectDoesNotExistException("Toks projektas neegzsituoja"));

        if(project.getProjectStatus().equals(ProjectStatus.Finished))
            throw new ProjectFinishException("Projektas jau yra užbaigtas.");

        for(Task task : project.getTasks()) {
            if(!task.getTaskStatus().equals(TaskStatus.Completed))
                throw new ProjectFinishException("Ne visos projekto užduotys yra užbaigtos.");
        }

        project.setProjectStatus(ProjectStatus.Finished);
        project.setProjectFinishComment(projectFinishFDTO.getProjectFinishComment());
        project.setFinishDate(new Date());
        project = projectRepository.save(project);
        return project.getProjectStatus();
    }

    public ProjectTasksStatisticsDTO getProjectStatistics(int projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectDoesNotExistException("Toks projektas neegzsituoja"));

        ProjectTasksStatisticsDTO projectTasksStatisticsDTO = new ProjectTasksStatisticsDTO();
        int activeTasks = 0;
        int finishedTasks = 0;
        int lateTasks = 0;
        int earlierDoneTasks = 0;

        for(Task task : project.getTasks()) {
            if(task.getTaskStatus() == TaskStatus.Completed)
                finishedTasks++;
            else
                activeTasks++;

            if(task.getFinishDate() != null && task.getEndDate() != null) {
                long timeDifference = task.getFinishDate().getTime() - task.getEndDate().getTime();
                int daysLate = (int) Math.ceil(timeDifference / (1000.0 * 3600 * 24));
                if (daysLate > 0) lateTasks++;

                timeDifference = task.getEndDate().getTime() - task.getFinishDate().getTime();
                int daysEarlier = (int) Math.ceil(timeDifference / (1000.0 * 3600 * 24));
                if (daysEarlier > 0) earlierDoneTasks++;
            }
        }

        projectTasksStatisticsDTO.setActiveTasks(activeTasks);
        projectTasksStatisticsDTO.setAllTasks(project.getTasks().size());
        projectTasksStatisticsDTO.setFinishedTasks(finishedTasks);
        projectTasksStatisticsDTO.setLateTasks(lateTasks);
        projectTasksStatisticsDTO.setEarlierDoneTasks(earlierDoneTasks);

        return projectTasksStatisticsDTO;
    }

    public byte[] generateProjectReport(int projectId) throws IOException {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectDoesNotExistException("Toks projektas neegzsituoja"));

        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                contentStream.beginText();
                contentStream.setFont(PDType1Font.COURIER_BOLD, 12);

                contentStream.newLineAtOffset(100, 700);
                contentStream.showText("Projekto pavadinimas: " + project.getName());

                contentStream.newLineAtOffset(0, -20);
                contentStream.showText("Projekto aprašymas: " + project.getDescription());

                contentStream.newLineAtOffset(0, -20);
                contentStream.showText("Projekto statusas: " + convertProjectStatusToLithuania(project.getProjectStatus()));

                contentStream.newLineAtOffset(0, -20);
                contentStream.showText("Pradžios data: " + project.getStartDate());

                contentStream.newLineAtOffset(0, -20);
                contentStream.showText("Pabaigos data: " + project.getEndDate());

                List<Task> tasks = project.getTasks();
                contentStream.newLineAtOffset(0, -40);
                contentStream.showText("Užduotys:");

                contentStream.newLineAtOffset(20, 0);
                for (int i = 0; i < tasks.size(); i++) {
                    Task task = tasks.get(i);

                    contentStream.newLineAtOffset(0, -15);
                    contentStream.showText("Užduotis " + (i + 1) + ":");

                    contentStream.newLineAtOffset(0, -15);
                    contentStream.showText("Užduoties pavadinimas: " + task.getName());

                    contentStream.newLineAtOffset(0, -15);
                    contentStream.showText("Užduoties aprašymas: " + task.getDescription());

                    contentStream.newLineAtOffset(0, -15);
                    contentStream.showText("Užduoties prioritetas: " + convertTaskPriorityToLithuania(task.getTaskPriority()));

                    contentStream.newLineAtOffset(0, -15);
                    contentStream.showText("Užduoties statusas: " + convertTaskStatusToLithuania(task.getTaskStatus()));

                    contentStream.newLineAtOffset(0, -15);
                    contentStream.showText("Pradžios data: " + task.getStartDate());

                    contentStream.newLineAtOffset(0, -15);
                    contentStream.showText("Pabaigos data: " + task.getEndDate());

                    contentStream.newLineAtOffset(0, -15);
                }

                List<User> teamMembers = project.getTeamMembers();
                contentStream.newLineAtOffset(-20, -20);
                contentStream.showText("Komandos nariai:");

                contentStream.newLineAtOffset(20, 0);

                for (int i = 0; i < teamMembers.size(); i++) {
                    User user = teamMembers.get(i);

                    contentStream.newLineAtOffset(0, -15); // Change offset to 0 to prevent right shift
                    contentStream.showText("Naudotojas " + (i + 1) + ":");

                    contentStream.newLineAtOffset(0, -15);
                    contentStream.showText("El. paštas: " + user.getEmail());

                    contentStream.newLineAtOffset(0, -15);
                    contentStream.showText("Vardas: " + user.getFirstname());

                    contentStream.newLineAtOffset(0, -15);
                    contentStream.showText("Pavarde: " + user.getLastname());

                    contentStream.newLineAtOffset(0, -15);
                }

                contentStream.endText();
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            document.save(outputStream);
            return outputStream.toByteArray();
        }
    }

    private String convertTaskStatusToLithuania(TaskStatus taskStatus) {
        switch (taskStatus) {
            case New -> {
                return "Naujas";
            }
            case Completed -> {
                return "Užbaigtas";
            }
            case InProgress -> {
                return "Vykdomas";
            }
            default -> {
                return "Nenustatyta";
            }
        }
    }

    private String convertTaskPriorityToLithuania(TaskPriority taskPriority) {
        switch (taskPriority) {
            case High -> {
                return "Aukštas";
            }
            case Low -> {
                return "Žemas";
            }
            case Medium -> {
                return "Vidutinis";
            }
            default -> {
                return "Nenustatytas";
            }
        }
    }

    private String convertProjectStatusToLithuania(ProjectStatus projectStatus) {
        switch (projectStatus) {
            case InProgress -> {
                return "Vykdomas";
            }
            case Finished -> {
                return "Užbaigtas";
            }
            default -> {
                return "Nenustatytas";
            }
        }
    }



}
