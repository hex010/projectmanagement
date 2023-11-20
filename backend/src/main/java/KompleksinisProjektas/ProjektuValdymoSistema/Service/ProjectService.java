package KompleksinisProjektas.ProjektuValdymoSistema.Service;

import KompleksinisProjektas.ProjektuValdymoSistema.Exceptions.*;
import KompleksinisProjektas.ProjektuValdymoSistema.Model.*;
import KompleksinisProjektas.ProjektuValdymoSistema.Repository.ProjectRepository;
import KompleksinisProjektas.ProjektuValdymoSistema.Repository.UserRepository;
import KompleksinisProjektas.ProjektuValdymoSistema.dtos.*;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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

    public ProjectTeamMembersDTO addUsersToProjectTeam(int projectId, List<Integer> userIds) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectDoesNotExistException("Toks projektas neegzsituoja"));

        List<User> usersToAdd = new ArrayList<>();

        for (Integer userId : userIds) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new UserDoesNotExistException("Naudotojas su ID: " + userId + " neegzistuoja"));

            if(!user.getRole().equals(Role.Team_member)) {
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

        List<UserDTO> teamMembersDTO = project.getTeamMembers()
                .stream()
                .map(user -> new UserDTO(user))
                .collect(Collectors.toList());

        return new ProjectTeamMembersDTO(project.getId(), teamMembersDTO);
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

    public List<ProjectDTO> getAssignedProjects() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = (String) authentication.getPrincipal();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserDoesNotExistException("Naudotojas su paštu: " + email + " neegzistuoja"));

        List<Project> assignedProjects;

        if(currentUser.getRole() == Role.Team_leader) {
            assignedProjects = projectRepository.findByTeamLeaderIdAndProjectStatus(currentUser.getId(), ProjectStatus.InProgress);
        }
        else if(currentUser.getRole() == Role.Team_member) {
            assignedProjects = currentUser.getProjects()
                    .stream()
                    .filter(project -> project.getProjectStatus() == ProjectStatus.InProgress)
                    .toList();
        } else {
            assignedProjects = projectRepository.findAll();
        }
        List<ProjectDTO> assignedProjectsDTOs = new ArrayList<>();
        for(Project assignedProject : assignedProjects) {
            assignedProjectsDTOs.add(new ProjectDTO(assignedProject));
        }

        return assignedProjectsDTOs;
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
        project = projectRepository.save(project);
        return project.getProjectStatus();
    }
}
