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
import {forkJoin} from 'rxjs';
import {ApplicationComment} from '../models/application-comment';


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
  surveys: Survey[] = [];
  surveysCommittee = new Set();
  comments = {};
  user: User;
  editIndex = -1;
  commentText: string;

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
              surveys => {
                this.surveys = surveys;
                surveys.forEach(
                  survey => {
                    this.surveysCommittee.add(survey.committeeId);
                  }
                );
              }
            );
            const reqs = [];
            this.committees.forEach(
              committee => {
                reqs.push(this.apiService.getComment(this.authenticationService.currentUserValue.id, committee.id));
              });
            forkJoin(reqs).subscribe(
              Objects => {
                const comments =  Objects as ApplicationComment[];
                comments.forEach(
                  comment => {
                    console.log(comment);
                    if (comment) {
                      this.comments[comment.committeeId] = comment.comment;
                    }
                  }
                );
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
    console.log(this.selectedCommittee.criteria);
  }
  createSurvey(committeeId: string, userId: string) {
    this.apiService.createSurvey(userId, committeeId, this.yearService.getYearValue).subscribe(
      survey => {
        if (this.surveysCommittee.has(committeeId)) {
          this.surveysCommittee.delete(committeeId);
        } else {
          this.surveysCommittee.add(committeeId);
        }
      }
    );
  }

  saveText(userId: string, committeeId: string) {
    this.editIndex = -1;
    this.apiService.createComment(this.commentText, userId, committeeId).subscribe(
      comment => {
        this.comments[committeeId] = this.commentText;
        this.commentText = '';
      }
    );
  }

  editComment(i: number) {
    this.commentText = '';
    this.editIndex = i;
  }

  cancelEdit() {
    this.commentText = '';
    this.editIndex = -1;
  }
}
