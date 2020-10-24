
package com.example.capstone.entities;

import com.example.capstone.entities.userCommittee;
import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Calendar;
import java.util.List;
import java.util.Set;

@Entity
public class User {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;
	private String first;
	private String last;
	private Boolean adminResponsibility;
	@Column(name="user_rank") // I think MySQL has a "rank" keyword that clashes here.
	private String rank;
	private String college;
	private String email;
	private String gender;
	private String year;
	private Boolean tenured;

	private Boolean soe;

	@JsonIgnore
	@ManyToMany(fetch=FetchType.LAZY)
	@JoinTable(name = "committee_members",joinColumns = { @JoinColumn(name = "members_id")},inverseJoinColumns = {@JoinColumn(name = "committee_id")})
	private Set<Committee> committees;

	@JsonIgnore
	@ManyToMany(fetch=FetchType.LAZY)
	@JoinTable(name = "committee_volunteers",joinColumns = { @JoinColumn(name = "volunteers_id")},inverseJoinColumns = {@JoinColumn(name = "committee_id")})
	private List<Committee> volunteeredCommittees;

    @ManyToMany(fetch=FetchType.LAZY)
	private List<Role> roles;

	public User() {
	}

	private User( Builder b ) {
		this.id = b.id;
		this.first = b.first;
		this.last = b.last;
		this.rank = b.rank;
		this.email = b.email;
		this.gender = b.gender;
		this.year = b.year;
		this.tenured = b.tenured;
		this.committees = b.committees;
		this.roles = b.roles;
		this.college = b.college;
		this.soe = b.soe;
	    this.volunteeredCommittees = b.volunteeredCommittees;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFirst() {
		return first;
	}

	public Boolean getAdminResponsibility() {
		return adminResponsibility;
	}

	public void setAdminResponsibility(Boolean adminResponsibility) {
		this.adminResponsibility = adminResponsibility;
	}

	public void setFirst(String first) {
		this.first = first;
	}

	public String getLast() {
		return last;
	}

	public void setLast(String last) {
		this.last = last;
	}

	public List<Committee> getVolunteeredCommittees() {
		return volunteeredCommittees;
	}

	public void setVolunteeredCommittees(List<Committee> volunteeredComiittees) {
		this.volunteeredCommittees = volunteeredComiittees;
	}

	public String getRank() {
		return rank;
	}

	public void setRank(String rank) {
		this.rank = rank;
	}

	public String getCollege() {
		return college;
	}

	public void setCollege(String college) {
		this.college = college;
	}

	public Boolean getTenured() {
		return tenured;
	}

	public void setTenured(Boolean tenured) {
		this.tenured = tenured;
	}

	public Boolean getSoe() {
		return soe;
	}

	public void setSoe(Boolean soe) {
		this.soe = soe;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public void setCommittees(Set<Committee> committees) {
		this.committees = committees;
	}

	public Set<Committee> getCommittees() {
		return committees;
	}

	public void setRoles(List<Role> roles) {
		this.roles = roles;
	}

	public List<Role> getRoles() {
		return roles;
	}

	public void setEmail(String email){
		this.email = email;
	}

	public String getEmail() {
		return email;
	}

	public void removeCommittee(Committee a){
		this.committees.remove(a);
		a.getMembers().remove(this);
	}

	public void setYear(String year) {
		if( year == null ) {
			year = String.valueOf( Calendar.getInstance().get( Calendar.YEAR ) );
		}
		
		this.year = year;
	}

	public boolean equals(Object obj) {
		if (!(obj instanceof User))
			return false;
		if (obj == this)
	 	return true;
	 return this.id == ((User) obj).id;
	}

	public int hashCode() {
	   return id.intValue();
	}

	public String getYear() {
		return year;
	}
	
	public static class Builder {
		private Long id;
		private String first;
		private String last;
		private String rank;
		private String college;
		private String email;
		private String gender;
		private String year;
		private Boolean tenured;
		private Boolean soe;
		private Set<Committee> committees;
		private List<Committee> volunteeredCommittees;
		private List<Role> roles;
		private Boolean adminResponsibility;

		public Builder id( Long id ) {
			this.id = id;
			return this;
		}

		public Builder volunteeredCommittees(List<Committee> committees){
			this.volunteeredCommittees = committees;
			return this;
		}


		public Builder first( String first ) {
			this.first = first;
			return this;
		}
		
		public Builder last( String last ) {
			this.last = last;
			return this;
		}
		
		public Builder rank( String rank ) {
			this.rank = rank;
			return this;
		}
		
		public Builder college( String college ) {
			this.college = college;
			return this;
		}
		
		public Builder email( String email ) {
			this.email = email;
			return this;
		}
		
		public Builder gender( String gender ) {
			this.gender = gender;
			return this;
		}
		
		public Builder year( String year ) {
			this.year = year;
			return this;
		}
		
		public Builder tenured( Boolean tenured ) {
			this.tenured = tenured;
			return this;
		}
		
		public Builder soe( Boolean soe ) {
			this.soe = soe;
			return this;
		}
		
		public Builder committees( Set<Committee> committees ) {
			this.committees = committees;
			return this;
		}
		
		public Builder roles( List<Role> roles ) {
			this.roles = roles;
			return this;
		}

		public Builder adminResponsibility(Boolean adminResponsibility){
			this.adminResponsibility = adminResponsibility;
			return this;
		}


		public User build() {
			return new User( this );
		}

	}
}