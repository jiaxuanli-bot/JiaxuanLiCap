package com.example.capstone.controller;

import com.example.capstone.entities.Committee;
import com.example.capstone.entities.Criteria;
import com.example.capstone.entities.Survey;
import com.example.capstone.entities.User;
import com.example.capstone.projections.*;
import com.example.capstone.service.CommitteeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import javax.validation.constraints.Pattern;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping( "/api/v1" )
@Validated

public class CommitteeController {

    @Autowired
    private CommitteeService committeeService;

    @RequestMapping( value="/committees", method=RequestMethod.GET )
    public List<CommitteeSummary> getYearsCommittees(
            @Pattern( regexp = "\\b\\d{4}\\b", message = "the start year format is wrong") @RequestParam(defaultValue = "2000") String startYear,
            @Pattern(regexp = "\\b\\d{4}\\b", message = "the end year format is wrong") @RequestParam(defaultValue = "2050")String endYear) {
        return committeeService.getYearsCommittees(startYear, endYear);
    }

    @RequestMapping( value="/hashedCommittees", method=RequestMethod.GET )
    public Map<String,List<Committee>> getYearsCommitteesWithGroup(@Pattern( regexp = "\\b\\d{4}\\b", message = "the start year format is wrong") @RequestParam(name="startYear", required=true) String startYear, @Pattern(regexp = "\\b\\d{4}\\b", message = "the end year format is wrong") @RequestParam(name="endYear",required = true)String endYear) {
        return committeeService.getCommittees(startYear, endYear);
    }

    @RequestMapping( value="/committees/years", method=RequestMethod.GET )
    public List<String> getCommitteesYears() {
        return committeeService.getCommitteesYears();
    }

    @RequestMapping( value="/committees/{name}/years/{year}", method=RequestMethod.GET )
    public String getCommitteeIdByYearAndName(@PathVariable String name, @PathVariable String year) {
        return committeeService.getCommitteeIdByYearAndName(name, year);
    }

    @RequestMapping( value="/committees/{id}/years", method=RequestMethod.GET )
    public List<String> getCommitteeYears(@Pattern( regexp = "^[0-9]*$", message = "the CommitteeID format is wrong") @PathVariable String id ) {
        return committeeService.getCommitteeYears(Long.valueOf(id));
    }

    @RequestMapping( value="/committees/{id}", method=RequestMethod.GET )
    public CommitteeWithUserSummaries getCommittee(@Pattern(regexp = "^[0-9]*$", message = "the CommitteeID format is wrong") @PathVariable String id ) {
        return committeeService.getCommittee(Long.valueOf(id));
    }

    @RequestMapping( value="/committees/{id}", method=RequestMethod.DELETE )
    public void deleteCommittee(@Pattern(regexp = "^[0-9]*$", message = "the CommitteeID format is wrong") @PathVariable String id ) {
        committeeService.deleteCommitteeById(Long.valueOf(id));
    }

    @RequestMapping( value="/committees/{id}/members", method=RequestMethod.GET )
    public List<UserSummary> getCommitteeMembers(@Pattern( regexp = "^[0-9]*$", message = "the CommitteeID format is wrong") @PathVariable String id) {
        return committeeService.getCommitteeMembers(Long.valueOf(id));
    }

    @RequestMapping( value="/committees/{id}/volunteers", method=RequestMethod.GET )
    public List<Survey> getCommitteeVolunteers(@Pattern( regexp = "^[0-9]*$", message = "the CommitteeID format is wrong") @PathVariable String id){
        //Get all volunteers information for one committee for current year
        return committeeService.getCommitteeVolunteers(Long.valueOf(id));
    }

    @RequestMapping( value="/committees/{id}/volunteers/users", method=RequestMethod.GET )
    public List<UserSummary> getCommitteeVolunteersDetail(@Pattern( regexp = "^[0-9]*$", message = "the CommitteeID format is wrong") @PathVariable String id){
        //Get all volunteers information for one committee for current year
        return committeeService.getCommitteeVolunteersDetail(Long.valueOf(id));
    }

    @RequestMapping( value="/committees/{id}/members/{userId}", method=RequestMethod.PUT )
    public User assignCommitteeMember(@Pattern( regexp = "^[0-9]*$", message = "the CommitteeID format is wrong") @PathVariable String id, @Pattern( regexp = "^[0-9]*$", message = "the MemberID format is wrong") @PathVariable String userId){
        return committeeService.assignCommitteeMember(Long.valueOf(id), Long.valueOf(userId));
    }

    @RequestMapping( value="/committees/{id}/members/{memberId}", method=RequestMethod.DELETE )
    public User removeMember(@Pattern( regexp = "^[0-9]*$", message = "delete the CommitteeID format is wrong")  @PathVariable String id, @Pattern( regexp = "^[0-9]*$", message = "the MemberID format is wrong") @PathVariable String memberId) {
        return committeeService.removeMember(Long.valueOf(id),Long.valueOf(memberId));
    }

    @RequestMapping( value="/committees", method=RequestMethod.POST)
    public void createUser(@RequestBody(required=true) Committee committee) {
        //create a new committee
        this.committeeService.ceateCommittee(committee);
    }

    @RequestMapping( value="/committees/{id}/unsatisfiedCriteria", method=RequestMethod.GET)
    public List<Criteria> unsatisfiedCriteria(@Pattern( regexp = "^[0-9]*$", message = "the CommitteeID format is wrong") @PathVariable String id) {
        //checking if all criteria is meted
        return this.committeeService.failingCriteria(this.committeeService.getCommitteeDetail(Long.valueOf(id)));
    }
}

