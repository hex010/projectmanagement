package KompleksinisProjektas.ProjektuValdymoSistema.Controller;

import KompleksinisProjektas.ProjektuValdymoSistema.Exceptions.StorageSaveException;
import KompleksinisProjektas.ProjektuValdymoSistema.Model.ProjectStatus;
import KompleksinisProjektas.ProjektuValdymoSistema.Service.ProjectService;
import KompleksinisProjektas.ProjektuValdymoSistema.dtos.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
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

    @GetMapping("/get/assigned")
    public ResponseEntity<List<ProjectDTO>> getAssignedProjects(@RequestParam(value = "filter", required = false, defaultValue = "Vykdomi") String filterOption) {
        List<ProjectDTO> projectDTOs = projectService.getAssignedProjects(filterOption);
        return ResponseEntity.ok(projectDTOs);
    }

    @PostMapping("/{projectId}/addUsers")
    public ResponseEntity<List<UserDTO>> addUsersToProjectTeam(
            @PathVariable int projectId, @RequestBody List<Integer> userIds) {
        List<UserDTO> projectTeamMembersDTO = projectService.addUsersToProjectTeam(projectId, userIds);
        return ResponseEntity.ok(projectTeamMembersDTO);
    }

    @PutMapping("/finish")
    public ResponseEntity<ProjectStatus> finishProject(@RequestBody ProjectFinishFDTO projectFinishFDTO) {
        ProjectStatus projectStatus = projectService.finishProject(projectFinishFDTO);
        return ResponseEntity.ok(projectStatus);
    }

    @GetMapping("/get/statistics/{projectId}")
    public ResponseEntity<ProjectTasksStatisticsDTO> getProjectStatistics(@PathVariable int projectId) {
        ProjectTasksStatisticsDTO projectTasksStatisticsDTO = projectService.getProjectStatistics(projectId);
        return ResponseEntity.ok(projectTasksStatisticsDTO);
    }

    @GetMapping("/get/report/{projectId}")
    public ResponseEntity<byte[]> generateProjectReport(@PathVariable int projectId) throws IOException {
        byte[] pdfBytes = projectService.generateProjectReport(projectId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("inline", "ProjectReport.pdf");

        return ResponseEntity.ok().headers(headers).body(pdfBytes);
    }
}
