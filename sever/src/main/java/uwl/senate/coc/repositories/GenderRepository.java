package uwl.senate.coc.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import uwl.senate.coc.entities.Gender;

import java.util.List;

public interface GenderRepository extends JpaRepository<Gender, Long> {
    List<Gender> getByYear(String year);
}
