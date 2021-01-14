package com.example.capstone.repositories;

import com.example.capstone.entities.Dept;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeptRepository extends JpaRepository<Dept, Long> {
    List<Dept> getByYear(String year);
}
