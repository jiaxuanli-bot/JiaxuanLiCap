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

import com.example.capstone.entities.Gender;
import com.example.capstone.repositories.GenderRepository;

@RestController
@RequestMapping( "/api/v1/genders" )
@Validated
public class GenderController {

    @Autowired
    GenderRepository genderRepo;
	
    @RequestMapping( value="", method= RequestMethod.GET)
    public List<Gender> getGenders(@Pattern( regexp = "\\b\\d{4}\\b", message = "the year format is wrong") @RequestParam(required=true) String year) {
        return this.genderRepo.getByYear(year);
    }
    
    @RequestMapping( value="", method= RequestMethod.POST)
    public Gender createGender( @RequestBody( required=true ) Gender gender) {
        return this.genderRepo.save( gender );
    }
    
    
    @RequestMapping( value="/{id}", method= RequestMethod.DELETE)
    public ResponseEntity<String> deleteGender(@PathVariable String id ) {
    	this.genderRepo.deleteById( Long.valueOf(id) );
    	
    	return new ResponseEntity<>("OK", HttpStatus.NO_CONTENT);
    }
    
    @RequestMapping( value="", method= RequestMethod.PUT)
    public Gender updateGender( @RequestBody( required=true ) Gender gender ) {
    	Gender d = this.genderRepo.findById( gender.getId() ).orElse( null );
    	
    	if( d != null ) { 
    		return this.genderRepo.save( gender );
    	} else {
    		throw new IllegalArgumentException();
    	}
    }    
}
