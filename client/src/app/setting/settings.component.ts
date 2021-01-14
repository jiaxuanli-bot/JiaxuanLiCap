import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../service/authentication.service';
import {YearService} from '../service/year.service';
import {ApiService} from '../service/api.service';
import {Router} from '@angular/router';
import {CommitteeSummary} from '../models/committee-summary';
import {Gender} from '../models/gender';
import {College} from '../models/college';
import {Dept} from '../models/dept';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  genders: Gender[] = [];
  colleges: College[] = [];
  depts: Dept[] = [];
  constructor(public authentication: AuthenticationService, private yearService: YearService, private apiService: ApiService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.apiService.getGendersByYear(this.yearService.getYearValue).subscribe(
      genders => {
        this.genders = genders;
      }
    );
    this.apiService.getCollegeByYear(this.yearService.getYearValue).subscribe(
      colleges => {
        this.colleges = colleges;
      }
    );
    this.apiService.getDeptByYear(this.yearService.getYearValue).subscribe(
      depts => {
        this.depts = depts;
      }
    );
    this.yearService.getValue().subscribe(
      year => {
        this.apiService.getGendersByYear(year).subscribe(
          genders => {
            this.genders = genders;
          }
        );
        this.apiService.getCollegeByYear(year).subscribe(
          colleges => {
            this.colleges = colleges;
          }
        );
        this.apiService.getDeptByYear(year).subscribe(
          depts => {
            this.depts = depts;
          }
        );
      }
    );
  }

}
