package com.example.capstone.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Role {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;
	private String role;

	public Role() {
	}
	
	public void setRole( String role ) {
		this.role = role;
	}
	
	public void setId( Long id ) {
		this.id = id;
	}
	
	public String getRole() {
		return this.role;
	}
	
	public Long getId() {
		return this.id;
	}
}
