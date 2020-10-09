package com.example.capstone.entities;

import java.util.ArrayList;

public class userT {

    private Integer id;
    private String first;
    private String last;
    private String rank;
    private String college;
    private String tenured;
    private String soe;
    private String adminResponsibility;
    private String email;
    private String gender;
    private ArrayList<userCommittee> committees;
    private ArrayList<String> role;
    private String year;
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }


    public String getFirst() {
        return first;
    }

    public void setFirst(String first) {
        this.first = first;
    }


    public String getLast() {
        return last;
    }

    public void setLast(String last) {
        this.last = last;
    }


    public String getRank() {
        return rank;
    }

    public void setRank(String rank) {
        this.rank = rank;
    }


    public String getCollege() {
        return college;
    }

    public void setCollege(String college) {
        this.college = college;
    }


    public String getTenured() {
        return tenured;
    }

    public void setTenured(String tenured) {
        this.tenured = tenured;
    }


    public String getSoe() {
        return soe;
    }

    public void setSoe(String soe) {
        this.soe = soe;
    }


    public String getAdminResponsibility() {
        return adminResponsibility;
    }

    public void setAdminResponsibility(String adminResponsibility) {
        this.adminResponsibility = adminResponsibility;
    }


    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public void setCommittees(ArrayList<userCommittee> committees) {
        this.committees = committees;
    }

    public ArrayList<userCommittee> getCommittees() {
        return committees;
    }

    public void setRole(ArrayList<String> role) {
        this.role = role;
    }

    public ArrayList<String> getRole() {
        return role;
    }

    public void setEmail(String email){
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setYear(String year) {
        if (year!=null){
            this.year = year.toString().substring(0,4);}
    }

    public String getYear() {
        return year;
    }
}
