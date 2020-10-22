package com.example.capstone.repositories;

import com.example.capstone.entitiesNew.Duty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DutyRepository extends JpaRepository<Duty, Long> {

}
