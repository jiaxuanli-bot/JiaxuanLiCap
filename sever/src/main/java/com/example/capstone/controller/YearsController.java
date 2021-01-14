package com.example.capstone.controller;

import com.example.capstone.service.CommitteeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.Pattern;

@RestController
@RequestMapping( "/api/v1" )
@Validated
public class YearsController {

    @Autowired
    private CommitteeService committeeService;

    @RequestMapping( value="/years/{year}", method=RequestMethod.POST )
    public String createSurvey(@Pattern( regexp = "\\b\\d{4}\\b", message = "the year format is wrong")  @PathVariable String year) {
        //Create a new survey that user volunteer one committee
        committeeService.createYear(year);
        return year;
    }
}
