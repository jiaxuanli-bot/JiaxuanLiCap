package uwl.senate.coc.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import uwl.senate.coc.entities.Committee;
import uwl.senate.coc.entities.User;
import uwl.senate.coc.projections.*;

import java.util.List;

@Repository
public interface CommitteeRepository extends JpaRepository<Committee, Long> {

    List<CommitteeWithUserSummaries> findByYearBetween(String startYear, String endYear);
    
    <T> List<T> findByYear(String year, Class<T> type);

    List<CommitteeSummary> findByYearBetweenAndIdNotNull(String startYear, String endYear);

    List<CommitteeYear> findDistinctByYearNotNullOrderByYearAsc();

    List<CommitteeYear> findDistinctByYearNotNullAndIdEqualsOrderByYearAsc(Long id);

    List<CommitteeYear> findDistinctByNameEquals(String name);

    CommitteeWithUserSummaries findByIdEqualsAndIdNotNull(Long id);

    CommitteeMembers findByIdEquals(Long id);

    CommitteeVolunteers findByIdIs(Long id);

    CommitteeSummary findByNameEqualsAndYearEquals(String name, String year);

    List<CommitteeSummary> findByMembers(User u);

    List<CommitteeSummary> findByVolunteers(User v);
}