package KompleksinisProjektas.ProjektuValdymoSistema.Repository;

import KompleksinisProjektas.ProjektuValdymoSistema.Model.Project;
import KompleksinisProjektas.ProjektuValdymoSistema.Model.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Integer> {
    Project findByName(String name);
    List<Project> findByTeamLeaderIdAndProjectStatus(Integer teamLeader_id, ProjectStatus projectStatus);
    List<Project> findByTeamLeaderId(Integer id);
    List<Project> findByProjectStatus(ProjectStatus projectStatus);
}
