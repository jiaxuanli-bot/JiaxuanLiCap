package uwl.senate.coc.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import uwl.senate.coc.entities.College;

import java.util.List;

public interface CollegeRepository extends JpaRepository<College, Long> {
    List<College> findByYear(String year);
}
