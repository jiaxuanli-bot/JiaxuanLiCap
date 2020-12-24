package com.example.capstone.repositories;

import com.example.capstone.entities.Committee;
import com.example.capstone.entities.Duty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DutyRepository extends JpaRepository<Duty, Long> {
    Duty save(Duty c);

    List<Duty> findByCommitteeEquals(Committee c);
}
