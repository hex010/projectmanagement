package KompleksinisProjektas.ProjektuValdymoSistema.Controller;

import KompleksinisProjektas.ProjektuValdymoSistema.Model.Project;
import KompleksinisProjektas.ProjektuValdymoSistema.Service.AuthService;
import KompleksinisProjektas.ProjektuValdymoSistema.Service.ProjectService;
import KompleksinisProjektas.ProjektuValdymoSistema.dtos.LoginRequestDTO;
import KompleksinisProjektas.ProjektuValdymoSistema.dtos.LoginRequestFDTO;
import KompleksinisProjektas.ProjektuValdymoSistema.dtos.ProjectCreationFDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/project")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;

    @PostMapping("/create")
    public ResponseEntity<Project> loginUser(@RequestBody ProjectCreationFDTO projectCreationFDTO) {
        Project project = projectService.createNewProject(projectCreationFDTO);

        return ResponseEntity.ok(project);
    }
}
