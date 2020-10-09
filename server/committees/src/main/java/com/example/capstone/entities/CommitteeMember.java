package com.example.capstone.entities;



public class CommitteeMember {

  private String id;
  private Integer userId;
  private String committeeId;

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


  public String getCommitteeId() {
    return committeeId;
  }

  public void setCommitteeId(String committeeId) {
    this.committeeId = committeeId;
  }

}
