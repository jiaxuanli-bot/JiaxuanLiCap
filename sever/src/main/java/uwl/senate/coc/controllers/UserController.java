package uwl.senate.coc.controllers;


import java.util.List;

import javax.validation.constraints.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import uwl.senate.coc.entities.College;
import uwl.senate.coc.entities.Gender;
import uwl.senate.coc.entities.SurveyResponse;
import uwl.senate.coc.entities.User;
import uwl.senate.coc.projections.CommitteeSummary;
import uwl.senate.coc.projections.SurveySummary;
import uwl.senate.coc.services.SurveyService;
import uwl.senate.coc.services.UserService;


@RestController
@RequestMapping( "/users" )
@Validated
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private SurveyService surveyService;
    
    @RequestMapping( method=RequestMethod.GET )
    public Page<User> getUsers(
            @RequestParam(defaultValue="0") Integer pageNo,
            @RequestParam(defaultValue="10") Integer pageSize,
            @RequestParam(defaultValue="last") String sortBy,
            @RequestParam(name="pageLength", required=false) String pageLength,
            @Pattern( regexp = "\\b\\d{4}\\b", message = "the year format is wrong") @RequestParam(name="year", required=true) String year,
            @Pattern( regexp = "^[0-9]*$", message = "the UserID format is wrong") @RequestParam(name="id", required=false) String id,
            @RequestParam(required=false) String first, 
            @RequestParam(required=false) String last,
            @Pattern( regexp = "Full|Associate|Assistant", message = "the rank format is wrong") @RequestParam(name="rank", required=false) String rank,
            @Pattern( regexp = "CASH|CSH|CBA", message = "the college format is wrong") @RequestParam(name="college", required=false) String college,
            @RequestParam(required=false) Boolean tenured,
            @RequestParam(required=false) Boolean soe,
            @RequestParam(required=false) Boolean admin,
            @Pattern( regexp = "F|M", message = "the gender format is wrong") @RequestParam(name="gender", required=false) String gender) {
        rank = rank != null ? rank + " Professor" : null;
        User user = new User.Builder()
        		.year(year)
                .first(first)
                .last(last)
                .college(new College.Builder().name(college).build())
                .gender(new Gender.Builder().name(gender).build())
                .adminResponsibility( admin )
                .rank( rank )
                .tenured( tenured )
                .soe( soe )
                .build();

        ExampleMatcher matcher = ExampleMatcher.matching()
                .withMatcher("first", m -> m.contains())
                .withMatcher("last", m -> m.contains());
        Example<User> example = Example.of(user, matcher);
        Pageable paging = PageRequest.of( pageNo, pageSize, Sort.by(sortBy));
        return userService.getUsers(example, paging );
    }
    
    @RequestMapping( value="/{uid}", method=RequestMethod.GET)
    public User getUser( @PathVariable Long uid ) {
    	return userService.getUser( uid );
    }
    
    @RequestMapping( value="/{uid}/survey", method=RequestMethod.GET)
    public SurveySummary getSurvey( @PathVariable Long uid ) {
    	return surveyService.getByUserId( uid );
    }
    
    @RequestMapping( value="/{uid}/survey/responses", method=RequestMethod.GET)
    public List<SurveyResponse> getSurveyResponses( @PathVariable Long uid ) {
    	return surveyService.getResponsesBySurveyId(uid);    	
    }

    @RequestMapping( value="/{uid}", method=RequestMethod.PUT )
    public User modifyUser( @PathVariable Long uid, @RequestBody(required=true) User user) {    	
    	if( uid != user.getId() ) throw new IllegalArgumentException("Path id and user.id are not the same");
    	
        User u = userService.getUser( uid );
        user.setId( u.getId() );
        user.setEmail( u.getEmail() );
        user.setYear( u.getYear() );
        return userService.modifyUser(user);
    }

    @RequestMapping( value="/{uid}", method=RequestMethod.DELETE )
    public void deleteUser( @PathVariable Long uid ) {
    	// DON'T need YEAR since a user's primary key is their email
        userService.deleteUser( uid );
    }

    @RequestMapping( value="", method=RequestMethod.POST )
    public User createUser( @RequestBody(required=true) User user ) {
        return userService.createUser(user);
    }
    

    @RequestMapping( value="/{uid}/committees", method=RequestMethod.GET )
    public List<CommitteeSummary> getUserCommittees( @PathVariable Long uid ) {
        return  userService.getUserCommittees( userService.getUser( uid ) );
    }

//    @RequestMapping( value="/{uid}/survey", method=RequestMethod.GET )
//    public Survey getUserSurvey( @PathVariable Long uid ) {
//    	return userService.getSurvey( uid );
//    }

    @RequestMapping( value="/users/{id}/enlistings/committees", method=RequestMethod.GET )
    public List<CommitteeSummary> getUserSurveysCommittees(@Pattern( regexp = "^[0-9]*$", message = "the UserID format is wrong") @PathVariable String id) {
        //Get all the survey that user have been volunteered
        User v =new User();
        v.setId(Long.valueOf(id));
        return userService.getUserSurveysCommittees(v);
    }

    @RequestMapping( value="/users/{id}/enlistings/committees/{committeeId}/comment", method=RequestMethod.POST )
    public void createComment(@RequestBody(required=true) String commentContext,
                              @Pattern( regexp = "^[0-9]*$", message = "the UserID format is wrong") @PathVariable String id,
                              @Pattern( regexp = "^[0-9]*$", message = "the CommitteeID format is wrong") @PathVariable String committeeId) {
        //Create a comment for a survey
    }

//    @RequestMapping( value="/users/{id}/enlistings/{committeeid}", method=RequestMethod.POST )
//    public void createSurvey(@Pattern( regexp = "^[0-9]*$", message = "the UserID format is wrong") @PathVariable String id,@Pattern( regexp = "^[0-9]*$", message = "the CommitteeID format is wrong") @PathVariable String committeeid, @RequestParam(name="year", required=false) String year) {
//       //Create a new survey that user volunteer one committee
//        User v  = userService.getUserById(Long.valueOf(id));
//        v = userService.getUserByEmailAndYear(v.getEmail(), year);
//        userService.createSurvey(Long.valueOf(committeeid),v);
//    }
//
//    @RequestMapping( value="/users/{id}/enlistings/{committeeid}", method=RequestMethod.DELETE )
//    public void deleteSurvey(@Pattern( regexp = "^[0-9]*$", message = "the UserID format is wrong") @PathVariable String id,@Pattern( regexp = "^[0-9]*$", message = "the CommitteeID format is wrong") @PathVariable String committeeid) {
//        //Delete survey for that user
//        userService.deleteSurvey(Long.valueOf(id),Long.valueOf(committeeid));
//    }

    // This meethod is poorly constructed
    @RequestMapping( value="/users/email/{email}/years", method=RequestMethod.GET )
    public List<String> getUserYears(@PathVariable String email) {
        //get all years of users which have same email
        return userService.getUserYears(email);
    }
}