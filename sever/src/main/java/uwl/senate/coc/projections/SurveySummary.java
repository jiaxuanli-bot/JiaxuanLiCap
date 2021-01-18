package uwl.senate.coc.projections;

import java.util.List;

public interface SurveySummary {
	public Long getId();
	public List<SurveyResponseSummary> getResponses();
}
