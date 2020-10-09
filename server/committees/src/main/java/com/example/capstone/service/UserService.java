package com.example.capstone.service;
import com.example.capstone.entities.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    @Autowired
    JdbcTemplate jdbcTemplate;

    public User searchUserByEmail(String email) {
        User user;
        ArrayList<User> users;
        users = (ArrayList<User>) jdbcTemplate.query("select * from user u where email = ?", new BeanPropertyRowMapper<>(User.class), email);
        ArrayList<userCommittee> committees;
        if (users.size() > 0) {
            user = users.get(0);
            ArrayList<String> roles = (ArrayList<String>) jdbcTemplate.queryForList("select d.role from member_role c left join role d on (c.role_id = d.id) where c.user_id=?", String.class, user.getId());
            committees = (ArrayList<userCommittee>) jdbcTemplate.query("select c.* from capstone.user as a\n" +
                    "            left join committee_member s on a.id = s.user_id\n" +
                    "            left join capstone.committee c on s.committee_id = c.id where a.id=?;", new BeanPropertyRowMapper<>(userCommittee.class), user.getId());
            user.setCommittees(committees);
            user.setRole(roles);
            return user;
        }
        return null;
    }

    public ArrayList<User> searchUser(String year, String id, String first, String last, String rank, String gender, String college, String tenured, String soe) {
        ArrayList<User> users = new ArrayList<User>();
        String sql;
        sql = "select * from user u where u.id > 0";
        String query = "";
        List<Object> params = new ArrayList<>();
        if (year != null) {
            query += " and u.year= ?";
            params.add(year);
        }
        if (id != null) {
            query += " and u.id= ?";
            params.add(id);
        }
        if (first != null) {
            query += " and u.first=?";
            params.add(first);
        }
        if (last != null) {
            query += " and u.last=?";
            params.add(last);
        }
        if (rank != null) {
            query += " and u.rank = ?";
            params.add(rank);
        }
        if (gender != null) {
            query += " and u.gender=?";
            params.add(gender);
        }
        if (college != null) {
            query += " and u.college=?";
            params.add(college);
        }
        if (tenured != null) {
            query += " and u.tenured=?";
            params.add(tenured);
        }
        if (soe != null) {
            query += " and u.soe=?";
            params.add(soe);
        }
        sql = sql + query + " ORDER BY last ASC";
        Object[] array = params.toArray(new Object[params.size()]);
        if (params.size() > 0) {
            users = ((ArrayList<User>) jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(User.class), array));
        } else {
            users = ((ArrayList<User>) jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(User.class)));
        }
        if (users.size() > 0) {
            for (int i = 0; i < users.size(); i++) {
                ArrayList<userCommittee> committees;
                if (year != null) {
                    committees = (ArrayList<userCommittee>) jdbcTemplate.query("select c.* from capstone.user as a\n" +
                            "            left join committee_member s on a.id = s.user_id\n" +
                            "            left join capstone.committee c on s.committee_id = c.id where a.id=? and c.year=?;", new BeanPropertyRowMapper<>(userCommittee.class), users.get(i).getId(), year);
                } else {
                    committees = (ArrayList<userCommittee>) jdbcTemplate.query("select c.* from capstone.user as a\n" +
                            "            left join committee_member s on a.id = s.user_id\n" +
                            "            left join capstone.committee c on s.committee_id = c.id where a.id=?;", new BeanPropertyRowMapper<>(userCommittee.class), users.get(i).getId());
                }
                if (committees.size() > 0 && committees.get(0).getId() != null) {
                    users.get(i).setCommittees(committees);
                } else {
                    users.get(i).setCommittees(new ArrayList<>());
                }
                ArrayList<String> roles = (ArrayList<String>) jdbcTemplate.queryForList("select d.role from member_role c left join role d on (c.role_id = d.id) where c.user_id=?", String.class, users.get(i).getId());
                if (roles.size() > 0) {
                    users.get(i).setRole(roles);
                } else {
                    users.get(i).setRole(new ArrayList<>());
                }
            }
        }
        return users;
    }

    public User modifyUser(String id, String first, String last, String rank, String college, String tenured, String soe, String admin_responsibility, String gender) {
        ArrayList<User> users = new ArrayList<User>();
        String sql;
        sql = "UPDATE capstone.user a set ";
        String query = " where id = ?;";
        List<Object> params = new ArrayList<>();
        int index = 0;
        if (first != null) {
            if (index == 0) {
                sql += "first=?";
            } else {
                sql += ",first=?";
            }
            index++;
            params.add(first);
        }
        if (last != null) {
            if (index == 0) {
                sql += "last=?";
            } else {
                sql += ",last=?";
            }
            index++;
            params.add(last);
        }
        if (rank != null) {
            if (index == 0) {
                sql += "rank=?";
            } else {
                sql += ",rank=?";
            }
            index++;
            params.add(rank);
        }
        if (college != null) {
            if (index == 0) {
                sql += "college=?";
            } else {
                sql += ",college=?";
            }
            index++;
            params.add(college);
        }
        if (gender != null) {
            if (index == 0) {
                sql += "gender=?";
            } else {
                sql += ",gender=?";
            }
            index++;
            params.add(gender);
        }
        if (tenured != null) {
            if (index == 0) {
                sql += "tenured=?";
            } else {
                sql += ",tenured=?";
            }
            index++;
            params.add(tenured);
        }
        if (soe != null) {
            if (index == 0) {
                sql += "soe=?";
            } else {
                sql += ",soe=?";
            }
            index++;
            params.add(soe);
        }
        if (admin_responsibility != null) {
            if (index == 0) {
                sql += "admin_responsibility=?";
            } else {
                sql += ",admin_responsibility=?";
            }
            index++;
            params.add(admin_responsibility);
        }
        params.add(id);
        if (params.size() > 0) {
            sql = sql + query;
            Object[] array = params.toArray(new Object[params.size()]);
            jdbcTemplate.update(sql, array);
        }

        User user;
        user = ((ArrayList<User>) jdbcTemplate.query("select * from user u where u.id =?", new BeanPropertyRowMapper<>(User.class), id)).get(0);
        ArrayList<userCommittee> committees;
        committees = (ArrayList<userCommittee>) jdbcTemplate.query("select c.* from capstone.user as a\n" +
                "            left join committee_member s on a.id = s.user_id\n" +
                "            left join capstone.committee c on s.committee_id = c.id where a.id=?;", new BeanPropertyRowMapper<>(userCommittee.class), user.getId());
        if (committees.size() > 0 && committees.get(0).getId() != null) {
            user.setCommittees(committees);
        } else {
            user.setCommittees(new ArrayList<>());
        }
        ArrayList<String> roles = (ArrayList<String>) jdbcTemplate.queryForList("select d.role from member_role c left join role d on (c.role_id = d.id) where c.user_id=?", String.class, user.getId());
        if (roles.size() > 0) {
            user.setRole(roles);
        } else {
            user.setRole(new ArrayList<>());
        }
        return user;
    }

    public User deleteUser(String id, String year) {
        User user;
        user = ((ArrayList<User>) jdbcTemplate.query("select * from user u where u.id =?", new BeanPropertyRowMapper<>(User.class), id)).get(0);
        ArrayList<userCommittee> committees = new ArrayList<userCommittee>();
        committees = (ArrayList<userCommittee>) jdbcTemplate.query("select c.* from capstone.user as a\n" +
                "            left join committee_member s on a.id = s.user_id\n" +
                "            left join capstone.committee c on s.committee_id = c.id where a.id=?;", new BeanPropertyRowMapper<>(userCommittee.class), user.getId());
        if (committees != null) {
            user.setCommittees(committees);
        } else {
            user.setCommittees(new ArrayList<>());
        }
        jdbcTemplate.update("DELETE from committee_member where user_id=?", id);
        jdbcTemplate.update("DELETE from member_role where user_id=?", id);
        jdbcTemplate.update("DELETE from survey where user_id=?", id);
        jdbcTemplate.update("DELETE from user where id=?", id);
        return user;
    }

    public userT createUser(userT user) {
        jdbcTemplate.update("INSERT INTO capstone.user (first, last, rank,college,tenured,soe,admin_responsibility,gender,email)values (?,?,?,?,?,?,?,?,?);", user.getFirst(), user.getLast(), user.getRank(), user.getCollege(), user.getTenured(), user.getSoe(), user.getAdminResponsibility(), user.getGender(), user.getEmail());
        return user;
    }

    public ArrayList<Committee> getUserCommitteesByID(String id) {
        ArrayList<Committee> committees;
        committees = (ArrayList<Committee>) jdbcTemplate.query("select c.* from capstone.user as a\n" +
                "            left join committee_member cm on a.id = cm.user_id\n" +
                "            left join committee c on cm.committee_id = c.id where a.id=?", new BeanPropertyRowMapper<>(Committee.class), id);
        if (committees != null && committees.get(0).getId() != null) {
            for (int i = 0; i < committees.size(); i++) {
                ArrayList<CommitteeUser> committeeMembers;
                ArrayList<Duty> committeeDutys;
                ArrayList<Criteria> committeeCriterias;
                committeeMembers = (ArrayList<CommitteeUser>) jdbcTemplate.query("select u.* from (capstone.committee c left join committee_member cm on (c.id = cm.committee_id)) left join user u on (cm.user_id = u.id) where c.id=?", new BeanPropertyRowMapper<>(CommitteeUser.class), committees.get(i).getId());
                committeeDutys = (ArrayList<Duty>) jdbcTemplate.query("select d.* from (capstone.committee c left join duty d on (c.id = d.committee_id)) where c.id=?", new BeanPropertyRowMapper<>(Duty.class), committees.get(i).getId());
                committeeCriterias = (ArrayList<Criteria>) jdbcTemplate.query("select d.* from (committee c left join criteria d on (c.id = d.committee_id)) where c.id=?", new BeanPropertyRowMapper<>(Criteria.class), committees.get(i).getId());
                if (committeeMembers.get(0).getId() != null) {
                    committees.get(i).setMembers(committeeMembers);
                } else {
                    committees.get(i).setMembers(new ArrayList<CommitteeUser>());
                }
                if (committeeDutys.size() > 0 && committeeDutys.get(0).getId() != null) {
                    committees.get(i).setDuties(committeeDutys);
                } else {
                    committees.get(i).setDuties(new ArrayList<Duty>());
                }
                if (committeeCriterias.get(0).getId() != null) {
                    committees.get(i).setCriterias(committeeCriterias);
                } else {
                    committees.get(i).setCriterias(new ArrayList<Criteria>());
                }
                return committees;
            }
        }
        return new ArrayList<>();
    }

    public ArrayList<userCommittee> getUserCommitteesByIdAndYear(String id,String year) {
        ArrayList<userCommittee> committees;
        committees = (ArrayList<userCommittee>) jdbcTemplate.query("select c.* from capstone.user as a\n" +
                "            left join committee_member cm on a.id = cm.user_id\n" +
                "            left join committee c on cm.committee_id = c.id where c.year=? and a.id=?",new BeanPropertyRowMapper<>(userCommittee.class),year,id);
        if (committees.size()>0&&committees.get(0).getId()!=null) {
            return committees;
        }
        else {
            return committees;
        }
    }

    public ArrayList<Survey> getUserSurveys(String id) {
        ArrayList<Survey> surveys = (ArrayList<Survey>) jdbcTemplate.query(" select * from survey where user_id=?;",new BeanPropertyRowMapper<>(Survey.class),id);
        return surveys;
    }

    public ArrayList<Committee> getUserSurveysCommittees(String id) {
        ArrayList<Survey> surveys = (ArrayList<Survey>) jdbcTemplate.query(" select * from survey where user_id=?;",new BeanPropertyRowMapper<>(Survey.class),id);
        ArrayList<Committee> committees = new ArrayList<Committee>();
        if (surveys.size()>  0) {
            for (int j=0; j<surveys.size(); j++) {
                ArrayList<Duty> committeeDutys;
                ArrayList<Criteria> committeeCriterias;
                ArrayList<Committee> tempCommitteesArray;
                tempCommitteesArray = (ArrayList<Committee>) jdbcTemplate.query("select committee.* from capstone.committee where id =?",new BeanPropertyRowMapper<>(Committee.class),surveys.get(j).getCommitteeId()) ;
                if(tempCommitteesArray.size() > 0){
                    committees.add(tempCommitteesArray.get(0));
                    for (int i=0;i<committees.size();i++){
                        committeeDutys = (ArrayList<Duty>) jdbcTemplate.query("select d.* from (capstone.committee c left join duty d on (c.id = d.committee_id)) where c.id=?", new BeanPropertyRowMapper<>(Duty.class),surveys.get(j).getCommitteeId());
                        committeeCriterias = (ArrayList<Criteria>) jdbcTemplate.query("select d.* from (committee c left join criteria d on (c.id = d.committee_id)) where c.id=?", new BeanPropertyRowMapper<>(Criteria.class),surveys.get(j).getCommitteeId());
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

            }
        }
        return committees;
    }

    public Survey createSurvey(String id, String committee_id) {
        Survey survey =new Survey();
        survey.setCommitteeId(Integer.parseInt(committee_id));
        survey.setUserId(Integer.parseInt(id));
        jdbcTemplate.update(" INSERT into capstone.survey (user_id, committee_id) values (?,?)",id,committee_id);
        return survey;
    }

    public Survey getSurvey(String id, String committee_id) {
        Survey survey;
        ArrayList<Survey> surveys;
        System.out.println("survey");
        surveys = (ArrayList<Survey>) jdbcTemplate.query("select * from survey s where s.user_id=? and s.committee_id=?", new BeanPropertyRowMapper<>(Survey.class), id, committee_id);
        if (surveys.size()>0)
        {
            return surveys.get(0);
        }
        return null;
    }

    public Survey deleteSurvey(String id, String committee_id) {
        Survey survey =new Survey();
        survey.setUserId(Integer.parseInt(committee_id));
        survey.setUserId(Integer.parseInt(id));
        survey.setUserId(Integer.parseInt(id));
        jdbcTemplate.update("DELETE from capstone.survey where user_id = ? and committee_id = ?",id,committee_id);
        return survey;
    }

    public ArrayList<User> getCommitteesByYearAndPage(Integer pageIndex,String year,Integer pageLength) {
        System.out.println("limit");
        ArrayList<User> users = new ArrayList<User>();
        String sql;
        sql = "select * from user u where u.year="+year;
        String query = "";
        List<Object> params = new ArrayList<>();
        sql=sql+query + " ORDER BY last ASC limit "+(pageIndex)*pageLength+","+pageLength;
        users = ((ArrayList<User>) jdbcTemplate.query(sql,new BeanPropertyRowMapper<>(User.class)));
        if(users.size() > 0) {
            for (int i=0;i<users.size();i++) {
                ArrayList<userCommittee> committees;
                if(year!=null){
                    committees = (ArrayList<userCommittee>) jdbcTemplate.query("select c.* from capstone.user as a\n" +
                            "            left join committee_member s on a.id = s.user_id\n" +
                            "            left join capstone.committee c on s.committee_id = c.id where a.id=? and c.year=?;",new BeanPropertyRowMapper<>(userCommittee.class),users.get(i).getId(),year);
                }else {
                    committees = (ArrayList<userCommittee>) jdbcTemplate.query("select c.* from capstone.user as a\n" +
                            "            left join committee_member s on a.id = s.user_id\n" +
                            "            left join capstone.committee c on s.committee_id = c.id where a.id=?;",new BeanPropertyRowMapper<>(userCommittee.class),users.get(i).getId());
                }
                if (committees.size()>0&&committees.get(0).getId()!=null){
                    users.get(i).setCommittees(committees);
                }
                else {
                    users.get(i).setCommittees(new ArrayList<>());
                }
                ArrayList<String> roles = (ArrayList<String>) jdbcTemplate.queryForList("select d.role from member_role c left join role d on (c.role_id = d.id) where c.user_id=?",String.class,users.get(i).getId());
                if (roles.size()>0){
                    users.get(i).setRole(roles);
                }
                else {
                    users.get(i).setRole(new ArrayList<>());
                }
            }
        }
        return users;
    }
    public  ArrayList<String> getUserYears(String email){
        ArrayList<String> years = (ArrayList<String>) jdbcTemplate.queryForList("select year from user where email = ?", String.class , email);
        for (int i = 0; i < years.size(); i++){
            years.set(i,years.get(i).substring(0,4));
        }
        return years;
    }
}
