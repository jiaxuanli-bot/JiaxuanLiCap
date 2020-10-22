package com.example.capstone.entitiesNew;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

@Entity
public class Criteria {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;
	private String criteria;

	@ManyToOne
	@JsonIgnore
	private Committee committee;

	private Criteria( Builder b ) {
		this.id = b.id;
		this.criteria = b.criteria;
		this.committee = b.committee;
	}
	
	public Criteria() {		
	}
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	public Committee getCommittee() {
		return this.committee;
	}
	
	public void setCommmittee( Committee committee ) {
		this.committee = committee;
	}

	public String getCriteria() {
		return criteria;
	}

	public void setCriteria(String criteria) {
		this.criteria = criteria;
	}
	
	public static class Builder {
		private Long id;
		private String criteria;
		private Committee committee;
		
		public Builder id( Long id ) {
			this.id = id;
			return this;
		}
		
		public Builder criteria( String criteria ) {
			this.criteria = criteria;
			return this;
		}
		
		public Builder committee( Committee committee ) {
			this.committee = committee;
			return this;
		}

		public Criteria build( ) {
			return new Criteria( this );
		}
		
	}
}
