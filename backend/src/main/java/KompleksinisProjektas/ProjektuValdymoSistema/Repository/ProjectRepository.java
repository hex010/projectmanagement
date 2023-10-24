package KompleksinisProjektas.ProjektuValdymoSistema.Repository;

import KompleksinisProjektas.ProjektuValdymoSistema.Model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Integer> {
    Project findByName(String name);
}
