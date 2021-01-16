package com.example.capstone.controller;

import java.util.List;

import javax.validation.constraints.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.capstone.entities.Department;
import com.example.capstone.repositories.DepartmentRepository;

@RestController
@RequestMapping( "/api/v1/departments" )
@Validated
public class DepartmentController {

    @Autowired
    DepartmentRepository deptRepo;
	
    @RequestMapping( value="", method= RequestMethod.GET)
    public List<Department> getDepartments(@Pattern( regexp = "\\b\\d{4}\\b", message = "the year format is wrong") @RequestParam(required=true) String year) {
        return this.deptRepo.getByYear(year);
    }
    
    @RequestMapping( value="", method= RequestMethod.POST)
    public Department createDepartment( @RequestBody( required=true ) Department department) {
        return this.deptRepo.save( department );
    }
    
    
    @RequestMapping( value="/{id}", method= RequestMethod.DELETE)
    public ResponseEntity<String> deleteDepartment(@PathVariable String id ) {
    	this.deptRepo.deleteById( Long.valueOf(id) );
    	
    	return new ResponseEntity<>("OK", HttpStatus.NO_CONTENT);
    }
    
    @RequestMapping( value="", method= RequestMethod.PUT)
    public Department updateDepartment( @RequestBody( required=true ) Department department ) {
    	Department d = this.deptRepo.findById( department.getId() ).orElse( null );
    	
    	if( d != null ) { 
    		return this.deptRepo.save( department );
    	} else {
    		throw new IllegalArgumentException();
    	}
    }    
}
