import { Component, OnInit } from '@angular/core';
import {YearService} from '../service/year.service';
import {ApiService} from '../service/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Committee} from '../models/committee';
import {AuthenticationService} from '../service/authentication.service';

@Component({
  selector: 'app-committees-list',
  templateUrl: './committees-list.component.html',
  styleUrls: ['./committees-list.component.css']
})
export class CommitteesListComponent implements OnInit {
  committees: Committee[];
  constructor(public authentication: AuthenticationService, private yearService: YearService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.apiService.getCommitteesYears().subscribe(
      years => {
        years.sort();
        this.yearService.setYears(years)
        this.yearService.setValue(years[0]);
        this.yearService.getValue().subscribe(
          value => {
            this.apiService.getCommitteesByYear(value).subscribe(
              value1 => {
                this.committees = value1;
              }
            );
          }
        );
      }
    );
  }
}
