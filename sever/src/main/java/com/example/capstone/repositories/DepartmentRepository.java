package com.example.capstone.repositories;

import com.example.capstone.entities.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    List<Department> getByYear(String year);
}
