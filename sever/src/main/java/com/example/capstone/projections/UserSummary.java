package com.example.capstone.projections;

import com.example.capstone.entities.College;
import com.example.capstone.entities.Gender;

public interface  UserSummary {
    public Long getId();
    public String getYear();
    public String getLast();
    public String getFirst();
    public College getCollege();
    public Boolean getTenured();
    public Boolean getSoe();
    public Boolean getAdminResponsibility();
    public String getEmail();
    public Gender getGender();
    public String getRank();
}
