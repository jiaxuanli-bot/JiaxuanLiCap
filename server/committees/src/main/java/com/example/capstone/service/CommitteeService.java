package com.example.capstone.service;

import com.example.capstone.entities.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.HashMap;


@Service
public class CommitteeService {
    @Autowired
    JdbcTemplate jdbcTemplate;
    public ArrayList<Committee> getCommitteeById(String id){
        ArrayList<Committee> committees = new ArrayList<>();
        ArrayList<CommitteeUser> committeeMembers;
        ArrayList<Duty> committeeDutys;
        ArrayList<Criteria> committeeCriterias;
        committees = (ArrayList<Committee>) jdbcTemplate.query("select committee.* from capstone.committee where id =?",new BeanPropertyRowMapper<>(Committee.class),id);
        if(committees.size() > 0){
            for (int i=0;i<committees.size();i++){
                committeeMembers = (ArrayList<CommitteeUser>) jdbcTemplate.query("select u.* from (capstone.committee c left join committee_member cm on (c.id = cm.committee_id)) left join user u on (cm.user_id = u.id) where c.id=? ORDER BY u.last ASC", new BeanPropertyRowMapper<>(CommitteeUser.class),id);
                committeeDutys = (ArrayList<Duty>) jdbcTemplate.query("select d.* from (capstone.committee c left join duty d on (c.id = d.committee_id)) where c.id=?", new BeanPropertyRowMapper<>(Duty.class),id);
                committeeCriterias = (ArrayList<Criteria>) jdbcTemplate.query("select d.* from (committee c left join criteria d on (c.id = d.committee_id)) where c.id=?", new BeanPropertyRowMapper<>(Criteria.class),id);
                if (committeeMembers.get(0).getId()!=null){
                    committees.get(i).setMembers(committeeMembers);
                }
                else {
                    committees.get(i).setMembers(new ArrayList<CommitteeUser>());
                }
                if (committeeDutys.get(0).getId()!=null) {
                    committees.get(i).setDuties(committeeDutys);
                }
                else {
                    committees.get(i).setDuties(new ArrayList<Duty>());
                }
                if (committeeCriterias.get(0).getId()!=null){
                    committees.get(i).setCriterias(committeeCriterias);
                }
                else {
                    committees.get(i).setCriterias(new ArrayList<Criteria>());
                }
            }
        }
        return committees;
    }

    public ArrayList<Committee> getCommitteeByStartYearAndEndYear(String startYear,String endYear){
        ArrayList<Committee> committees;
        committees = (ArrayList<Committee>) jdbcTemplate.query("select committee.* from capstone.committee where year>=? and year <= ?",new BeanPropertyRowMapper<>(Committee.class),startYear,endYear);
        if(committees.size() > 0){
             for (int i=0;i<committees.size();i++){
                ArrayList<CommitteeUser> committeeMembers;
                ArrayList<Duty> committeeDutys;
                ArrayList<Criteria> committeeCriterias;
                committeeMembers =  (ArrayList<CommitteeUser>) jdbcTemplate.query("select u.* from (capstone.committee c left join committee_member cm on (c.id = cm.committee_id)) left join user u on (cm.user_id = u.id) where c.id=?", new BeanPropertyRowMapper<>(CommitteeUser.class),committees.get(i).getId());
                committeeDutys =  (ArrayList<Duty>) jdbcTemplate.query("select d.* from (capstone.committee c left join duty d on (c.id = d.committee_id)) where c.id=?", new BeanPropertyRowMapper<>(Duty.class),committees.get(i).getId());
                committeeCriterias =   (ArrayList<Criteria>) jdbcTemplate.query("select d.* from (committee c left join criteria d on (c.id = d.committee_id)) where c.id=?", new BeanPropertyRowMapper<>(Criteria.class),committees.get(i).getId());
                if (committeeMembers.get(0).getId()!=null){
                    System.out.println("123");
                    committees.get(i).setMembers(committeeMembers);
                }
                else {
                    committees.get(i).setMembers(new ArrayList<CommitteeUser>());
                }
                if (committeeDutys.size()>0&&committeeDutys.get(0).getId()!=null) {
                    committees.get(i).setDuties(committeeDutys);
                 }
                else {
                    committees.get(i).setDuties(new ArrayList<Duty>());
                }
                if (committeeCriterias.get(0).getId()!=null){
                    committees.get(i).setCriterias(committeeCriterias);
                }
                else {
                    committees.get(i).setCriterias(new ArrayList<Criteria>());
                }
            }
        }
        return committees;
    }

    public HashMap<String, ArrayList<Committee>> getHashedCommitteeByStartYearAndEndYear(String startYear, String endYear){
        ArrayList<Committee> committees;
        HashMap<String,ArrayList<Committee>> res= new HashMap<String,ArrayList<Committee>>();
        committees = (ArrayList<Committee>) jdbcTemplate.query("select committee.* from capstone.committee where year>=? and year <= ?",new BeanPropertyRowMapper<>(Committee.class),startYear,endYear);
        if(committees.size() > 0){
            for (int i=0;i<committees.size();i++){
                ArrayList<CommitteeUser> committeeMembers;
                committeeMembers =  (ArrayList<CommitteeUser>) jdbcTemplate.query("select u.* from (capstone.committee c left join committee_member cm on (c.id = cm.committee_id)) left join user u on (cm.user_id = u.id) where c.id=?", new BeanPropertyRowMapper<>(CommitteeUser.class),committees.get(i).getId());

                if (committeeMembers.get(0).getId()!=null){
                    committees.get(i).setMembers(committeeMembers);
                }
                else {
                    committees.get(i).setMembers(new ArrayList<CommitteeUser>());
                }
            }
        }
        String committeeName = committees.get(0).getName();
        ArrayList<Committee> temp =new ArrayList<Committee>();
        for (int j = 0; j < committees.size(); j++) {
            if ((!committees.get(j).getName().equals( committeeName))) {
                res.put(committeeName, temp);
                committeeName = committees.get(j).getName();
                temp =new ArrayList<Committee>();
            }
            temp.add(committees.get(j));
            if (j+1==committees.size()) {
                res.put(committeeName,temp);
            }
        }
        return res;
    }


    public ArrayList<User> getCommitteeMembersById(String id) {
        ArrayList<User> users = new ArrayList<User>();
        users = (ArrayList<User>) jdbcTemplate.query(" select u.* from capstone.committee c left join committee_member cm on c.id = cm.committee_id left join user u on cm.user_id = u.id where c.id=? ORDER BY u.last ASC",new BeanPropertyRowMapper<>(User.class),id);
        if(users.size()>0&&users.get(0).getId()!=null) {
            for (int i=0;i<users.size();i++) {
                ArrayList<userCommittee> committees;
                committees = (ArrayList<userCommittee>) jdbcTemplate.query("select c.* from capstone.user as a\n" +
                        "            left join committee_member s on a.id = s.user_id\n" +
                        "            left join capstone.committee c on s.committee_id = c.id where a.id=?;",new BeanPropertyRowMapper<>(userCommittee.class),users.get(i).getId());
                if (committees.size()>1){
                    users.get(i).setCommittees(committees);
                }
                else {
                    users.get(i).setCommittees(new ArrayList<userCommittee>());
                }
                ArrayList<String> roles = (ArrayList<String>) jdbcTemplate.queryForList("select d.role from member_role c left join role d on (c.role_id = d.id) where c.user_id=?",String.class,users.get(i).getId());
                if (roles.size()>1){
                    users.get(i).setRole(roles);
                }
                else {
                    users.get(i).setRole(new ArrayList<String>());
                }
            }
        }
        return users;
    }

    public ArrayList<Survey> getCommitteeVolunteersById(String id) {
        ArrayList<Survey> surveys = new ArrayList<>();
        ArrayList<Integer> uid = (ArrayList<Integer>) jdbcTemplate.queryForList("select u.id from capstone.committee c left join survey s on c.id = s.committee_id left join user u on s.user_id = u.id where c.id=?", Integer.class, id);
        ArrayList<String> sid = (ArrayList<String>) jdbcTemplate.queryForList("select s.id from capstone.committee c left join survey s on c.id = s.committee_id left join user u on s.user_id = u.id where c.id=?", String.class, id);
        ArrayList<String> cid = (ArrayList<String>) jdbcTemplate.queryForList("select s.committee_id from capstone.committee c left join survey s on c.id = s.committee_id left join user u on s.user_id = u.id where c.id=?", String.class, id);
        for (int i=0;i<uid.size();i++){
            Survey s =new Survey();
            s.setCommitteeId(Integer.parseInt(cid.get(i)));
            s.setUserId(uid.get(i));
            s.setId(sid.get(i));
            surveys.add(s);
        }
        return surveys;
    }

    public CommitteeMember assignUser(String userId, String committeeId) {
        CommitteeMember committeeMember;
        jdbcTemplate.update("insert into capstone.committee_member (user_id, committee_id) values (?,?)", userId, committeeId);
        jdbcTemplate.update("DELETE from survey where user_id=? and committee_id = ?",userId,committeeId);
        committeeMember = ((ArrayList<CommitteeMember>) jdbcTemplate.query("select * from committee_member where user_id = ? and committee_id = ?",new BeanPropertyRowMapper<>(CommitteeMember.class),userId,committeeId)).get(0);
        return committeeMember;
    }

    public int deleteUser(String userId, String id) {
       return jdbcTemplate.update(" DELETE from committee_member where user_id=? and committee_id = ?",userId,id);
    }

    public CommitteeMember getCommitteeMemberRecordByUIDAndCID(String userId,String id) {
        return ((ArrayList<CommitteeMember>) jdbcTemplate.query("select * from committee_member c where c.user_id=? and  c.committee_id=?",new BeanPropertyRowMapper<>(CommitteeMember.class),userId,id)).get(0);
    }

    public ArrayList<String> getCommitteesYears(){
        ArrayList<String> years = (ArrayList<String>) jdbcTemplate.queryForList("select distinct year from committee", String.class);
        for (int i = 0; i < years.size(); i++){
            years.set(i,years.get(i).substring(0,4));
        }
        return years;
    }

    public ArrayList<String> getCommitteeYears(String id){
        ArrayList<String> names = (ArrayList<String>) jdbcTemplate.queryForList("select name from committee where id = ? ORDER BY year ASC", String.class ,id);
        ArrayList<String> years = (ArrayList<String>) jdbcTemplate.queryForList("select distinct year from committee where name = ? ORDER BY year ASC", String.class ,names.get(0));
        for (int i = 0; i < years.size(); i++){
            years.set(i,years.get(i).substring(0,4));
        }
        return years;
    }

    public ArrayList<User> getCommitteeVolunteersUsersById(String id) {
        ArrayList<User> users = new ArrayList<User>();
        users = (ArrayList<User>) jdbcTemplate.query(" select u.* from capstone.committee c left join survey cm on c.id = cm.committee_id left join user u on cm.user_id = u.id where c.id=? ORDER BY u.last ASC",new BeanPropertyRowMapper<>(User.class),id);
        if(users.size()>0&&users.get(0).getId()!=null) {
            for (int i=0;i<users.size();i++) {
                ArrayList<userCommittee> committees;
                committees = (ArrayList<userCommittee>) jdbcTemplate.query("select c.* from capstone.user as a\n" +
                        "            left join committee_member s on a.id = s.user_id\n" +
                        "            left join capstone.committee c on s.committee_id = c.id where a.id=?;",new BeanPropertyRowMapper<>(userCommittee.class),users.get(i).getId());
                if (committees.size()>1){
                    users.get(i).setCommittees(committees);
                }
                else {
                    users.get(i).setCommittees(new ArrayList<userCommittee>());
                }
                ArrayList<String> roles = (ArrayList<String>) jdbcTemplate.queryForList("select d.role from member_role c left join role d on (c.role_id = d.id) where c.user_id=?",String.class,users.get(i).getId());
                if (roles.size()>1){
                    users.get(i).setRole(roles);
                }
                else {
                    users.get(i).setRole(new ArrayList<String>());
                }
            }
        }
        if (users.get(0).getId()==null) {
            return new ArrayList<User>();
        }
        return users;
    }

    public String getCommitteeIdByNameAndYear(String name, String year) {
        return ((ArrayList<String>) jdbcTemplate.queryForList("select id from committee where year = ? and name =?", String.class , year, name)).get(0);
    }
}
