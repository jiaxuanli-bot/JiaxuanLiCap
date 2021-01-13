package com.example.capstone.entities;

import javax.persistence.*;

@Entity
public class Comment{

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "committee_id")
    private Committee committee;

    private String comment;

    @Column(name="committee_id", updatable=false, insertable=false)
    public Long committeeId;

    @Column(name="user_id", updatable=false, insertable=false)
    public Long userId;

    public void setCommittee(Committee committee) {
        this.committee = committee;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public User getUser() {
        return user;
    }

    public Committee getCommittee() {
        return committee;
    }

    public Long getUserId(){
        return this.userId;
    }
    public Long getCommitteeId(){
        return this.committeeId;
    }


    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getComment() {
        return comment;
    }

    public Comment(){
    }

    private Comment( Builder b ) {
        this.id = b.id;
        this.user= b.user;
        this.committee = b.committee;
        this.comment = b.comment;
    }

    public static final class Builder {
        private Long id;
        private User user;
        private Committee committee;
        private String comment;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder user(User u) {
            this.user = u;
            return this;
        }

        public Builder committee(Committee committee) {
            this.committee = committee;
            return this;
        }

        public Builder comment(String comment){
            this.comment = comment;
            return this;
        }

        public Comment build() {
            return new Comment(this);
        }
    }
}
