package com.example.capstone.entities;


import javax.validation.constraints.Pattern;
import java.time.Year;
import java.util.ArrayList;

public class Committee {

    private String id;
    private String introduction;
    private String name;
    private String year;

    private ArrayList<CommitteeUser> members;
    private ArrayList<Criteria> criterias;
    private ArrayList<Duty> duties;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }


    public String getIntroduction() {
        return introduction;
    }

    public void setIntroduction(String introduction) {
        this.introduction = introduction;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        if (year!=null) {
            this.year = year.toString().substring(0, 4);
        }
    }

    public ArrayList<CommitteeUser> getMembers() {
        return members;
    }

    public ArrayList<Criteria> getCriterias() {
        return criterias;
    }

    public void setCriterias(ArrayList<Criteria> criterias) {
        this.criterias = criterias;
    }

    public void setDuties(ArrayList<Duty> duties) {
        this.duties = duties;
    }

    public ArrayList<Duty> getDuties() {
        return duties;
    }

    public void setMembers(ArrayList<CommitteeUser> users) {
        this.members = users;
    }
}

