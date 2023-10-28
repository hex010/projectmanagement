package KompleksinisProjektas.ProjektuValdymoSistema.Service;

import KompleksinisProjektas.ProjektuValdymoSistema.Exceptions.ProjectDoesNotExistException;
import KompleksinisProjektas.ProjektuValdymoSistema.Exceptions.UnauthorizedTaskAdditionException;
import KompleksinisProjektas.ProjektuValdymoSistema.Exceptions.UserDoesNotExistException;
import KompleksinisProjektas.ProjektuValdymoSistema.Model.Project;
import KompleksinisProjektas.ProjektuValdymoSistema.Model.Task;
import KompleksinisProjektas.ProjektuValdymoSistema.Model.User;
import KompleksinisProjektas.ProjektuValdymoSistema.Repository.ProjectRepository;
import KompleksinisProjektas.ProjektuValdymoSistema.Repository.TaskRepository;
import KompleksinisProjektas.ProjektuValdymoSistema.Repository.UserRepository;
import KompleksinisProjektas.ProjektuValdymoSistema.dtos.TaskDTO;
import KompleksinisProjektas.ProjektuValdymoSistema.dtos.TaskFDTO;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    public TaskDTO addTaskToProject(TaskFDTO taskFDTO) {
        Project project = projectRepository.findById(taskFDTO.getProjectId())
                .orElseThrow(() -> new ProjectDoesNotExistException("Toks projektas neegzsituoja"));

        User foundUser = project.getTeamMembers().stream()
                .filter(user -> user.getId() == taskFDTO.getOwnerId())
                .findFirst()
                .orElse(null);

        if(foundUser == null) {
            throw new UserDoesNotExistException("Naudotojas nėra komandos narys");
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            String email = (String) authentication.getPrincipal();
            if(!project.getTeamLeader().getEmail().equals(email)) {
                throw new UnauthorizedTaskAdditionException("Jūs nesate šio projekto vadovas");
            }
        }

        Task task = new Task(taskFDTO, project, foundUser);

        task = taskRepository.save(task);
        return new TaskDTO(task);
    }
}
