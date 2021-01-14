package com.example.capstone.service;

import com.example.capstone.entities.*;
import com.example.capstone.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class MockService {
    @Autowired
    private CommitteeRepository committeeRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private CriteriaRepository criteriaRepo;

    @Autowired
    private DutyRepository dutyRepo;

    @Autowired
    private RoleRepository roleRepo;

    @Autowired
    private CollegeRepository collegeRepo;

    @Autowired
    private DeptRepository deptRepo;

    @Autowired
    private GenderRepository genderRepo;

    public String randomCriteriaCollege() {
        StringBuffer sb = new StringBuffer();
        sb.append("(college ");
        if (Math.random() < 0.33){
            sb.append("csh ");
        } else if (Math.random() < 0.66) {
            sb.append("cash ");
        } else {
            sb.append("cba ");
        }
        sb.append((int) (Math.random() * 3  + 1));
        sb.append(')');
        return sb.toString();
    }

    public String randomCriteriaSoe() {
        StringBuffer sb = new StringBuffer();
        sb.append("(soe ");
        sb.append((int) (Math.random() * 3 + 1));
        sb.append(')');
        return sb.toString();
    }

    public String randomCriteriaSize() {
        StringBuffer sb = new StringBuffer();
        sb.append("(size ");
        sb.append((int) (Math.random() * 7 + 3));
        sb.append(')');
        return sb.toString();
    }

    public String randomString() {
        int length = (int)(Math.random() * 10 + 5);

        StringBuffer sb = new StringBuffer();
        for( int i = 0; i < length; i++ ) {
            int offset = (int)(Math.random() * 26 );
            sb.append( (char)( 'a' + offset ));
        }
        return sb.toString();
    }

    public String year() {
        return String.valueOf( (int)( Math.random() * 20 + 2000 ) );
    }

    public static String staticYear() {
        return String.valueOf( (int)( Math.random() * 20 + 2000 ) );
    }

    public List<Role> roles() {
        return Arrays.asList("Admin", "Normal", "Nominate" )
                .stream()
                .map( roleName -> {
                    Role role = new Role();
                    role.setRole(roleName);
                    return roleRepo.save(role);
                })
                .collect( Collectors.toList() );
    }

    public List<College> colleges() {
        return Arrays.asList("CSH", "CASSH", "CBA", "SOE")
                .stream()
                .map( collegeName -> {
                    College college = new College();
                    college.setCollege(collegeName);
                    college.setYear(year());
                    return collegeRepo.save(college);
                })
                .collect( Collectors.toList() );
    }

    public List<Dept> depts() {
        return Arrays.asList("A", "B", "C", "D")
                .stream()
                .map(  deptName -> {
                    Dept dept = new Dept();
                    dept.setDeptName(deptName);
                    dept.setYear(year());
                    return deptRepo.save(dept);
                })
                .collect( Collectors.toList() );
    }

    public List<Gender> genders() {
        return Arrays.asList("M", "F")
                .stream()
                .map(  genderName -> {
                    Gender gender = new Gender();
                    gender.setGender(genderName);
                    gender.setYear(year());
                    return genderRepo.save(gender);
                })
                .collect( Collectors.toList() );
    }

    public static List<String> ranks = Arrays.asList( "Associate Professor", "Assistant Professor", "Full Professor" );
    public static List<College> colleges = Arrays.asList(
            new College.Builder().college("CSH").year("2018").build(),
            new College.Builder().college("CASSH").year("2018").build(),
            new College.Builder().college("CBA").year("2018").build(),
            new College.Builder().college("CSH").year("2019").build(),
            new College.Builder().college("CASSH").year("2019").build(),
            new College.Builder().college("CBA").year("2019").build(),
            new College.Builder().college("SOE").year("2019").build());
    public static List<Gender> genders = Arrays.asList(
            new Gender.Builder().gender("M").year(staticYear()).build(),
            new Gender.Builder().gender("F").year(staticYear()).build());
    public static List<Dept> depts = Arrays.asList(
            new Dept.Builder().deptName("A").year(staticYear()).build(),
            new Dept.Builder().deptName("B").year(staticYear()).build(),
            new Dept.Builder().deptName("C").year(staticYear()).build(),
            new Dept.Builder().deptName("D").year(staticYear()).build()
    );

    public static <T> T one( List<T> ts ) {
        int index = (int)(Math.random() * ts.size() );
        return ts.get(index);
    }

    public String email() {
        return randomString() + "@uwlax.edu";
    }

    public User user(List<Role> roles) {
        //Builder design modal
        return new User.Builder()
                .first( randomString() )
                .last( randomString() )
                .rank( one( ranks ) )
                .college( one( colleges ) )
                .email( email() )
                .committees( new HashSet<>())
                .volunteeredCommittees(new HashSet<>())
                .gender( one( genders ))
                .dept( one( depts ) )
                .adminResponsibility(Math.random() < .6)
                .year( year() )
                .tenured( Math.random() < .6 )
                .soe( Math.random() < .35 )
                .gradStatus( Math.random() < .35 )
                .chair(Math.random() < .35)
                .roles( choose( roles, (int)(Math.random() * 2 + 1 ) ) )
                .build();
    }

    public List<Criteria> criteria(final Committee committee) {
        List<Criteria> criteria = new ArrayList<Criteria>();
        if(Math.random() > 0.3){
            Criteria c = new Criteria.Builder()
                    .criteria( this.randomCriteriaSoe() )
                    .committee(committee)
                    .build();
            criteria.add(c);
        }
        if(Math.random() > 0.3){
            Criteria c = new Criteria.Builder()
                    .criteria( this.randomCriteriaCollege() )
                    .committee(committee)
                    .build();
            criteria.add(c);
        }
        if(Math.random() > 0.3){
            Criteria c = new Criteria.Builder()
                    .criteria( this.randomCriteriaSize() )
                    .committee(committee)
                    .build();
            criteria.add(c);
        }
        return criteriaRepo.saveAll( criteria );
    }

    public List<Duty> duties(Committee committee) {
        List<Duty> duties = IntStream
                .range(0,  (int)(Math.random() * 5 + 10 ) )
                .mapToObj( i -> {
                    Duty duty = new Duty.Builder()
                            .duty( randomString() )
                            .committee(committee)
                            .build();
                    return dutyRepo.save( duty );
                })
                .collect(Collectors.toList());

        return dutyRepo.saveAll( duties );
    }

    public Committee committee( ) {
        Committee committee = new Committee();
        committee.setIntroduction(randomString());
        committee.setName(randomString());
        committee.setYear( year() );
        committee = committeeRepo.save( committee );

        committee.setCriteria( criteria( committee ) );
        committee.setDuties( duties( committee ) );
        committee.setMembers( new HashSet<>() );

        return committeeRepo.save( committee );
    }

    public List<Committee> committees( ) {
        List<Committee> committees = IntStream
                .range(0,  200 )
                .mapToObj( i -> committee() )
                .collect( Collectors.toList() );
        return committeeRepo.saveAll( committees );
    }

    public List<User> users(List<Role> roles) {
        List<User> users = IntStream
                .range(0,  200 )
                .mapToObj( i -> user(roles) )
                .collect( Collectors.toList() );

        return userRepo.saveAll( users );
    }

    public <T> List<T> choose( List<T> ts, int n ) {
        if( n > ts.size() ) return ts;
        List<T> copy = new ArrayList<T>( ts );
        Collections.shuffle(copy);
        return copy.subList(0,  n);
    }

    //	@PostConstruct
    public void makeData() {
        List<Role> roles = roles();
        List<Committee> committees = committees();
        List<Gender> genders = genders();
        List<Dept> depts = depts();
        List<User> users = users(roles);

        committees
                .stream()
                .forEach( c -> {
                    List<User> members = choose( userRepo.findByYear(c.getYear()) , (int)(Math.random() * 10 ) );
                    Set memberSet =  new HashSet();
                    Set volunteerSet = new HashSet();
                    members.forEach(
                            member->{
                                if (!memberSet.contains(member)){
                                    memberSet.add(member);
                                    volunteerSet.add(member);
                                }
                            }
                    );
                    c.setMembers( memberSet );
                    c.setVolunteers( volunteerSet );
                });
        committeeRepo.saveAll( committees );
    }
}
