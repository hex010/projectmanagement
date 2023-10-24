package KompleksinisProjektas.ProjektuValdymoSistema.Service;

import KompleksinisProjektas.ProjektuValdymoSistema.Model.Project;
import KompleksinisProjektas.ProjektuValdymoSistema.Repository.ProjectRepository;
import KompleksinisProjektas.ProjektuValdymoSistema.dtos.ProjectCreationFDTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class ProjectService {
    private final ProjectRepository projectRepository;

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
}
