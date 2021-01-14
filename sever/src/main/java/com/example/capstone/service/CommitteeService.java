package com.example.capstone.service;
import com.example.capstone.entities.*;
import com.example.capstone.projections.CommitteeSummary;
import com.example.capstone.projections.CommitteeWithUserSummaries;
import com.example.capstone.projections.CommitteeYear;
import com.example.capstone.projections.UserSummary;
import com.example.capstone.repositories.CommitteeRepository;
import com.example.capstone.repositories.CriteriaRepository;
import com.example.capstone.repositories.DutyRepository;
import com.example.capstone.repositories.UserRepository;
import com.example.capstone.utils.CriteriaPredicateFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
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

	public Map<String, List<CommitteeWithUserSummaries>> getCommittees(String start, String end){
        List<CommitteeWithUserSummaries> committeesWithMembersList =  committeeRepo.findByYearBetween(start, end);
        Map<String, List<CommitteeWithUserSummaries>> committeeMap = new HashMap<String,List<CommitteeWithUserSummaries>>();
        committeesWithMembersList.stream().forEach(
                c->{
                    if (committeeMap.keySet().contains(c.getName()))
                    {
                        committeeMap.get(c.getName()).add(c);
                    } else {
                        List<CommitteeWithUserSummaries> list = new ArrayList<>();
                        list.add(c);
                        committeeMap.put(c.getName(),list);
                    }
                });
        return committeeMap;
    }

    public Committee getCommitteeDetail(Long id){
        return this.committeeRepo.findById(id).get();
    }

    public List<CommitteeSummary> getYearsCommittees(String startYear, String endYear){
        return committeeRepo.findByYearBetweenAndIdNotNull(startYear, endYear);
    }

    public List<String> getCommitteesYears(){
        return committeeRepo.findDistinctByYearNotNullOrderByYearAsc()
        		.stream()
        		.map( committee -> committee.getYear() )
        		.collect( Collectors.toList() );
    }

    public String createYear(String year){
        List<CommitteeYear> years  = committeeRepo.findDistinctByYearNotNullOrderByYearAsc();        
        String lastYear = years.get(years.size() - 1).getYear();
        List<Committee> committees = committeeRepo.findByYear(lastYear);
        
        committees.forEach(
                committee -> {
                	// SAVE THE NEW COMMITTEE
                    Committee copy = new Committee.Builder()
                            .introduction( committee.getIntroduction() )
                            .name( committee.getName())
                            .year(year)
                            .build();                    
                    Committee finalCopy = committeeRepo.save(copy);
                    
                    // ASSIGN DUTIES
                    List<Duty> newDuties = committee.getDuties()
                    	.stream()
                    	.map( duty -> new Duty.Builder()
                                		.committee( finalCopy )
                                		.duty( duty.getDuty() )
                                		.build() )
                    	.collect( Collectors.toList() );                    
                    finalCopy.setDuties(dutyRepo.saveAll(newDuties));
                    
                    // ASSIGN CRITERIA
                    List<Criteria> newCriteria = committee.getCriteria()
                    		.stream()
                    		.map( crit -> new Criteria.Builder()
                    				.committee( finalCopy )
                    				.criteria( crit.getCriteria() )
                    				.build() )
                    		.collect( Collectors.toList() );
                    		
                    finalCopy.setCriteria( criteriaRepo.saveAll( newCriteria ) );
                    committeeRepo.save( finalCopy );
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

    public CommitteeWithUserSummaries getCommittee(Long id){
        return committeeRepo.findByIdEqualsAndIdNotNull(id);
    }

    public List<UserSummary> getCommitteeMembers(Long id) {    	
    	Committee c = committeeRepo.findById(id).orElse( null );
    	
    	System.out.println("committeeSevice.getCommitteeMembers::" + c );
    	if( c == null ) throw new IllegalArgumentException("invalid committee id");
    	    	
        List<UserSummary> result = userRepo.findByCommitteesEquals(c);
        System.out.println( "RESULT=>" + result );
        
        return result;
    }

    public List<Survey> getCommitteeVolunteers(Long id){
        Committee c= new Committee();
        c.setId(id);
        List<Survey> res = new ArrayList<Survey>();
        List<UserSummary> list = userRepo.findByVolunteeredCommitteesEquals(c);
        list.forEach(
                userSummary -> {
                    Survey s =new Survey();
                    s.setUserId(userSummary.getId());
                    s.setCommitteeId(id);
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

    public CommitteeSummary createCommittee(Committee c) {
    	// Save the basic entity
    	Committee copy = new Committee.Builder()
    			.year( c.getYear() )
    			.name( c.getName() )
    			.introduction( c.getIntroduction() )
    			.build();
    	
    	// Fill in the missing parts 
    	Committee committee = committeeRepo.save( copy );
    	
    	List<Criteria> criteria = c.getCriteria()
    		.stream()
    		.map( crit -> {
    			crit.setCommittee( committee );
    			return crit;
    		})
    		.collect( Collectors.toList() );

    	List<Duty> duties = c.getDuties()
        		.stream()
        		.map( duty -> {
        			duty.setCommittee( committee );
        			return duty;
        		})
        		.collect( Collectors.toList() );
    	
    	criteriaRepo.saveAll( criteria );
    	dutyRepo.saveAll( duties );
    	
    	committee.setCriteria(criteria);
    	committee.setDuties( duties );
        committeeRepo.save(committee);
        
        return committeeRepo.findByNameEqualsAndYearEquals( committee.getName(), committee.getYear() );
    }
}
