import { Component, OnInit } from '@angular/core';
import {ApiService} from '../service/api.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../service/authentication.service';
import {User} from '../models/user';
import {YearService} from '../service/year.service';

import { faUser, faUsers, faQuestionCircle, faCog, faChartPie, faPlusSquare } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-slide-bar',
  templateUrl: './slide-bar.component.html',
  styleUrls: ['./slide-bar.component.css']
})
export class SlideBarComponent implements OnInit {
  pages = {
    home: true,
    faculty: false,
    survey: false,
    committees: false,
    report:  false,
    settings: false
  }

  icons = {
    faUser : faUser,
    faUsers : faUsers,
    faQuestionCircle : faQuestionCircle,
    faCog : faCog,
    faChartPie : faChartPie,
    faPlusSquare : faPlusSquare
  }

  yearsForm: FormGroup;
  selectedYear: string;
  user: User;

  newYear: number;
  years: any;

  constructor(
    public yearService: YearService,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.user = this.authenticationService.currentUserValue;

    this.yearService.getValue().subscribe(
      value => {
        this.selectedYear = value;
      }
    );

    this.yearsForm = this.formBuilder.group({
      year: []
    });

    this.yearService.getYears.subscribe(
      years => {
        this.years = years;
      }
    );
  }

  hasRole(role: string): boolean {
    return this.authenticationService.hasRole(role);
  }

  changeYear() {
    this.yearService.setValue(this.selectedYear);
  }

  goTo( page: string ): void {
    this.clear();
    this.pages[page] = true;
    this.router.navigate(['/uwl', page ], { fragment: this.selectedYear } );
  }

  clear() {
    Object.keys( this.pages ).forEach( pg => this.pages[pg] = false );
  }

  createYear() {
    this.apiService.createYear(this.newYear.toString()).subscribe(
      value => {
        location.reload();
      }
    );
  }
}
