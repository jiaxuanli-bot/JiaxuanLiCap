package com.example.capstone.entities;

import javax.persistence.Id;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;


@Entity
public class Dept {

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Long id;
    private String deptName;
    private String year;

    public Dept() {
    }

    private Dept( Builder b ) {
        this.id = b.id;
        this.deptName = b.deptName;
        this.year = b.year;
    }

    public void setDeptName(String deptName){
        this.deptName = deptName;
    }

    public void setYear(String year){
        this.year = year;
    }

    public void setId( Long id ) {
        this.id = id;
    }

    public String getDeptName() {
        return deptName;
    }

    public Long getId() {
        return id;
    }

    public String getYear() {
        return year;
    }

    public static class Builder {
        private Long id;
        private String deptName;
        private String year;


        public Builder id( Long id ) {
            this.id = id;
            return this;
        }

        public Builder deptName(String deptName){
            this.deptName = deptName;
            return this;
        }

        public Builder year(String year){
            this.year = year;
            return this;
        }

        public Dept build() {
            return new Dept( this );
        }
    }
}
