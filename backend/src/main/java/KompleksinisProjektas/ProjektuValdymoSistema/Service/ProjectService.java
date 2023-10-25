package KompleksinisProjektas.ProjektuValdymoSistema.Service;

import KompleksinisProjektas.ProjektuValdymoSistema.Exceptions.ProjectDoesNotExistException;
import KompleksinisProjektas.ProjektuValdymoSistema.Exceptions.UserAlreadyExistsInProjectException;
import KompleksinisProjektas.ProjektuValdymoSistema.Exceptions.UserDoesNotExistException;
import KompleksinisProjektas.ProjektuValdymoSistema.Exceptions.UserRoleNotMatch;
import KompleksinisProjektas.ProjektuValdymoSistema.Model.Project;
import KompleksinisProjektas.ProjektuValdymoSistema.Model.Role;
import KompleksinisProjektas.ProjektuValdymoSistema.Model.User;
import KompleksinisProjektas.ProjektuValdymoSistema.Repository.ProjectRepository;
import KompleksinisProjektas.ProjektuValdymoSistema.Repository.UserRepository;
import KompleksinisProjektas.ProjektuValdymoSistema.dtos.ProjectCreationFDTO;
import KompleksinisProjektas.ProjektuValdymoSistema.dtos.ProjectDTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Service
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public Project createNewProject(ProjectCreationFDTO projectCreationFDTO) {
        Project project = new Project();
        project.setName(projectCreationFDTO.getName());
        project.setDescription(projectCreationFDTO.getDescription());
        project.setFilePath(projectCreationFDTO.getFilePath());
        project.setStartDate(projectCreationFDTO.getStartDate());
        project.setEndDate(projectCreationFDTO.getEndDate());

        project = projectRepository.save(project);

        return project;
    }

    public ProjectDTO getProjectById(int id) {
        Project project = projectRepository.findById(id).orElseThrow(() -> new ProjectDoesNotExistException("Toks projektas neegzsituoja"));

        return new ProjectDTO(project.getId(), project.getName(), project.getDescription(), project.getFilePath(), project.getStartDate(), project.getEndDate());
    }

    public ProjectDTO addUsersToProjectTeam(Integer projectId, List<Integer> userIds) {
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

        return new ProjectDTO(project.getId(), project.getName(), project.getDescription(), project.getFilePath(), project.getStartDate(), project.getEndDate());
    }
}
