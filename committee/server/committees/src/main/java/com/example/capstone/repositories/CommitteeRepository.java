package com.example.capstone.repositories;

import com.example.capstone.entities.Volunteer;
import com.example.capstone.entitiesNew.Committee;
import com.example.capstone.entitiesNew.User;
import com.example.capstone.projections.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommitteeRepository extends JpaRepository<Committee, Long> {

    List<CommitteesWithMembersAndVolunteers> findByYearBetween(String startYear, String endYear);

    List<CommitteeSummary> findByYearBetweenAndIdNotNull(String startYear, String endYear);

    List<CommitteesYearsOnly> findDistinctByYearNotNullOrderByYearAsc();

    List<CommitteesYearsOnly> findDistinctByYearNotNullAndIdEqualsOrderByYearAsc(Long id);

    List<CommitteesYearsOnly> findDistinctByNameEquals(String name);

    CommitteesWithMembersAndVolunteers findByIdEqualsAndIdNotNull(Long id);

    CommitteesMembers findByIdEquals(Long id);

    CommitteeVolunteers findByIdIs(Long id);

    List<CommitteeSummary> findByMembersAndYearEquals(User u, String year);

    List<CommitteeSummary> findByVolunteers(User v);
}