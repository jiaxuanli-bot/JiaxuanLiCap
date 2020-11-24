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
  introductionExpand = true;
  dutyExpand = true;
  critreriaExpand = true;
  yearsForm: FormGroup;
  selectedCommittee: Committee;
  committees: Committee[] = [];
  surveys: Survey[] = [];
  surveyRecord: boolean[] = [];
  selectedYear: string;
  user: User;

  constructor(public authentication: AuthenticationService, private yearService: YearService,
              private apiService: ApiService, private formBuilder: FormBuilder, private router: Router,
              private authenticationService: AuthenticationService) {}
  ngOnInit(): void {
    this.user = this.authenticationService.currentUserValue;
    this.yearsForm =  this.formBuilder.group({
      year: []
    });
    // this.yearService.setYears([new Date().getFullYear().toString()]);
    this.apiService.getUserYears(this.authentication.currentUserValue.email).subscribe(
      value => {
        this.yearService.setYears(value);
        this.yearService.setValue(value[0]);
        this.yearService.getValue().subscribe( value1 => {
          this.selectedYear = value1;
          this.apiService.getCommitteesByYear(value1).subscribe(
            res => {
              this.committees = res;
              this.apiService.getSurveys(this.authenticationService.currentUserValue.id, this.yearService.getYearValue).subscribe(
                survey => {
                  console.log(survey);
                  this.surveys = survey;
                  this.surveyRecord = [];
                  let checked;
                  this.committees.forEach(
                    value2 => {
                      checked = false;
                      survey.forEach(
                        value3 => {
                          if (value2.id === value3.committeeId) {
                            checked = true;
                          }
                        }
                      );
                      this.surveyRecord.push(checked);
                    }
                  );
                  // for (let j = 0; j < this.committees.length; j++) {
                  //   checked = false;
                  //   for (let k = 0; k < survey.length; k++) {
                  //     if (this.committees[j].id === survey[k].committeeId) {
                  //       checked = true;
                  //     }
                  //   }
                  //   this.surveyRecord.push(checked);
                  // }
                }
              );
            }
          );
        });
      }
    );
  }
  popUp(committee) {
    this.introductionExpand = true;
    this.dutyExpand = true;
    this.critreriaExpand = true ;
    this.selectedCommittee = committee;
    console.log(this.selectedCommittee.criteria);
  }
  expandCriteria() {
    this.critreriaExpand = !this.critreriaExpand;
  }

  expandDuty() {
    this.dutyExpand = !this.dutyExpand;
  }

  expandIntroduction() {
    this.introductionExpand = !this.introductionExpand;
  }
}
