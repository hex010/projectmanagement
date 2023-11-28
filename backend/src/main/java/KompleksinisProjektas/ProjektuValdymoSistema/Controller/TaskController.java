package KompleksinisProjektas.ProjektuValdymoSistema.Controller;

import KompleksinisProjektas.ProjektuValdymoSistema.Exceptions.StorageSaveException;
import KompleksinisProjektas.ProjektuValdymoSistema.Model.ProjectStatus;
import KompleksinisProjektas.ProjektuValdymoSistema.Model.TaskStatus;
import KompleksinisProjektas.ProjektuValdymoSistema.Service.TaskService;
import KompleksinisProjektas.ProjektuValdymoSistema.dtos.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/task")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;

    @PostMapping("/add")
    public ResponseEntity<TaskDTO> addTaskToProject(@RequestBody TaskFDTO taskFDTO) {
        TaskDTO addedTask = taskService.addTaskToProject(taskFDTO);
        return ResponseEntity.ok(addedTask);
    }

    @GetMapping("/get/{taskId}")
    public ResponseEntity<TaskDTO> getTask(@PathVariable int taskId) {
        TaskDTO taskDTO = taskService.getTask(taskId);
        return ResponseEntity.ok(taskDTO);
    }

    @PostMapping("/uploadProjectDocument/{taskId}")
    public ResponseEntity<Void> addTaskDocument(@PathVariable int taskId, @RequestParam("taskFile") MultipartFile taskFile) {
        try {
            taskService.addTaskDocument(taskId, taskFile);
        } catch (IOException e) {
            throw new StorageSaveException("Nepavyko įkelti užduoties failą");
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/get/assigned/{projectId}")
    public ResponseEntity<List<TaskDTO>> getAssignedTasksOfProject(@PathVariable int projectId) {
        List<TaskDTO> tasks = taskService.getAssignedTasksOfProject(projectId);
        return ResponseEntity.ok(tasks);
    }

    @PutMapping("/updateStatus")
    public ResponseEntity<TaskStatus> updateTaskStatus(@RequestBody TaskStatusUpdateFDTO taskStatusUpdateFDTO) {
        TaskStatus taskStatus = taskService.updateTaskStatus(taskStatusUpdateFDTO);
        return ResponseEntity.ok(taskStatus);
    }

    @PostMapping("/comment")
    public ResponseEntity<TaskCommentDTO> addTaskComment(@RequestBody TaskCommentRequestFDTO taskCommentRequestFDTO) {
        TaskCommentDTO taskCommentDTO = taskService.addTaskComment(taskCommentRequestFDTO);
        return ResponseEntity.ok(taskCommentDTO);
    }

    @GetMapping("/get/comments/{taskId}")
    public ResponseEntity<List<TaskCommentDTO>> getTaskComments(@PathVariable int taskId) {
        List<TaskCommentDTO> taskCommentDTOs = taskService.getTaskComments(taskId);
        return ResponseEntity.ok(taskCommentDTOs);
    }

    @PostMapping("/generate")
    public ResponseEntity<Void> generateComments() {
        taskService.generateCommentsWithReplies();
        return ResponseEntity.ok().build();
    }
}
