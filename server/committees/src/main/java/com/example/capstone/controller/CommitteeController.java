package com.example.capstone.controller;

import com.example.capstone.entities.Committee;
import com.example.capstone.entities.CommitteeMember;
import com.example.capstone.entities.Survey;
import com.example.capstone.entities.User;
import com.example.capstone.service.CommitteeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.Pattern;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping( "/api/v1" )
@Validated
public class CommitteeController {
    @Autowired
    private CommitteeService committeeService;

//    @RequestMapping( value="/committees", method=RequestMethod.GET )
////    public ArrayList<Committee> getOneYearCommittees(@RequestParam(name="year", required=false) String year) {
////       System.out.println();System.out.println(year);
////       System.out.println("1");
////       return committeeService.getCommiteesByYear(year);
////    }

    @RequestMapping( value="/committees", method=RequestMethod.GET )
    public ArrayList<Committee> getYearsCommittees(@Pattern( regexp = "\\b\\d{4}\\b", message = "the start year format is wrong") @RequestParam(name="startYear", required=false) String startYear,@Pattern(regexp = "\\b\\d{4}\\b", message = "the end year format is wrong") @RequestParam(name="endYear",required = false)String endYear) {
        if (startYear != null && endYear != null)
        {
                return committeeService.getCommitteeByStartYearAndEndYear(startYear, endYear);
        }
        return committeeService.getCommitteeByStartYearAndEndYear("2000", "2050");
    }

    @RequestMapping( value="/hashedCommittees", method=RequestMethod.GET )
    public HashMap<String,ArrayList<Committee>> getYearsCommitteesWithGroup(@Pattern( regexp = "\\b\\d{4}\\b", message = "the start year format is wrong") @RequestParam(name="startYear", required=true) String startYear, @Pattern(regexp = "\\b\\d{4}\\b", message = "the end year format is wrong") @RequestParam(name="endYear",required = true)String endYear) {
        return committeeService.getHashedCommitteeByStartYearAndEndYear(startYear, endYear);
    }

    @RequestMapping( value="/committees/years", method=RequestMethod.GET )
    public ArrayList<String> getCommitteesYears() {
        return committeeService.getCommitteesYears();
    }

    @RequestMapping( value="/committees/{id}/years", method=RequestMethod.GET )
    public ArrayList<String> getCommitteeYears(@Pattern( regexp = "^[0-9]*$", message = "the CommitteeID format is wrong") @PathVariable String id ) {
        return committeeService.getCommitteeYears(id);
    }

    @RequestMapping( value="/committees/{id}", method=RequestMethod.GET )
    public Committee getCommittee(@Pattern( regexp = "^[0-9]*$", message = "the CommitteeID format is wrong") @PathVariable String id ) {
        ArrayList<Committee> committeeArrayList;
        committeeArrayList = committeeService.getCommitteeById(id);
        if (committeeArrayList.size() > 0) {
            return committeeArrayList.get(0);
        }
        return null;
    }

    @RequestMapping( value="/committees/{id}/members", method=RequestMethod.GET )
    public ArrayList<User> getCommitteeMembers(@Pattern( regexp = "^[0-9]*$", message = "the CommitteeID format is wrong") @PathVariable String id){
        return committeeService.getCommitteeMembersById(id);
    }

    @RequestMapping( value="/committees/{id}/volunteers", method=RequestMethod.GET )
    public ArrayList<Survey> getCommitteeVolunteers(@Pattern( regexp = "^[0-9]*$", message = "the CommitteeID format is wrong") @PathVariable String id){
        //Get all volunteers information for one committee for current year
       return committeeService.getCommitteeVolunteersById(id);
    }

    @RequestMapping( value="/committees/{id}/volunteers/users", method=RequestMethod.GET )
    public ArrayList<User> getCommitteeVolunteersDetail(@Pattern( regexp = "^[0-9]*$", message = "the CommitteeID format is wrong") @PathVariable String id){
        //Get all volunteers information for one committee for current year
        return committeeService.getCommitteeVolunteersUsersById(id);
    }

    @RequestMapping( value="/committees/{id}/members/{userId}", method=RequestMethod.PUT )
    public CommitteeMember assignCommitteeMember(@Pattern( regexp = "^[0-9]*$", message = "the CommitteeID format is wrong") @PathVariable String id,@Pattern( regexp = "^[0-9]*$", message = "the MemberID format is wrong") @PathVariable String userId){
        CommitteeMember committeeMember;
        committeeMember = committeeService.assignUser(userId , id);
        return committeeMember;
        //Assign a user to that committee
    }

    @RequestMapping( value="/committees/{id}/members/{memberId}", method=RequestMethod.DELETE )
    public CommitteeMember removeMember(@Pattern( regexp = "^[0-9]*$", message = "the CommitteeID format is wrong")  @PathVariable String id,@Pattern( regexp = "^[0-9]*$", message = "the MemberID format is wrong") @PathVariable String memberId) {
        CommitteeMember committeeMember;
        committeeMember = committeeService.getCommitteeMemberRecordByUIDAndCID(memberId, id);
        committeeService.deleteUser(memberId ,id);
        return committeeMember;
        //Delete one member from that committee
    }

    @RequestMapping( value="/committees/{name}/years/{year}", method=RequestMethod.GET )
    public String getCommitteeYears(@PathVariable String name, @Pattern( regexp = "\\b\\d{4}\\b", message = "the year format is wrong") @PathVariable String year) {
        return committeeService.getCommitteeIdByNameAndYear(name,year);
    }

}


