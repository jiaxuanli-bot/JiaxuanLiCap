import { Component, OnInit } from '@angular/core';
import {YearService} from '../service/year.service';
import {ApiService} from '../service/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Committee} from '../models/committee';
import {AuthenticationService} from '../service/authentication.service';
import {CommitteeSummary} from '../models/committee-summary';

@Component({
  selector: 'app-committees-list',
  templateUrl: './committees-list.component.html',
  styleUrls: ['./committees-list.component.css']
})
export class CommitteesListComponent implements OnInit {
  committees: CommitteeSummary[];
  constructor(public authentication: AuthenticationService, private yearService: YearService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.yearService.setPos('list');
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
                this.committees.forEach(
                  value2 => {
                    this.apiService.getCommitteeMember(value2.id).subscribe(
                      value3 => {
                        value2.members = value3;
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  }
}
