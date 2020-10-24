package com.example.capstone.projections;

import java.util.List;
import java.util.Set;

public interface UserWithCommittees {
    public Long getId();
    public String getLast();
    public String getFirst();
    public String getCollege();
    public Boolean getTenured();
    public Boolean getSoe();
    public Boolean getAdminResponsibility();
    public String getEmail();
    public String getRank();
    public String getGender();
    public Set<CommitteeSummary> getCommittees();
    public Set<CommitteeSummary> getVolunteeredCommittees();
}
