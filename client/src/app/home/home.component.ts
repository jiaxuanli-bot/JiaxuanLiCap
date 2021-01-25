import {Component, OnInit} from '@angular/core';
import {ApiService} from '../service/api.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {Committee} from '../models/committee';
import {CommitteeSummary} from '../models/committee-summary';
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
  committees: CommitteeSummary[] = [];
  survey: Survey;
  user: User;

  constructor(public authentication: AuthenticationService, private yearService: YearService,
              private apiService: ApiService, private formBuilder: FormBuilder, private router: Router,
              private authenticationService: AuthenticationService) {}
  ngOnInit(): void {
    this.user = this.authenticationService.currentUserValue;
    this.yearsForm =  this.formBuilder.group({
      year: []
    });
    this.yearService.getValue().subscribe(
      value => {
        this.apiService.getCommitteesByYear(this.authenticationService.currentUserValue.years[0]).subscribe(
          res => {
            this.committees = res;
            this.apiService.getSurvey(this.authenticationService.currentUserValue.id,
              this.authenticationService.currentUserValue.years[0]).subscribe(
              survey => {
                this.survey = survey;
              }
            );
          }
        );
      }
    );
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
