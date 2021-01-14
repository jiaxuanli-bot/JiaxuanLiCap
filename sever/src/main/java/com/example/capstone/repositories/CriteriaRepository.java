package com.example.capstone.repositories;

import com.example.capstone.entities.Committee;
import com.example.capstone.entities.Criteria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CriteriaRepository extends JpaRepository<Criteria, Long> {
    List<Criteria> findByCommitteeEquals(Committee c);
}