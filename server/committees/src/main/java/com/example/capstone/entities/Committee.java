package com.example.capstone.entities;

import javax.persistence.*;
import java.util.List;
import java.util.Set;


@Entity
public class Committee {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;

    private String introduction;
    private String name;
    private String year;

    @ManyToMany
    @JoinTable(name = "committee_members",joinColumns = { @JoinColumn(name = "committee_id")},inverseJoinColumns = {@JoinColumn(name = "members_id")})
    private Set<User> members;

    @OneToMany
    private List<Criteria> criteria;

    @OneToMany
    private List<Duty> duties;

    @ManyToMany
    @JoinTable(name = "committee_volunteers",joinColumns = { @JoinColumn(name = "committee_id")},inverseJoinColumns = {@JoinColumn(name = "volunteers_id")})
    private Set<User> volunteers;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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

    public Set<User> getVolunteers() {
        return volunteers;
    }

    public Set<User> getMembers() {
        return members;
    }

    public List<Criteria> getCriteria() {
        return criteria;
    }

    public void setCriteria(List<Criteria> criteria) {
        this.criteria = criteria;
    }

    public void setDuties(List<Duty> duties) {
        this.duties = duties;
    }

    public List<Duty> getDuties() {
        return duties;
    }

    public void setMembers(Set<User> users) {
        this.members = users;
    }

    public void setVolunteers(Set<User> volunteers) {
        this.volunteers = volunteers;
    }

    public void removeMember(User a){
        this.members.remove(a);
        a.getCommittees().remove(this);
    }

}

