package uwl.senate.coc.projections;

import java.util.List;

public interface SurveySummary {
	public Long getId();
	public String getComment();
	public List<SurveyResponseSummary> getResponses();
}
