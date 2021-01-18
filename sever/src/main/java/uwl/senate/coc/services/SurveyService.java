package uwl.senate.coc.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import uwl.senate.coc.entities.Committee;
import uwl.senate.coc.entities.Survey;
import uwl.senate.coc.entities.SurveyResponse;
import uwl.senate.coc.entities.User;
import uwl.senate.coc.projections.SurveySummary;
import uwl.senate.coc.repositories.SurveyRepository;
import uwl.senate.coc.repositories.SurveyResponseRepository;

@Service
public class SurveyService {
    @Autowired
    private SurveyRepository surveyRepo;
    
    @Autowired 
    private SurveyResponseRepository surveyResponseRepository;
    
    @Autowired
    private CommitteeService committeeService;
    
    public Survey create( User user ) {
    	List<Committee> committees = committeeService.getCommitteesByYear( user.getYear() );
	
		Survey survey = new Survey.Builder()
				.comment("")
				.userId( user.getId() )
				.year( user.getYear() )
				.build();
		
		surveyRepo.save( survey );
		
		List<SurveyResponse> responses = committees
				.stream()
				.map( c -> new SurveyResponse.Builder()
						.committee( c )
						.selected( false )
						.build() )
				.collect( Collectors.toList() );
		
		surveyResponseRepository.saveAll( responses );
//		survey.setResponses( responses );
//		surveyRepo.save( survey );
		
		return survey;
    }
    
    public SurveySummary getByUserId( Long uid ) {
    	return surveyRepo.findByUserId(uid, SurveySummary.class);    	
    }
    
    public List<SurveyResponse> getResponsesBySurveyId( Long sid ) {
    	return surveyResponseRepository.findBySurveyId(sid);
    }
    
    
}
