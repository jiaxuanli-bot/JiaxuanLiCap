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

import com.example.capstone.entities.College;
import com.example.capstone.repositories.CollegeRepository;

@RestController
@RequestMapping( "/api/v1/colleges" )
@Validated
public class CollegeController {

    @Autowired
    private CollegeRepository collegeRepo;
	
    @RequestMapping( value="", method= RequestMethod.GET)
    public List<College> getGenders(@Pattern( regexp = "\\b\\d{4}\\b", message = "the year format is wrong") @RequestParam(required=true) String year) {
        return this.collegeRepo.getByYear(year);
    }
    
    @RequestMapping( value="", method= RequestMethod.POST)
    public College createGender( @RequestBody( required=true ) College gender) {
        return this.collegeRepo.save( gender );
    }


    @RequestMapping( value="/{id}", method= RequestMethod.DELETE)
    public ResponseEntity<String> deleteGender(@PathVariable String id ) {
    	this.collegeRepo.deleteById( Long.valueOf(id) );
    	return new ResponseEntity<>("OK", HttpStatus.NO_CONTENT);
    }
    
    @RequestMapping( value="", method= RequestMethod.PUT)
    public College updateGender( @RequestBody( required=true ) College c ) {
    	College college = this.collegeRepo.findById( c.getId() ).orElse( null );
    	if( college != null ) { 
    		return this.collegeRepo.save( c );
    	} else {
    		throw new IllegalArgumentException();
    	}
    }    
}
