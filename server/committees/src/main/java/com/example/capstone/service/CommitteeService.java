package com.example.capstone.service;
import com.example.capstone.entities.Survey;
import com.example.capstone.entities.Committee;
import com.example.capstone.projections.CommitteeSummary;
import com.example.capstone.projections.CommitteesWithMembersAndVolunteers;
import com.example.capstone.projections.UserSummary;
import com.example.capstone.repositories.CommitteeRepository;
import com.example.capstone.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@Service
public class CommitteeService {
    @Autowired
    private CommitteeRepository committeeRepo;

    @Autowired
    private UserRepository userRepo;

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
        ArrayList<String> years = new ArrayList<>();
        committeeRepo.findDistinctByYearNotNullOrderByYearAsc().forEach(
                committeesYearsOnly -> {
                    years.add(committeesYearsOnly.getYear());
                }
        );
        return years;
     }

     public List<String> getCommitteeYears(Long id){
        ArrayList<String> years = new ArrayList<String>();
        committeeRepo.findDistinctByYearNotNullAndIdEqualsOrderByYearAsc(id).forEach(
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

    public void assignCommitteeMember(Long id,Long userId){
        userRepo.findById(Long.valueOf(userId)).map(
                user -> {
                    Committee c = new Committee();
                    c.setId(Long.valueOf(id));
                    user.getCommittees().add(c);
                    return userRepo.save(user);
                }
        );
    }

    public void removeMember(Long id ,Long memberId){
        committeeRepo.findById(Long.valueOf(id)).map(
                committee -> {
                    return userRepo.findById(Long.valueOf(memberId)).map(
                            user -> {
                                user.removeCommittee(committee);
                                return userRepo.save(user);
                            }
                    );
                }
        );
    }
}
