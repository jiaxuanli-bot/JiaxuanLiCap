import { Component, OnInit } from '@angular/core';
import {ApiService} from '../service/api.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../service/authentication.service';
import {Committee} from '../models/committee';
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

  constructor(public yearService: YearService, private apiService: ApiService, private formBuilder: FormBuilder,
              private router: Router, private authenticationService: AuthenticationService) { }
  yearsForm: FormGroup;
  committees: Committee[] = [];
  selectedYear: string;
  user: User;
  roles = {
    isAdmin: false,
    isNominate: false,
    isNormal: false
  };
  newYear: number;
  years: any;
  ngOnInit(): void {
    this.user = this.authenticationService.currentUserValue;
    this.yearService.getValue().subscribe(
      value => {
        this.selectedYear = value;
      }
    );
    if ( this.authenticationService.hasRole('Normal')) {
        this.roles.isNormal = true;
    }
    if ( this.authenticationService.hasRole( 'Admin')) {
        this.roles.isAdmin = true;
    }
    if (this.authenticationService.hasRole('Nominate')) {
        this.roles.isNominate = true;
    }
    this.yearsForm = this.formBuilder.group({
      year: []
    });
    this.yearService.getYears.subscribe(
      value => {
        this.years = value;
      }
    );
  }

  hasRole(role: string): boolean {
    return this.authenticationService.hasRole(role);
  }
  changeYear() {
    this.yearService.setValue(this.selectedYear);
    window.location.hash = this.selectedYear;
  }

  routerToFaculty() {
    this.clearBar();
    this.sideBar.facultyNavbar = true;
    this.router.navigate(['/uwl/faculty'], { fragment: this.selectedYear });
  }

  routerToSurvey() {
    this.clearBar();
    this.sideBar.surveyNavbar = true;
    this.router.navigate(['/uwl/survey'], { fragment: this.selectedYear });
  }

  routerCommittees() {
    this.clearBar();
    this.sideBar.committeesNavbar = true;
    this.router.navigate(['/uwl/committees'], { fragment: this.selectedYear });
  }

  routerToReport() {
    this.clearBar();
    this.sideBar.reportNavbar = true;
    this.router.navigate(['/uwl/report'], { fragment: this.selectedYear });
  }
  clearBar() {
    this.sideBar.reportNavbar = false;
    this.sideBar.surveyNavbar = false;
    this.sideBar.homeNavbar = false;
    this.sideBar.facultyNavbar = false;
    this.sideBar.committeesNavbar = false;
  }

  crateYear() {
    this.apiService.createYear(this.newYear.toString()).subscribe(
      value => {
        location.reload();
      }
    );
  }
}
