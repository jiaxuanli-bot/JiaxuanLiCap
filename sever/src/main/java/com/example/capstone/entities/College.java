package com.example.capstone.entities;


import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class College {

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;
    private String college;
    private String year;

    public College() {
    }

    private College( Builder b ) {
        this.id = b.id;
        this.college = b.college;
        this.year = b.year;
    }

    public void setCollege(String college) {
        this.college = college;
    }

    public String getCollege() {
        return college;
    }

    public void setYear(String year){
        this.year = year;
    }

    public void setId( Long id ) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public String getYear() {
        return year;
    }

    public static class Builder {
        private Long id;
        private String college;
        private String year;

        public Builder id( Long id ) {
            this.id = id;
            return this;
        }

        public Builder college(String college){
            this.college = college;
            return this;
        }

        public Builder year(String year){
            this.year = year;
            return this;
        }

        public College build() {
            return new College( this );
        }
    }
}


