package com.example.capstone.entities;

public class CommitteeUser {
    private Long id;
    private String first;
    private String last;
    private String rank;
    private String college;
    private Long tenured;
    private Long soe;
    private Long adminResponsibility;
    private String gender;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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


    public Long getTenured() {
        return tenured;
    }

    public void setTenured(Long tenured) {
        this.tenured = tenured;
    }


    public Long getSoe() {
        return soe;
    }

    public void setSoe(Long soe) {
        this.soe = soe;
    }


    public Long getAdminResponsibility() {
        return adminResponsibility;
    }

    public void setAdminResponsibility(Long adminResponsibility) {
        this.adminResponsibility = adminResponsibility;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

}
