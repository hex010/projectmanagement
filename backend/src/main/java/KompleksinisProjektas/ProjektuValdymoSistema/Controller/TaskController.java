package KompleksinisProjektas.ProjektuValdymoSistema.Controller;

import KompleksinisProjektas.ProjektuValdymoSistema.Exceptions.StorageSaveException;
import KompleksinisProjektas.ProjektuValdymoSistema.Service.TaskService;
import KompleksinisProjektas.ProjektuValdymoSistema.dtos.TaskDTO;
import KompleksinisProjektas.ProjektuValdymoSistema.dtos.TaskFDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;


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

    @PostMapping("/uploadProjectDocument/{taskId}")
    public ResponseEntity<Void> addTaskDocument(@PathVariable int taskId, @RequestParam("taskFile") MultipartFile taskFile) {
        try {
            taskService.addTaskDocument(taskId, taskFile);
        } catch (IOException e) {
            throw new StorageSaveException("Nepavyko įkelti užduoties failą");
        }
        return ResponseEntity.ok().build();
    }
}
