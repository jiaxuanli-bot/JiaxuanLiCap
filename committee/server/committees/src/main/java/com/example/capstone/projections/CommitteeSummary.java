package com.example.capstone.projections;

import com.example.capstone.entitiesNew.Criteria;

import java.util.List;

public interface CommitteeSummary {
    public Long getId();
    public String getIntroduction();
    public String getName();
    public String getYear();
    public List<Criteria> getCriteria();
    public List<Duty> getDuties();
}