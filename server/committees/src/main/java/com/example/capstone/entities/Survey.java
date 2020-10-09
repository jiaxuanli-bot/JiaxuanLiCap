package com.example.capstone.entities;


public class Survey {

  private String id;
  private Integer userId;
  private Integer committeeId;


  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }


  public Integer getUserId() {
    return userId;
  }

  public void setUserId(Integer userId) {
    this.userId = userId;
  }

  public void setCommitteeId(Integer committeeId) {
    this.committeeId = committeeId;
  }

  public Integer getCommitteeId() {
    return committeeId;
  }
}
