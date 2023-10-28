package KompleksinisProjektas.ProjektuValdymoSistema.Repository;

import KompleksinisProjektas.ProjektuValdymoSistema.Model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Integer> {
}
