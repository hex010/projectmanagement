package KompleksinisProjektas.ProjektuValdymoSistema.Controller;

import KompleksinisProjektas.ProjektuValdymoSistema.Model.Project;
import KompleksinisProjektas.ProjektuValdymoSistema.Service.AuthService;
import KompleksinisProjektas.ProjektuValdymoSistema.Service.ProjectService;
import KompleksinisProjektas.ProjektuValdymoSistema.dtos.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/project")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;

    @PostMapping("/create")
    public ResponseEntity<Project> createProject(@RequestBody ProjectCreationFDTO projectCreationFDTO) {
        Project project = projectService.createNewProject(projectCreationFDTO);

        return ResponseEntity.ok(project);
    }

    @GetMapping("/get/{projectId}")
    public ResponseEntity<ProjectDTO> getProject(@PathVariable int projectId) {
        ProjectDTO projectDTO = projectService.getProjectById(projectId);
        return ResponseEntity.ok(projectDTO);
    }

    @PostMapping("/{projectId}/addUsers")
    public ResponseEntity<ProjectTeamMembersDTO> addUsersToProjectTeam(
            @PathVariable Integer projectId, @RequestBody List<Integer> userIds) {
        ProjectTeamMembersDTO projectTeamMembersDTO = projectService.addUsersToProjectTeam(projectId, userIds);
        return ResponseEntity.ok(projectTeamMembersDTO);
    }
}
