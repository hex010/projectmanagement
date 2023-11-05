package KompleksinisProjektas.ProjektuValdymoSistema.Controller;

import KompleksinisProjektas.ProjektuValdymoSistema.Exceptions.StorageSaveException;
import KompleksinisProjektas.ProjektuValdymoSistema.Service.ProjectService;
import KompleksinisProjektas.ProjektuValdymoSistema.dtos.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/project")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;

    @PostMapping("/create")
    public ResponseEntity<ProjectDTO> createProject(@RequestBody ProjectCreationFDTO projectCreationFDTO) {
        ProjectDTO createdProject = projectService.createNewProject(projectCreationFDTO);

        return ResponseEntity.ok(createdProject);
    }

    @PostMapping("/uploadProjectDocument/{projectId}")
    public ResponseEntity<Void> addProjectDocument(@PathVariable int projectId, @RequestParam("projectFile") MultipartFile projectFile) {
        try {
            projectService.addProjectDocument(projectId, projectFile);
        } catch (IOException e) {
            throw new StorageSaveException("Nepavyko įkelti projekto failą");
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/get/{projectId}")
    public ResponseEntity<ProjectDTO> getProject(@PathVariable int projectId) {
        ProjectDTO projectDTO = projectService.getProjectById(projectId);
        return ResponseEntity.ok(projectDTO);
    }

    @PostMapping("/{projectId}/addUsers")
    public ResponseEntity<ProjectTeamMembersDTO> addUsersToProjectTeam(
            @PathVariable int projectId, @RequestBody List<Integer> userIds) {
        ProjectTeamMembersDTO projectTeamMembersDTO = projectService.addUsersToProjectTeam(projectId, userIds);
        return ResponseEntity.ok(projectTeamMembersDTO);
    }
}
