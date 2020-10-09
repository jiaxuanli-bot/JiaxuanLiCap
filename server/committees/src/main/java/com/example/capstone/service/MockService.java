package com.example.capstone.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import javax.swing.plaf.synth.SynthProgressBarUI;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;

@Service
public class MockService { ;
    @Autowired
    JdbcTemplate jdbcTemplate;
    public void mockData(int userNum, int committeeNum){
        jdbcTemplate.update("delete from committee_member");
        jdbcTemplate.update("delete from criteria");
        jdbcTemplate.update("delete from duty");
        jdbcTemplate.update("delete from member_role");
        jdbcTemplate.update("delete from survey");
        jdbcTemplate.update("delete from user");
        jdbcTemplate.update("delete from committee");
        ArrayList<String> rankList = new ArrayList<>();
        rankList.add("Full Professor");
        rankList.add("Associate Professor");
        rankList.add("Assistant Professor");
        ArrayList<String> collegeList = new ArrayList<>();
        collegeList.add("CASH");
        collegeList.add("CSH");
        collegeList.add("CBA");
        ArrayList<String> genderList = new ArrayList<>();
        genderList.add("M");
        genderList.add("F");
        ArrayList<String> Committees = new ArrayList<>();
        Committees.add("Nominating Committee");
        Committees.add("Faculty Standing Committee");
        Committees.add("Standing Committee");
        Committees.add("Academic Planning Committee");
        Committees.add("Planning Committee");
        Random random=new Random();
        String year;
        int randomNum;
        int randomNum2;
        HashSet<String> set =new HashSet<String>();

        for (int i = 0; i < Committees.size(); i++) {
            set.clear();
            for (int l = 0; l < 5; l++) {
                year = getRandomYear();
                while (set.contains(year)) {
                    System.out.println(121212);
                    year = getRandomYear();
                };
                set.add(year);
                String introduction = "The following faculty standing committees shall perform in";
                jdbcTemplate.update("INSERT into committee (id, introduction, name, year) values (?,?,?,?)",5*i+l,introduction,Committees.get(i),year);
                for(int j =1;j<= 10; j++) {
                    jdbcTemplate.update("INSERT into criteria (criteria, committee_id) values (?,?)",getRandomString(20),5*i+l);
                }
                for (int k=0; k<=10; k++) {
                    jdbcTemplate.update("INSERT into duty (duty, committee_id) values (?,?)",getRandomString(20),5*i+l);
                }
            }
        }

        for (int j =1; j <= userNum; j++) {
            String first = getRandomString(4);
            String last = getRandomString(5);
            String rank = getRandomFromList(rankList);
            String college = getRandomFromList(collegeList);
            int tenured = random.nextInt(2);
            int soe = random.nextInt(2);
            int admin_responsibility = random.nextInt(2);
            String gender = getRandomFromList(genderList);
            String email = getRandomString(10);
            year = getRandomYear();
            System.out.println(j);
            jdbcTemplate.update("INSERT into user (id, first, last, rank, college, tenured, soe, admin_responsibility, gender, email, year) values (?,?,?,?,?,?,?,?,?,?,?)",j,first,last,rank,college,tenured,soe,admin_responsibility,gender,email,year);
            randomNum = random.nextInt(3)+1;
            for (int k =1; k <= randomNum; k++) {
                jdbcTemplate.update("INSERT into member_role (role_id, user_id) values (?, ?)",k,j);
            }
            Set<Integer> numSet = new HashSet<Integer>();
            randomNum = random.nextInt(10);
            for (int l = 1; l <= randomNum; l++){
                randomNum2 = random.nextInt(committeeNum-1)+1;
                if(!numSet.contains(randomNum2)){
                    numSet.add(randomNum2);
                    jdbcTemplate.update("INSERT into survey (user_id, committee_id) values (?,?)",j,randomNum2);
                }
            }
            randomNum = random.nextInt(10)+1;
            numSet = new HashSet<Integer>();
            for(int m = 1; m <= randomNum; m++){
                randomNum2 = random.nextInt(committeeNum-1)+1;
                if (!numSet.contains(randomNum2)){
                    numSet.add(randomNum2);
                    jdbcTemplate.update("INSERT into committee_member (user_id, committee_id) values (?,?)",j,randomNum2);
                }
            }
        }
    }

    public static String getRandomString(int length){
        String str="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random=new Random();
        StringBuffer sb=new StringBuffer();
        for(int i=0;i<length;i++){
            int number=random.nextInt(62);
            sb.append(str.charAt(number));
        }
        return sb.toString();
    }
    public static String getRandomYear(){
        String str="0129";
        Random random=new Random();
        StringBuffer sb=new StringBuffer();
        sb.append("20");
        for(int i=0;i<2;i++){
            int number=random.nextInt(3);
            sb.append(str.charAt(number));
        }
        return sb.toString();
    }

    public static String getRandomFromList(ArrayList<String> arrayList){
        Random random=new Random();
        return arrayList.get(random.nextInt(arrayList.size()));
    }

    public void truncate(){
//        jdbcTemplate.update("delete from committee_member");
//        jdbcTemplate.update("delete from criteria");
//        jdbcTemplate.update("delete from duty");
//        jdbcTemplate.update("delete from member_role");
        jdbcTemplate.update("delete from survey");
//        jdbcTemplate.update("delete from user");
//        jdbcTemplate.update("delete from committee");
    }

}
