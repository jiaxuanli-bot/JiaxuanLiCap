package uwl.senate.coc.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import uwl.senate.coc.entities.Department;

import java.util.List;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    List<Department> getByYear(String year);
}
