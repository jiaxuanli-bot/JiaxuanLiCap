package com.example.capstone.repositories;

import com.example.capstone.entities.College;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CollegeRepository extends JpaRepository<College, Long> {
    List<College> getByYear(String year);
}
