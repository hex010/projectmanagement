package KompleksinisProjektas.ProjektuValdymoSistema.Controller;

import KompleksinisProjektas.ProjektuValdymoSistema.Service.ProjectService;
import KompleksinisProjektas.ProjektuValdymoSistema.Service.TaskService;
import KompleksinisProjektas.ProjektuValdymoSistema.dtos.ProjectTeamMembersDTO;
import KompleksinisProjektas.ProjektuValdymoSistema.dtos.TaskDTO;
import KompleksinisProjektas.ProjektuValdymoSistema.dtos.TaskFDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
