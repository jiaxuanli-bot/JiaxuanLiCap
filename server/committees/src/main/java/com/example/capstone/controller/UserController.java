package com.example.capstone.controller;

import com.example.capstone.entities.*;
import com.example.capstone.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import javax.validation.constraints.Pattern;
import java.util.ArrayList;

@RestController
@RequestMapping( "/api/v1" )
@Validated
public class UserController {

    @Autowired
    private UserService userService;
    @RequestMapping( value="/users", method= RequestMethod.GET )
    public ArrayList<User> getUsers(@RequestParam(name="pageIndex", required=false) String pageIndex,@RequestParam(name="pageLength", required=false) String pageLength, @Pattern( regexp = "\\b\\d{4}\\b", message = "the year format is wrong") @RequestParam(name="year", required=false) String year, @Pattern( regexp = "^[0-9]*$", message = "the UserID format is wrong") @RequestParam(name="id", required=false) String id, @RequestParam(name="first", required=false) String first, @RequestParam(name="last", required=false) String last, @Pattern( regexp = "Full Professor|Associate Professor|Assistant Professor", message = "the rank format is wrong") @RequestParam(name="rank", required=false) String rank,@Pattern( regexp = "CASH|CSH|CBA", message = "the college format is wrong") @RequestParam(name="college", required=false) String college, @Pattern( regexp = "1|0", message = "the tenured format is wrong") @RequestParam(name="tenured", required=false) String tenured,@Pattern( regexp = "1|0", message = "the soe format is wrong") @RequestParam(name="soe", required=false) String soe
           ,@Pattern( regexp = "1|0", message = "the admin format is wrong") @RequestParam(name="admin_responsibility", required=false) String admin_responsibility,@Pattern( regexp = "F|M", message = "the gender format is wrong") @RequestParam(name="gender", required=false) String gender) {
        //Search users who meet the conditions
        System.out.println(pageIndex);
        if (pageIndex!=null) {
            return userService.getCommitteesByYearAndPage(Integer.parseInt(pageIndex),year,Integer.parseInt(pageLength));
        }else {
            return userService.searchUser(year, id, first, last, rank, gender, college, tenured, soe);
        }

    }

    @RequestMapping( value="/users/{id}", method=RequestMethod.PUT )
    public User modifyUser(@Pattern( regexp = "^[0-9]*$", message = "the UserID format is wrong") @PathVariable String id, @RequestBody(required=true) userT user) {
        return userService.modifyUser(id,user.getFirst(),user.getLast(),user.getRank(),user.getCollege(),user.getTenured().toString(),user.getSoe().toString(),user.getAdminResponsibility().toString(),user.getGender());
    }

    @RequestMapping( value="/users/{id}", method=RequestMethod.DELETE )
    public void deleteUser(@Pattern( regexp = "^[0-9]*$", message = "the UserID format is wrong") @PathVariable String id,@Pattern( regexp = "\\b\\d{4}\\b", message = "the year format is wrong") @RequestParam(name="year", required=false) String year) {
        System.out.println("delete");
        userService.deleteUser(id, year);
    }

    @RequestMapping( value="/users", method=RequestMethod.POST )
    public userT createUser(@RequestBody(required=true) userT user) {
        //create a new user
        System.out.println(user.getFirst());
        System.out.println(user.getLast());
        System.out.println(user.getAdminResponsibility());
        System.out.println(user.getCollege());
        return userService.createUser(user);
    }

    @RequestMapping( value="/users/{id}/committees", method=RequestMethod.GET )
    public ArrayList<userCommittee> getUserCommittees(@Pattern( regexp = "^[0-9]*$", message = "the UserID format is wrong") @PathVariable String id, @Pattern( regexp = "\\b\\d{4}\\b", message = "the year format is wrong") @RequestParam(name="year", required=false) String year) {
        //Get all the committees that user have been assigned
        return userService.getUserCommitteesByIdAndYear(id,year);
    }

    @RequestMapping( value="/users/{id}/enlistings", method=RequestMethod.GET )
    public ArrayList<Survey> getUserSurveys(@Pattern( regexp = "^[0-9]*$", message = "the UserID format is wrong") @PathVariable String id) {
        //Get all the survey that user have been volunteered
        return userService.getUserSurveys(id);
    }

    @RequestMapping( value="/users/{id}/enlistings/committees", method=RequestMethod.GET )
    public ArrayList<Committee> getUserSurveysCommittees(@Pattern( regexp = "^[0-9]*$", message = "the UserID format is wrong") @PathVariable String id) {
        //Get all the survey that user have been volunteered
        return userService.getUserSurveysCommittees(id);
    }


    @RequestMapping( value="/users/{id}/enlistings/{committeeid}", method=RequestMethod.POST )
    public Survey createSurvey(@Pattern( regexp = "^[0-9]*$", message = "the UserID format is wrong") @PathVariable String id,@Pattern( regexp = "^[0-9]*$", message = "the CommitteeID format is wrong") @PathVariable String committeeid) {
       //Create a new survey that user volunteer one committee
        if (userService.getSurvey(id,committeeid)!=null){
            return userService.deleteSurvey(id, committeeid);
        }
        else {
            return userService.createSurvey(id,committeeid);
        }
    }

    @RequestMapping( value="/users/{id}/enlistings/{committeeid}", method=RequestMethod.DELETE )
    public void deleteSurvey(@Pattern( regexp = "^[0-9]*$", message = "the UserID format is wrong") @PathVariable String id,@Pattern( regexp = "^[0-9]*$", message = "the CommitteeID format is wrong") @PathVariable String committeeid) {
        //Delete survey for that user
        userService.deleteSurvey(id, committeeid);
    }

    @RequestMapping( value="/users/{email}/years", method=RequestMethod.GET )
    public ArrayList<String> getUserYears(@PathVariable String email) {
        //get all years of users which have same email
        return userService.getUserYears(email);
    }

}






