package uwl.senate.coc.projections;

import java.util.List;

import uwl.senate.coc.entities.Criteria;

public interface CommitteeSummary {
    public Long getId();
    public String getIntroduction();
    public String getName();
    public String getYear();
    public List<Criteria> getCriteria();
    public List<Duty> getDuties();
}