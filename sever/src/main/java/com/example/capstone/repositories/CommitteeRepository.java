package com.example.capstone.repositories;

import com.example.capstone.entities.Committee;
import com.example.capstone.entities.User;
import com.example.capstone.projections.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommitteeRepository extends JpaRepository<Committee, Long> {

    List<Committee> findByYearBetween(String startYear, String endYear);

    List<Committee> findByYear(String year);

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