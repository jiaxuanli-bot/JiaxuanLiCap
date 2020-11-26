package com.example.capstone.repositories;

import com.example.capstone.entities.Committee;
import com.example.capstone.entities.User;
import com.example.capstone.projections.UserSummary;
import com.example.capstone.projections.UserYearsOnly;
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

    User findByEmailEqualsAndYearEquals(String email, String year);

    List<User> findByYear( String year);
}
