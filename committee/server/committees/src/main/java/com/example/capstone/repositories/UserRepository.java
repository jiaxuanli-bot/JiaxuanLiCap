package com.example.capstone.repositories;

import com.example.capstone.entitiesNew.Committee;
import com.example.capstone.entitiesNew.User;
import com.example.capstone.projections.CommitteeSummary;
import com.example.capstone.projections.UserSummary;
import com.example.capstone.projections.UserWithCommittees;
import com.example.capstone.projections.UserYearsOnly;
import com.sun.istack.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    User findByIdEquals(Long id);

    List<UserYearsOnly> findDistinctByEmailOrderByYearAsc(String email);

    List<UserSummary> findByCommitteesEquals(Committee c);

    User findByEmailEquals(String email);

    List<UserSummary> findByVolunteeredCommitteesEquals(Committee c);

    User save(User u);

}
