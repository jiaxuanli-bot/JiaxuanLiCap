package com.example.capstone.entities;


public class Survey {
  private Long userId;
  private Long committeeId;

  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public void setCommitteeId(Long committeeId) {
    this.committeeId = committeeId;
  }

  public Long getCommitteeId() {
    return committeeId;
  }
}
