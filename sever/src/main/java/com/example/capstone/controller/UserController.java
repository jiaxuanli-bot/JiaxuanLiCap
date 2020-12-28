package com.example.capstone.controller;

import com.example.capstone.entities.Survey;
import com.example.capstone.entities.User;
import com.example.capstone.projections.CommitteeSummary;
import com.example.capstone.repositories.UserRepository;
import com.example.capstone.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import javax.validation.constraints.Pattern;
import java.util.List;
import org.springframework.data.domain.*;


@RestController
@RequestMapping( "/api/v1" )
@Validated
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepo;

    @RequestMapping(value="/users",	method=RequestMethod.GET )
    public Page<User> getUsers(
            @RequestParam(defaultValue="0") Integer pageNo,
            @RequestParam(defaultValue="10") Integer pageSize,
            @RequestParam(defaultValue="last") String sortBy,
            @RequestParam(name="pageLength", required=false) String pageLength,
            @Pattern( regexp = "\\b\\d{4}\\b", message = "the year format is wrong") @RequestParam(name="year", required=true) String year,
            @Pattern( regexp = "^[0-9]*$", message = "the UserID format is wrong") @RequestParam(name="id", required=false) String id,
            @RequestParam(name="first", required=false) String first, @RequestParam(name="last", required=false) String last,
            @Pattern( regexp = "Full|Associate|Assistant", message = "the rank format is wrong") @RequestParam(name="rank", required=false) String rank,
            @Pattern( regexp = "CASH|CSH|CBA", message = "the college format is wrong") @RequestParam(name="college", required=false) String college,
            @Pattern( regexp = "Yes|No", message = "the tenured format is wrong") @RequestParam(name="tenured", required=false) String tenured,
            @Pattern( regexp = "Yes|No", message = "the soe format is wrong") @RequestParam(name="soe", required=false) String soe,
            @Pattern( regexp = "Yes|No", message = "the admin format is wrong") @RequestParam(name="adminResponsibility", required=false) String admin_responsibility,
            @Pattern( regexp = "F|M", message = "the gender format is wrong") @RequestParam(name="gender", required=false) String gender
    ) {
        User.Builder b =new User.Builder();
        b.year(year)
                .first(first)
                .last(last)
                .college(college)
                .gender(gender);
        if (admin_responsibility!=null) {
            b.adminResponsibility((admin_responsibility.equals("No"))?false:true);
        }
        if (rank!=null) {
            if (rank.equals("Full")) {
                b.rank("Full Professor");
            }else if (rank.equals("Associate")) {
                b.rank("Associate Professor");
            }else {
                b.rank("Assistant Professor");
            }
        }
        if (tenured!=null){
           b.tenured((tenured.equals("No"))?false:true);
        }
        if (soe!=null){
            b.soe((soe.equals("No"))?false:true);
        }
        User u =b.build();
        ExampleMatcher matcher = ExampleMatcher.matching()
                .withMatcher("first", m -> m.contains())
                .withMatcher("last", m -> m.contains());
        Example<User> example = Example.of(u, matcher);
        Pageable paging = PageRequest.of( pageNo, pageSize, Sort.by(sortBy));
        return userService.getUsers(example, paging );
    }

    @RequestMapping( value="/users/{id}", method=RequestMethod.PUT)
    public User modifyUser(@Pattern( regexp = "^[0-9]*$", message = "the UserID format is wrong") @PathVariable String id, @RequestBody(required=true) User user) {
        User u = userRepo.findByIdEquals(Long.valueOf(id));
        user.setId(u.getId());
        user.setEmail(u.getEmail());
        user.setYear(u.getYear());
        return userService.modifyUser(user);
    }

    @RequestMapping( value="/users/{id}", method=RequestMethod.DELETE )
    public void deleteUser(@Pattern( regexp = "^[0-9]*$", message = "the UserID format is wrong") @PathVariable String id,@Pattern( regexp = "\\b\\d{4}\\b", message = "the year format is wrong") @RequestParam(name="year", required=false) String year) {
        //delete a user
        userService.deleteUser(Long.valueOf(id));
    }

    @RequestMapping( value="/users", method=RequestMethod.POST)
    public User createUser(@RequestBody(required=true) User user) {
        //create a new user
        return userService.createUser(user);
    }

    @RequestMapping( value="/users/csv", method=RequestMethod.POST)
    public void uploadUserFromCSV(@RequestBody(required=true) User[] users) {
        //create a new user
        System.out.print("get");
        System.out.print(users);
    }

    @RequestMapping( value="/users/{id}/committees", method=RequestMethod.GET )
    public List<CommitteeSummary> getUserCommittees(@Pattern( regexp = "^[0-9]*$", message = "the UserID format is wrong") @PathVariable String id) {
        //Get all the committees that user have been assigned
        User u =new User();
        u.setId(Long.valueOf(id));
        return  userService.getUserCommittees(u);
    }

    @RequestMapping( value="/users/{id}/enlistings", method=RequestMethod.GET )
    public List<Survey> getUserSurveys(@Pattern( regexp = "^[0-9]*$", message = "the UserID format is wrong") @PathVariable String id, @RequestParam(name="year", required=false) String year) {
        //Get all the survey that user have been volunteered
        User v  = userService.getUserById(Long.valueOf(id));
        v = userService.getUserByEmailAndYear(v.getEmail(), year);
        return userService.getUserSurveys(Long.valueOf(id),v);
    }

    @RequestMapping( value="/users/{id}/enlistings/committees", method=RequestMethod.GET )
    public List<CommitteeSummary> getUserSurveysCommittees(@Pattern( regexp = "^[0-9]*$", message = "the UserID format is wrong") @PathVariable String id) {
        //Get all the survey that user have been volunteered
        User v =new User();
        v.setId(Long.valueOf(id));
        return userService.getUserSurveysCommittees(v);
    }

    @RequestMapping( value="/users/{id}/enlistings/{committeeid}", method=RequestMethod.POST )
    public void createSurvey(@Pattern( regexp = "^[0-9]*$", message = "the UserID format is wrong") @PathVariable String id,@Pattern( regexp = "^[0-9]*$", message = "the CommitteeID format is wrong") @PathVariable String committeeid, @RequestParam(name="year", required=false) String year) {
       //Create a new survey that user volunteer one committee
        User v  = userService.getUserById(Long.valueOf(id));
        v = userService.getUserByEmailAndYear(v.getEmail(), year);
        userService.createSurvey(Long.valueOf(committeeid),v);
    }

    @RequestMapping( value="/users/{id}/enlistings/{committeeid}", method=RequestMethod.DELETE )
    public void deleteSurvey(@Pattern( regexp = "^[0-9]*$", message = "the UserID format is wrong") @PathVariable String id,@Pattern( regexp = "^[0-9]*$", message = "the CommitteeID format is wrong") @PathVariable String committeeid) {
        //Delete survey for that user
        userService.deleteSurvey(Long.valueOf(id),Long.valueOf(committeeid));
    }

    @RequestMapping( value="/users/email/{email}/years", method=RequestMethod.GET )
    public List<String> getUserYears(@PathVariable String email) {
        //get all years of users which have same email
        return userService.getUserYears(email);
    }

}






