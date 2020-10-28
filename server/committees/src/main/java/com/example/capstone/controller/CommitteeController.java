package com.example.capstone.controller;

import com.example.capstone.entities.Survey;
import com.example.capstone.projections.*;
import com.example.capstone.repositories.CommitteeRepository;
import com.example.capstone.repositories.UserRepository;
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

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private CommitteeRepository committeeRepo;

//   @RequestMapping( value="/committees", method=RequestMethod.GET )
//   public ArrayList<Committee> getOneYearCommittees(@RequestParam(name="year", required=false) String year) {
//       System.out.println();System.out.println(year);
//       System.out.println("1");
//       return committeeService.getCommiteesByYear(year);
//    }

//    @RequestMapping( value="/committees", method=RequestMethod.GET )
//    public ArrayList<Committee> getYearsCommittees(@Pattern( regexp = "\\b\\d{4}\\b", message = "the start year format is wrong") @RequestParam(name="startYear", required=false) String startYear,@Pattern(regexp = "\\b\\d{4}\\b", message = "the end year format is wrong") @RequestParam(name="endYear",required = false)String endYear) {
//        if (startYear != null && endYear != null)
//        {
//                return committeeService.getCommitteeByStartYearAndEndYear(startYear, endYear);
//        }
//        return committeeService.getCommitteeByStartYearAndEndYear("2000", "2050");
//    }

    @RequestMapping( value="/committees", method=RequestMethod.GET )
    public List<CommitteeSummary> getYearsCommittees(
            @Pattern( regexp = "\\b\\d{4}\\b", message = "the start year format is wrong") @RequestParam(defaultValue = "2000") String startYear,
            @Pattern(regexp = "\\b\\d{4}\\b", message = "the end year format is wrong") @RequestParam(defaultValue = "2050")String endYear) {
        return committeeService.getYearsCommittees(startYear, endYear);
    }

    @RequestMapping( value="/hashedCommittees", method=RequestMethod.GET )
    public Map<String,List<CommitteesWithMembersAndVolunteers>> getYearsCommitteesWithGroup(@Pattern( regexp = "\\b\\d{4}\\b", message = "the start year format is wrong") @RequestParam(name="startYear", required=true) String startYear, @Pattern(regexp = "\\b\\d{4}\\b", message = "the end year format is wrong") @RequestParam(name="endYear",required = true)String endYear) {
        return committeeService.getCommittees(startYear, endYear);
    }

//    @RequestMapping( value="/committees/years", method=RequestMethod.GET )
//    public ArrayList<String> getCommitteesYears() {
//        return committeeService.getCommitteesYears();
//    }
//
    //res shoud ArrayList<String>
    @RequestMapping( value="/committees/years", method=RequestMethod.GET )
    public List<String> getCommitteesYears() {
        return committeeService.getCommitteesYears();
    }

    //res should ArrayList<String>
    @RequestMapping( value="/committees/{id}/years", method=RequestMethod.GET )
    public List<String> getCommitteeYears(@Pattern( regexp = "^[0-9]*$", message = "the CommitteeID format is wrong") @PathVariable String id ) {
        return committeeService.getCommitteeYears(Long.valueOf(id));
    }

//    @RequestMapping( value="/committees/{id}", method=RequestMethod.GET )
//    public Committee getCommittee(@Pattern( regexp = "^[0-9]*$", message = "the CommitteeID format is wrong") @PathVariable String id ) {
//        ArrayList<Committee> committeeArrayList;
//        committeeArrayList = committeeService.getCommitteeById(id);
//        if (committeeArrayList.size() > 0) {
//            return committeeArrayList.get(0);
//        }
//        return null;
//    }

    @RequestMapping( value="/committees/{id}", method=RequestMethod.GET )
    public CommitteesWithMembersAndVolunteers getCommittee(@Pattern(regexp = "^[0-9]*$", message = "the CommitteeID format is wrong") @PathVariable String id ) {
        return committeeService.getCommittee(Long.valueOf(id));
    }

    //res should be ArrayList<User>
    @RequestMapping( value="/committees/{id}/members", method=RequestMethod.GET )
    public List<UserSummary> getCommitteeMembers(@Pattern( regexp = "^[0-9]*$", message = "the CommitteeID format is wrong") @PathVariable String id){
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
    public void assignCommitteeMember(@Pattern( regexp = "^[0-9]*$", message = "the CommitteeID format is wrong") @PathVariable String id, @Pattern( regexp = "^[0-9]*$", message = "the MemberID format is wrong") @PathVariable String userId){
        committeeService.assignCommitteeMember(Long.valueOf(id), Long.valueOf(userId));
    }

    @RequestMapping( value="/committees/{id}/members/{memberId}", method=RequestMethod.DELETE )
    public void removeMember(@Pattern( regexp = "^[0-9]*$", message = "the CommitteeID format is wrong")  @PathVariable String id,@Pattern( regexp = "^[0-9]*$", message = "the MemberID format is wrong") @PathVariable String memberId) {
        committeeService.removeMember(Long.valueOf(id),Long.valueOf(memberId));
    }

//Maybe useless
//    @RequestMapping( value="/committees/{name}/years/{year}", method=RequestMethod.GET )
//    public String getCommitteeYears(@PathVariable String name, @Pattern( regexp = "\\b\\d{4}\\b", message = "the year format is wrong") @PathVariable String year) {
//        return committeeService.getCommitteeIdByNameAndYear(name,year);
//    }

}

