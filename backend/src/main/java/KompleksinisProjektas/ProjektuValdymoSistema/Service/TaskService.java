package KompleksinisProjektas.ProjektuValdymoSistema.Service;

import KompleksinisProjektas.ProjektuValdymoSistema.Exceptions.*;
import KompleksinisProjektas.ProjektuValdymoSistema.Model.*;
import KompleksinisProjektas.ProjektuValdymoSistema.Repository.ProjectRepository;
import KompleksinisProjektas.ProjektuValdymoSistema.Repository.TaskCommentRepository;
import KompleksinisProjektas.ProjektuValdymoSistema.Repository.TaskRepository;
import KompleksinisProjektas.ProjektuValdymoSistema.Repository.UserRepository;
import KompleksinisProjektas.ProjektuValdymoSistema.dtos.*;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

@AllArgsConstructor
@Service
public class TaskService {
    @Value("${file-storage}")
    private String fileStorageRootPath;

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final TaskCommentRepository taskCommentRepository;

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

    public void addTaskDocument(int taskId, MultipartFile taskFile) throws IOException {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskDoesNotExistException("Tokia projekto užduotis neegzsituoja"));

        if(taskFile.getOriginalFilename() == null) {
            throw new UploadFileException("Pasirintas projekto failas yra pažeistas");
        }

        long currentTimeMillis = System.currentTimeMillis();
        String fileName = currentTimeMillis + "_" + taskFile.getOriginalFilename();
        Path filePath = Paths.get(fileStorageRootPath, "Tasks", fileName);

        taskFile.transferTo(filePath.toFile());

        task.setFilePath(filePath.toString());
        taskRepository.save(task);
    }

    public List<TaskDTO> getAssignedTasksOfProject(int projectId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = (String) authentication.getPrincipal();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserDoesNotExistException("Naudotojas su paštu: " + email + " neegzistuoja"));

        Project project = projectRepository.findById(projectId).orElseThrow(() -> new ProjectDoesNotExistException("Toks projektas neegzsituoja"));

        List<TaskDTO> myTasks = new ArrayList<>();

        if(currentUser.getRole().equals(Role.KOMANDOS_NARYS)) {
            for (Task task : project.getTasks()) {
                if (task.getTaskOwner().getId().equals(currentUser.getId()) && !task.getTaskStatus().equals(TaskStatus.Completed)) {
                    myTasks.add(new TaskDTO(task));
                }
            }
        } else if(currentUser.getRole().equals(Role.KOMANDOS_VADOVAS)){
            for (Task task : project.getTasks()) {
                if(!task.getTaskStatus().equals(TaskStatus.Completed))
                    myTasks.add(new TaskDTO(task));
            }
        } else {
            for (Task task : project.getTasks()) {
                myTasks.add(new TaskDTO(task));
            }
        }

        return myTasks;
    }

    public TaskDTO getTask(int taskId) {
        Task task = taskRepository.findById(taskId).orElseThrow(() -> new TaskDoesNotExistException("Tokia projekto užduotis neegzsituoja"));
        return new TaskDTO(task);
    }

    public TaskStatus updateTaskStatus(TaskStatusUpdateFDTO taskStatusUpdateFDTO) {
        Task task = taskRepository.findById(taskStatusUpdateFDTO.getTaskId())
                .orElseThrow(() -> new TaskDoesNotExistException("Tokia projekto užduotis neegzsituoja"));

        task.setTaskStatus(taskStatusUpdateFDTO.getTaskStatus());

        if(taskStatusUpdateFDTO.getTaskStatus() == TaskStatus.Completed) {
            task.setTaskFinishComment(taskStatusUpdateFDTO.getTaskFinishComment());
            task.setFinishDate(new Date());
        } else if(taskStatusUpdateFDTO.getTaskStatus() == TaskStatus.InProgress) {
            task.setInProgressDate(new Date());
        }

        task = taskRepository.save(task);

        return task.getTaskStatus();
    }

    public TaskCommentDTO addTaskComment(TaskCommentRequestFDTO taskCommentRequestFDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = (String) authentication.getPrincipal();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserDoesNotExistException("Naudotojas su paštu: " + email + " neegzistuoja"));

        Task task = taskRepository.findById(taskCommentRequestFDTO.getTaskId())
                .orElseThrow(() -> new TaskDoesNotExistException("Tokia projekto užduotis neegzsituoja"));

        TaskComment newTaskComment = new TaskComment(taskCommentRequestFDTO.getDescription(), task, currentUser);

        if(taskCommentRequestFDTO.getParentCommentId() != -1) {
            TaskComment parentComment = taskCommentRepository.findById(taskCommentRequestFDTO.getParentCommentId())
                    .orElseThrow(() -> new CommentNotFoundException("Tokio komentaro neegzistuoja"));

            newTaskComment.setParentComment(parentComment);
        }

        newTaskComment = taskCommentRepository.save(newTaskComment);

        return new TaskCommentDTO(newTaskComment.getId(), taskCommentRequestFDTO.getDescription(), task.getId(), currentUser.getFirstname() + " " + currentUser.getLastname(), Collections.emptyList());
    }

    public List<TaskCommentDTO> getTaskComments(int taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskDoesNotExistException("Tokia projekto užduotis neegzsituoja"));

        List<TaskCommentDTO> taskCommentDTOS = new ArrayList<>();

        for (TaskComment taskComment : task.getCommets()) {
            if (taskComment.getParentComment() == null) {
                List<TaskCommentDTO> commentTree = buildCommentTree(taskComment);
                taskCommentDTOS.addAll(commentTree);
            }
        }

        return taskCommentDTOS;
    }

    private List<TaskCommentDTO> buildCommentTree(TaskComment taskComment) {
        List<TaskCommentDTO> commentTree = new ArrayList<>();
        List<TaskCommentDTO> replies = new ArrayList<>();

        for (TaskComment taskCommentReply : taskComment.getReplies()) {
            // rekursyviai isgauna visus atsakymus i atsakymus
            List<TaskCommentDTO> replyTree = buildCommentTree(taskCommentReply);
            replies.addAll(replyTree);
        }

        commentTree.add(new TaskCommentDTO(
                taskComment.getId(),
                taskComment.getDescription(),
                taskComment.getTask().getId(),
                taskComment.getUser().getFirstname() + " " + taskComment.getUser().getLastname(),
                replies
        ));

        return commentTree;
    }

    public boolean warnTeamMember(int taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskDoesNotExistException("Tokia projekto užduotis neegzsituoja"));

        task.setWarned(true);

        return taskRepository.save(task).isWarned();
    }
}
