package uwl.senate.coc.entities;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.lang.NonNull;

import java.util.List;


@Entity
public class Department {

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Long id;

    @NonNull
    private String name;
    @NonNull
    private String year;

    @JsonIgnore
    @OneToMany(cascade=CascadeType.PERSIST, orphanRemoval=true)
    @JoinTable(name = "user_dept",
            joinColumns =
                    { @JoinColumn(name = "dept_id", referencedColumnName = "id") },
            inverseJoinColumns =
                    { @JoinColumn(name = "user_id", referencedColumnName = "id")})
    private List<User> users;

	@ManyToOne(cascade = CascadeType.ALL)
	@JoinTable(name = "dept_college",
			joinColumns =
					{ @JoinColumn(name = "dept_id", referencedColumnName = "id") },
			inverseJoinColumns =
				   { @JoinColumn(name = "college_id", referencedColumnName = "id") })
	private College college;

    public Department() {
    }

    private Department( Builder b ) {
        this.id = b.id;
        this.name = b.name;
        this.year = b.year;
        this.college = b.college;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setYear(String year){
        this.year = year;
    }

    public void setId( Long id ) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Long getId() {
        return id;
    }

    public String getYear() {
        return year;
    }
    
    public void setCollege( College college ) {
    	this.college = college;    	
    }
    
    public College getCollege( ) {
    	return this.college;
    }

    public static class Builder {
        private Long id;
        private String name;
        private String year;
        private College college;

        public Builder id( Long id ) {
            this.id = id;
            return this;
        }
        
        public Builder college( College college ) {
        	this.college = college;
        	return this;
        }

        public Builder name(String name){
            this.name = name;
            return this;
        }

        public Builder year(String year){
            this.year = year;
            return this;
        }

        public Department build() {
            return new Department( this );
        }
    }
}
