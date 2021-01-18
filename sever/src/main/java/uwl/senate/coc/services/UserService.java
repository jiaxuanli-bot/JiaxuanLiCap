package uwl.senate.coc.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import uwl.senate.coc.entities.Survey;
import uwl.senate.coc.entities.User;
import uwl.senate.coc.projections.CommitteeSummary;
import uwl.senate.coc.projections.SurveySummary;
import uwl.senate.coc.repositories.CommitteeRepository;
import uwl.senate.coc.repositories.RoleRepository;
import uwl.senate.coc.repositories.UserRepository;

@Service
public class UserService {

    @Autowired
    private CommitteeRepository committeeRepo;

    @Autowired
    private RoleRepository roleRepo;

    @Autowired
    private UserRepository userRepo;
    
    @Autowired
    private SurveyService surveyService;
    
    public Page<User> getUsers(Example<User> example, Pageable paging){
        return userRepo.findAll(example, paging );
    }
    
    public User getUser( Long id ) {
    	return userRepo.findById( id ).get();
    }

    public User modifyUser(User user){
        return userRepo.save(user);
    }

    public void deleteUser(Long id){
        userRepo.deleteById(Long.valueOf(id));
    }

    public User createUser(User user){
        roleRepo.saveAll(user.getRoles());
        return userRepo.save(user);
    }

    public List<CommitteeSummary> getUserCommittees(User user) {
        return committeeRepo.findByMembers(user);
    }

    public List<CommitteeSummary> getUserSurveysCommittees(User v){
        return committeeRepo.findByVolunteers(v);
    }
    
    public SurveySummary getSurvey( Long userId ) {
    	return this.surveyService.getByUserId(userId);
    }

    public Survey createSurvey( User user ) {
    	return this.surveyService.create(user);
    }

    public List<String> getUserYears(String email){
        ArrayList<String> list =new ArrayList<String>();
        userRepo.findDistinctByEmailOrderByYearAsc(email).forEach(
                userYearsOnly -> {
                    list.add(userYearsOnly.getYear());
                }
        );
        return list;
    }

    public User getUserById(Long Id){
       return userRepo.findById(Id).get();
    }

    public User getUserByEmailAndYear(String email, String year){
        return userRepo.findByEmailEqualsAndYearEquals(email, year);
    }
}
