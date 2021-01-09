import {Component, OnInit, SimpleChange} from '@angular/core';
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
            this.apiService.getSurveys(this.authenticationService.currentUserValue.id,
              this.authenticationService.currentUserValue.years[0]).subscribe(
              survey => {
                this.surveys = survey;
              }
            );
          }
        );
      }
    );
  }

  contains(committeeId: string): boolean {
    let res = false;
    this.surveys.forEach(
      value1 => {
        if (committeeId === value1.committeeId) {
          res = true;
        }
      }
    );
    return res;
  }

  popUp(committee) {
    this.introductionExpand = true;
    this.dutyExpand = true;
    this.critreriaExpand = true ;
    this.selectedCommittee = committee;
    console.log(this.selectedCommittee.criteria);
  }
  createSurvey(committeeId: string, userId: string) {
    this.apiService.createSurvey(userId, committeeId, this.yearService.getYearValue).subscribe();
  }
}
