package com.example.capstone.projections;

import com.example.capstone.entitiesNew.Criteria;

import java.util.List;

public interface CommitteesWithMembersAndVolunteers {
    public Long getId();
    public String getIntroduction();
    public String getName();
    public String getYear();
    public List<Criteria> getCriteria();
    public List<Duty> getDuties();
    public List<UserSummary> getMembers();
    public List<UserSummary> getVolunteers();
}
