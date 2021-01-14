package com.example.capstone.projections;

import com.example.capstone.entities.Criteria;
import java.util.List;

public interface CommitteeWithUserSummaries {
	public Long getId();
	public String getIntroduction();
	public String getName();
	public String getYear();
	public List<Criteria> getCriteria();
	public List<Duty> getDuties();
	public List<UserSummary> getMembers();
	public List<UserSummary> getVolunteers();
}
