import { Component, OnInit } from '@angular/core';
import {YearService} from '../service/year.service';
import {ApiService} from '../service/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Committee} from '../models/committee';
import {AuthenticationService} from '../service/authentication.service';
import {CommitteeSummary} from '../models/committee-summary';
import {newArray} from '@angular/compiler/src/util';
import {forkJoin} from 'rxjs';
import {UserCommittees} from '../models/user-committees';
import {CommitteeUser} from '../models/committee-user';

@Component({
  selector: 'app-committees-list',
  templateUrl: './committees-list.component.html',
  styleUrls: ['./committees-list.component.css']
})
export class CommitteesListComponent implements OnInit {
  committees: CommitteeSummary[];
  constructor(public authentication: AuthenticationService, private yearService: YearService, private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getCommitteesYears().subscribe(
      years => {
        this.yearService.setYears(years);
        this.yearService.setValue(years[0]);
        this.yearService.getValue().subscribe(
          value => {
            this.apiService.getCommitteesByYear(value).subscribe(
              value1 => {
                this.committees = value1;
                const reqs2 = [];
                // tslint:disable-next-line:prefer-for-of
                this.committees.forEach(
                  value2 => {
                    reqs2.push( this.apiService.getCommitteeMember(value2.id));
                  }
                );
                forkJoin(reqs2).subscribe(
                  results => {
                    for (let i = 0; i < results.length; i++) {
                      this.committees[i].members = results[i] as CommitteeUser[];
                    }
                  }
                );
               // console.log(this.committees);
               //  this.committees.forEach(
               //    value2 => {
               //      this.apiService.getCommitteeMember(value2.id).subscribe(
               //        value3 => {
               //          value2.members = value3;
               //        }
               //      );
               //    }
               //  );
              }
            );
          }
        );
      }
    );
  }
}
