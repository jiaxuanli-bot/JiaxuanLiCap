package com.example.capstone.service;

import com.example.capstone.entities.Committee;
import com.example.capstone.entities.Survey;
import com.example.capstone.entities.User;
import com.example.capstone.projections.CommitteeSummary;
import com.example.capstone.repositories.CommitteeRepository;
import com.example.capstone.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private CommitteeRepository committeeRepo;

    @Autowired
    private UserRepository userRepo;

    public Page<User> getUsers(Example<User> example, Pageable paging){
        return userRepo.findAll(example, paging );
    }

    public User modifyUser(User user){
        return userRepo.save(user);
    }

    public void deleteUser(Long id){
        userRepo.deleteById(Long.valueOf(id));
    }

    public User createUser(User user){
        return userRepo.save(user);
    }

    public List<CommitteeSummary> getUserCommittees(User user){
        return committeeRepo.findByMembers(user);
    }

    public List<Survey> getUserSurveys(Long id, User u){
        List<Survey> res = new ArrayList<Survey>();
        List<CommitteeSummary> list =committeeRepo.findByVolunteers(u);
        list.forEach(
                committeeSummary -> {
                    Survey s =new Survey();
                    s.setUserId(Long.valueOf(id));
                    s.setCommitteeId(committeeSummary.getId());
                    res.add(s);
                }
        );
        return res;
    }

    public List<CommitteeSummary> getUserSurveysCommittees(User v){
        return committeeRepo.findByVolunteers(v);
    }

    public void createSurvey(Long committeeid, User v){
        Committee c = committeeRepo.getOne(committeeid);
        c.getVolunteers().forEach(
                user -> {
                    System.out.println(user.getId());
                }
        );
        if (!c.getVolunteers().contains(v)) {
            c.getVolunteers().add(v);
        } else {
            c.getVolunteers().remove(v);
        }
        committeeRepo.save(c);
    }

    public void deleteSurvey(Long id, Long committeeid){
        User v = userRepo.findByIdEquals(id);
        Committee c = committeeRepo.getOne(committeeid);
        c.getVolunteers().remove(v);
        committeeRepo.save(c);
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
