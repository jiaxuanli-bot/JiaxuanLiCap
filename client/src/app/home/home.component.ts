import {Component, OnInit} from '@angular/core';
import {ApiService} from '../service/api.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Committee} from '../models/committee';
import {AuthenticationService} from '../service/authentication.service';
import {User} from '../models/user';
import {Survey} from '../models/survey';
import {YearService} from '../service/year.service';
import {SurveyResponse} from '../models/survey-response';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  introductionExpand = true;
  dutyExpand = true;
  critreriaExpand = true;
  yearsForm: FormGroup;
  selectedCommittee: Committee;
  
  survey: Survey;
  user: User;

  constructor(
    public authentication: AuthenticationService, 
    private apiService: ApiService, 
    private formBuilder: FormBuilder, 
    private yearService : YearService,
    private authenticationService: AuthenticationService) {
    }

  ngOnInit(): void {
    this.apiService.getUserYears(this.authentication.currentUserValue.email).subscribe( years => {
      this.yearService.setYears( years );
    });

    this.user = this.authenticationService.currentUserValue;
    this.yearService.setValue( this.authenticationService.currentUserValue.year );    
    this.yearsForm =  this.formBuilder.group({ year: [] });

    this.apiService.getSurvey( this.authenticationService.currentUserValue.id).subscribe(
      survey => {
        survey.responses.sort( (r1, r2) => {
          let c1 = r1.committee;
          let c2 = r2.committee;
          return c1.name.localeCompare( c2.name );
        });
        this.survey = survey;
    });
  }

  popUp(committee) {
    this.introductionExpand = true;
    this.dutyExpand = true;
    this.critreriaExpand = true ;
    this.selectedCommittee = committee;
  }

  createSurvey(surveyResponse: SurveyResponse) {
    const copyObj = new SurveyResponse();
    copyObj.id = surveyResponse.id;
    copyObj.selected = !surveyResponse.selected;
    copyObj.committee = surveyResponse.committee;
    surveyResponse.selected = !surveyResponse.selected;
    this.apiService.modifySurvey(this.authenticationService.currentUserValue.id, surveyResponse.id, copyObj).subscribe(
      res => {
        surveyResponse = res;
      }
    );
  }
}
