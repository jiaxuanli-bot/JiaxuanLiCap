import {Component, Input, OnChanges, OnInit, SimpleChange} from '@angular/core';
import {ApiService} from '../service/api.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {Committee} from '../models/committee';
import {AuthenticationService} from '../service/authentication.service';
import {User} from '../models/user';
import {Survey} from '../models/survey';
import {YearService} from '../service/year.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  introductionExpand: number;
  dutyExpand: number;
  critreriaExpand: number;
  yearsForm: FormGroup;
  selectedCommittee: Committee;
  committees: Committee[] = [];
  surveys: Survey[] = [];
  surveyRecord: number[] = [];
  selectedYear: string;
  user: User;

  constructor(public authentication: AuthenticationService, private yearService: YearService, private apiService: ApiService, private formBuilder: FormBuilder, private router: Router, private authenticationService: AuthenticationService) {}
  ngOnInit(): void {
    this.introductionExpand = 1;
    this.dutyExpand = 1;
    this.critreriaExpand = 1 ;
    this.user = this.authenticationService.currentUserValue;
    this.yearsForm =  this.formBuilder.group({
      year: []
    });
    // this.yearService.setYears([new Date().getFullYear().toString()]);
    this.apiService.getUserYears(this.authentication.currentUserValue.email).subscribe(
      value => {
        this.yearService.setYears(value);
        console.log(value);
        this.yearService.setValue(value[0]);
        this.yearService.getValue().subscribe( value1 => {
          this.selectedYear = value1;
          this.apiService.getCommitteesByYear(value1).subscribe(
            res => {
              this.committees = res;
              this.apiService.getSurveys(this.authenticationService.currentUserValue.id).subscribe(
                survey => {
                  console.log(survey);
                  this.surveys = survey;
                  this.surveyRecord = [];
                  let checked;
                  for (let j = 0; j < this.committees.length; j++) {
                    checked = 0;
                    for (let k = 0; k < survey.length; k++) {
                      if (this.committees[j].id == survey[k].committeeId) {
                        checked = 1;
                      }
                    }
                    this.surveyRecord.push(checked);
                  }
                }
              );
            }
          );
        });
      }
    )
  }
  popUp(committee) {
    this.introductionExpand = 1;
    this.dutyExpand = 1;
    this.critreriaExpand = 1 ;
    this.selectedCommittee = committee;
    console.log(this.selectedCommittee.criterias);
  }

  createSurvey(committeeId) {
    this.apiService.createSurvey(this.authenticationService.currentUserValue.id, committeeId).subscribe(
      res => {
      }
    );
  }

  expandCriteria() {
    this.critreriaExpand = 1 - this.critreriaExpand;
  }

  expandDuty() {
    this.dutyExpand = 1 - this.dutyExpand;
  }

  expandIntroduction() {
    this.introductionExpand = 1 - this.introductionExpand;
  }
}
