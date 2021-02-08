package uwl.senate.coc.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.List;

@Entity
public class Gender {

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;
    private String name;
    private String year;

    @JsonIgnore
    @OneToMany(cascade=CascadeType.PERSIST, orphanRemoval=true)
    @JoinTable(name = "user_gender",
            joinColumns =
                    { @JoinColumn(name = "gender_id", referencedColumnName = "id") },
            inverseJoinColumns =
                    { @JoinColumn(name = "user_id", referencedColumnName = "id") })
    private List<User> users;

    public Gender() {
    }

    private Gender( Builder b ) {
        this.id = b.id;
        this.name = b.name;
        this.year = b.year;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
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
        private String name;
        private String year;

        public Builder id( Long id ) {
            this.id = id;
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

        public Gender build() {
            return new Gender( this );
        }
    }
}


