package com.example.capstone.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Gender {

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;
    private String gender;
    private String year;

    public Gender() {
    }

    private Gender( Builder b ) {
        this.id = b.id;
        this.gender = b.gender;
        this.year = b.year;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getGender() {
        return gender;
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
        private String gender;
        private String year;

        public Builder id( Long id ) {
            this.id = id;
            return this;
        }

        public Builder gender(String gender){
            this.gender = gender;
            return this;
        }

        public Builder year(String year){
            this.year = year;
            return this;
        }

        public Gender build() {
            return new Gender( this );
        }
    }
}


