package com.example.capstone.service;
import com.example.capstone.entities.*;
import com.example.capstone.projections.CommitteeSummary;
import com.example.capstone.projections.CommitteesWithMembersAndVolunteers;
import com.example.capstone.projections.CommitteesYearsOnly;
import com.example.capstone.projections.UserSummary;
import com.example.capstone.repositories.CommitteeRepository;
import com.example.capstone.repositories.CriteriaRepository;
import com.example.capstone.repositories.DutyRepository;
import com.example.capstone.repositories.UserRepository;
import com.example.capstone.utils.CriteriaPredicateFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.function.Predicate;
import java.util.stream.Collectors;


@Service
public class CommitteeService {
    @Autowired
    private CommitteeRepository committeeRepo;

    @Autowired
    private CriteriaRepository criteriaRepo;

    @Autowired
    private DutyRepository dutyRepo;

    @Autowired
    private UserRepository userRepo;
    
    
    public List<Criteria> failingCriteria(Committee c) {
    	return c.getCriteria()
    			.stream()
    			.filter( crit -> !CriteriaPredicateFactory.build( crit ).test( c ) )
    			.collect( Collectors.toList() );    	
    }

	public Map<String, List<CommitteesWithMembersAndVolunteers>> getCommittees(String start, String end){
        List<CommitteesWithMembersAndVolunteers> committeesWithMembersList =  committeeRepo.findByYearBetween(start, end);
        Map<String, List<CommitteesWithMembersAndVolunteers>> committeeMap = new HashMap<String,List<CommitteesWithMembersAndVolunteers>>();
        committeesWithMembersList.stream().forEach(
                c->{
                    if (committeeMap.keySet().contains(c.getName()))
                    {
                        committeeMap.get(c.getName()).add(c);
                    } else {
                        List<CommitteesWithMembersAndVolunteers> list = new ArrayList();
                        list.add(c);
                        committeeMap.put(c.getName(),list);
                    }
                });
        return committeeMap;
    }

    public List<CommitteeSummary> getYearsCommittees(String startYear, String endYear){
        return committeeRepo.findByYearBetweenAndIdNotNull(startYear, endYear);
    }

    public List<String> getCommitteesYears(){
         List<String> years = new ArrayList<>();
        committeeRepo.findDistinctByYearNotNullOrderByYearAsc().forEach(
                committeesYearsOnly -> {
                    years.add(committeesYearsOnly.getYear());
                }
        );
        return years;
    }

    public String createYear(String year){
        List<CommitteesYearsOnly> years  = committeeRepo.findDistinctByYearNotNullOrderByYearAsc();
        String lastYear = years.get(years.size() - 1).getYear();
        List<Committee> committees = committeeRepo.findByYear(lastYear);
        List<Duty> copyDuties = new ArrayList<Duty>();
        List<Criteria> copyCriterias = new ArrayList<Criteria>();
        committees.forEach(
                committee -> {
                    Committee copy = new Committee.Builder().
                            introduction(committee.getIntroduction()).
                            name(committee.getName()).
                            year(year).build();
                    Committee finalCopy = committeeRepo.save(copy);
                    committee.getDuties().forEach(
                            duty -> {
                                Duty copyDuty = new Duty();
                                copyDuty.setCommittee(finalCopy);
                                copyDuty.setDuty(duty.getDuty());
                                copyDuties.add(copyDuty);
                            }
                    );
                    finalCopy.setDuties(dutyRepo.saveAll(copyDuties));
                    committee.getCriteria().forEach(
                            criteria -> {
                                Criteria copyCriteria = new Criteria();
                                copyCriteria.setCommittee(finalCopy);
                                copyCriteria.setCriteria(criteria.getCriteria());
                                copyCriterias.add(copyCriteria);
                            }
                    );
                    finalCopy.setCriteria(criteriaRepo.saveAll(copyCriterias));
                    committeeRepo.save(finalCopy);
                }
        );
        return year;
    }

    public List<String> getCommitteeYears(Long id){
        List<String> years = new ArrayList<String>();
        String name =  committeeRepo.findById(id).get().getName();
        committeeRepo.findDistinctByNameEquals(name).forEach(
                committeesYearsOnly -> {
                    years.add(committeesYearsOnly.getYear());
                }
        );
        return years;
    }

    public CommitteesWithMembersAndVolunteers getCommittee(Long id){
        return committeeRepo.findByIdEqualsAndIdNotNull(id);
    }

    public List<UserSummary> getCommitteeMembers(Long id){
        Committee c = new Committee();
        c.setId(Long.valueOf(id));
        return userRepo.findByCommitteesEquals(c);
    }

    public List<Survey> getCommitteeVolunteers(Long id){
        Committee c= new Committee();
        c.setId(id);
        List<Survey> res = new ArrayList<Survey>();
        List<UserSummary> list = userRepo.findByVolunteeredCommitteesEquals(c);
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

    public List<UserSummary> getCommitteeVolunteersDetail(Long id){
        Committee c = new Committee();
        c.setId(Long.valueOf(id));
        return userRepo.findByVolunteeredCommitteesEquals(c);
    }

    public User assignCommitteeMember(Long id,Long userId){
        final User[] res = new User[1];
        userRepo.findById(Long.valueOf(userId)).map(
                user -> {
                    res[0] = user;
                    Committee c = new Committee();
                    c.setId(Long.valueOf(id));
                    user.getCommittees().add(c);
                    return userRepo.save(user);
                }
        );
        return res[0];
    }

    public User removeMember(Long id , Long memberId){
        final User[] res = new User[1];
        committeeRepo.findById(Long.valueOf(id)).map(
                committee -> {
                    return userRepo.findById(Long.valueOf(memberId)).map(
                            user -> {
                                res[0] = user;
                                user.removeCommittee(committee);
                                userRepo.save(user);
                                return user;
                            }
                    );
                }
        );
        return res[0];
    }

    public String getCommitteeIdByYearAndName(String name, String year) {
        return committeeRepo.findByNameEqualsAndYearEquals(name, year).getId().toString();
    }

    public void deleteCommitteeById(Long id) {
        this.committeeRepo.deleteById(id);
    }

    public void ceateCommittee(Committee committee) {
        Committee c = new Committee();
        c.setYear(committee.getYear());
        c.setIntroduction(committee.getIntroduction());
        c.setName(committee.getName());
        Committee resC = committeeRepo.save(c);
        c.setCriteria(new ArrayList<Criteria>());
        c.setDuties(new ArrayList<Duty>());
        committee.getCriteria()
                .forEach(
                        criteria -> {
                            criteria.setCommittee(resC);
                            c.getCriteria().add(criteria);
                            criteriaRepo.save(criteria);
                        }
                        );
        committee.getDuties().
                forEach(
                        duty -> {
                            duty.setCommittee(resC);
                            c.getDuties().add(duty);
                            dutyRepo.save(duty);
                        }
                        );
        committeeRepo.save(c);
    }
}
