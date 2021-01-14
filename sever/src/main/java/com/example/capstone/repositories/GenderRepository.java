package com.example.capstone.repositories;

import com.example.capstone.entities.Gender;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GenderRepository extends JpaRepository<Gender, Long> {
    List<Gender> getByYear(String year);
}
