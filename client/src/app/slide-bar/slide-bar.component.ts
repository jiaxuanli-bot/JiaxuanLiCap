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
  sideBar = {
    homeNavbar: true,
    facultyNavbar: false,
    surveyNavbar: false,
    committeesNavbar: false,
    reportNavbar:  false,
  }

  constructor(private yearService: YearService, private apiService: ApiService, private formBuilder: FormBuilder,
              private router: Router, private authenticationService: AuthenticationService) { }
  yearsForm: FormGroup;
  committees: Committee[] = [];
  years: string[] = [];
  selectedYear: string;
  user: User;
  roles = {
    isAdmin: false,
    isNominate: false,
    isNormal: false
  }
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
    );
    console.log(this.user.roles[1]);
    if ( this.authenticationService.hasRole('Normal')) {
        this.roles.isNormal = true;
    }
    if ( this.authenticationService.hasRole( 'Admin')) {
        this.roles.isAdmin = true;
    }
    if (this.authenticationService.hasRole('Nominate')) {
        this.roles.isNominate = true;
    }
    if (this.roles.isAdmin) {
        this.routerToFaculty();
    } else if ( this.roles.isNominate) {
        this.routerCommittees();
    } else {
      this.routerToSurvey();
    }
    this.yearsForm =  this.formBuilder.group({
      year: []
    });
  }

  changeYear() {
    this.yearService.setValue(this.selectedYear);
  }

  routerToFaculty() {
    this.clearBar();
    this.sideBar.facultyNavbar = true;
    this.router.navigate(['/faculty']);
  }

  routerToSurvey() {
    this.clearBar();
    this.sideBar.surveyNavbar = true;
    this.router.navigate(['/survey']);
  }

  routerCommittees() {
    this.clearBar();
    this.sideBar.committeesNavbar = true;
    this.router.navigate(['/committees']);
  }

  routerToReport() {
    this.clearBar();
    this.sideBar.reportNavbar = true;
    this.router.navigate(['/report']);
  }
  clearBar() {
    this.sideBar.reportNavbar = false;
    this.sideBar.surveyNavbar = false;
    this.sideBar.homeNavbar = false;
    this.sideBar.facultyNavbar = false;
    this.sideBar.committeesNavbar = false;
  }
}
