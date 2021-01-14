package com.example.capstone.controller;

import com.example.capstone.entities.College;
import com.example.capstone.entities.Dept;
import com.example.capstone.entities.Gender;
import com.example.capstone.repositories.CollegeRepository;
import com.example.capstone.repositories.DeptRepository;
import com.example.capstone.repositories.GenderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.Pattern;
import java.util.List;

@RestController
@RequestMapping( "/api/v1" )
@Validated
public class Settings {

    @Autowired
    DeptRepository deptRepo;

    @Autowired
    CollegeRepository collegeRepo;

    @Autowired
    GenderRepository genderRepo;

    @RequestMapping( value="/setting/{year}/dept", method= RequestMethod.GET)
    public List<Dept> getDeptByYear(@Pattern( regexp = "\\b\\d{4}\\b", message = "the year format is wrong") @PathVariable String year) {
        //get depts by year
        return this.deptRepo.getByYear(year);
    }

    @RequestMapping( value="/setting/{year}/gender", method= RequestMethod.GET)
    public List<Gender> getGenderByYear(@Pattern( regexp = "\\b\\d{4}\\b", message = "the year format is wrong") @PathVariable String year) {
        //get Gender by year
        return this.genderRepo.getByYear(year);
    }

    @RequestMapping( value="/setting/{year}/college", method= RequestMethod.GET)
    public List<College> getCollegeByYear(@Pattern( regexp = "\\b\\d{4}\\b", message = "the year format is wrong") @PathVariable String year) {
        //get Gender by year
        return this.collegeRepo.getByYear(year);
    }

}
