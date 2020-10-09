import { Component, OnInit } from '@angular/core';
import {ApiService} from '../service/api.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../service/authentication.service';
import {Committee} from '../models/committee';
import {Survey} from '../models/survey';
import {User} from '../models/user';
import {YearService} from '../service/year.service';

@Component({
  selector: 'app-slide-bar',
  templateUrl: './slide-bar.component.html',
  styleUrls: ['./slide-bar.component.css']
})
export class SlideBarComponent implements OnInit {
  public homeNavbar = 1 ;
  public facultyNavbar = 0;
  public surveyNavbar = 0;
  public committeesNavbar = 0;
  public reportNavbar =  0;

  constructor(private yearService: YearService, private apiService: ApiService, private formBuilder: FormBuilder, private router: Router, private authenticationService: AuthenticationService) { }
  yearsForm: FormGroup;
  committees: Committee[] = [];
  years: string[] = [];
  selectedYear: string;
  user: User;
  isAdmin;
  isNominate;
  isNormal;
  ngOnInit(): void {
    this.user = this.authenticationService.currentUserValue;
    this.yearService.getYears().subscribe(
      value => {
        this.years = value;
      }
    );
    this.yearService.getValue().subscribe(
      value => {
        this.selectedYear = value;
      }
    )
    console.log(this.user.role[1])
    for (let i = 0; i < this.user.role.length; i++ ) {
      if (this.user.role[i] === 'Normal') {
        this.isNormal = 1;
      }
      if (this.user.role[i] === 'Admin') {
        this.isAdmin = 1;
      }
      if (this.user.role[i] === 'Nominate') {
        this.isNominate = 1;
      }
      if ( this.isAdmin === 1) {
        this.facultyNavbar = 1;
      } else if ( this.isNominate) {
        this.committeesNavbar = 1;
      } else {
        this.surveyNavbar = 1;
        this.router.navigate(['/survey']);
      }
    }
    this.yearsForm =  this.formBuilder.group({
      year: []
    });
  }

  changeYear() {
    this.yearService.setValue(this.selectedYear);
    this.yearService.setCYearValue(this.selectedYear);
  }

  routerToHome() {
    this.homeNavbar = 1;
    this.surveyNavbar = 0;
    this.facultyNavbar = 0;
    this.committeesNavbar = 0;
    this.reportNavbar = 0;
    this.router.navigate(['/survey']);
  }

  routerToFaculty() {
    this.facultyNavbar = 1;
    this.surveyNavbar = 0;
    this.homeNavbar = 0 ;
    this.committeesNavbar = 0;
    this.reportNavbar = 0;
    this.router.navigate(['/faculty']);
  }

  routerToSurvey() {
    this.surveyNavbar = 1;
    this.homeNavbar = 0 ;
    this.facultyNavbar = 0;
    this.committeesNavbar = 0;
    this.reportNavbar = 0;
    this.router.navigate(['/survey']);
  }

  routerCommittees() {
    this.committeesNavbar = 1;
    this.reportNavbar = 0;
    this.surveyNavbar = 0;
    this.homeNavbar = 0 ;
    this.facultyNavbar = 0;
    this.router.navigate(['/committees']);
  }

  routerToReport() {
    this.reportNavbar = 1;
    this.surveyNavbar = 0;
    this.homeNavbar = 0 ;
    this.facultyNavbar = 0;
    this.committeesNavbar = 0;
    this.router.navigate(['/report']);
  }
}
