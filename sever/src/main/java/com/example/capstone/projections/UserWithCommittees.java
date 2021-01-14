package com.example.capstone.projections;

import java.util.Set;

import com.example.capstone.entities.College;
import com.example.capstone.entities.Gender;

public interface UserWithCommittees {
    public Long getId();
    public String getLast();
    public String getFirst();
    public College getCollege();
    public Boolean getTenured();
    public Boolean getSoe();
    public Boolean getAdminResponsibility();
    public String getEmail();
    public String getRank();
    public Gender getGender();
    public Set<CommitteeSummary> getCommittees();
    public Set<CommitteeSummary> getVolunteeredCommittees();
}
