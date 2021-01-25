import { Component, OnInit } from '@angular/core';
import {YearService} from '../service/year.service';
import {ApiService} from '../service/api.service';
import {AuthenticationService} from '../service/authentication.service';
import {CommitteeSummary} from '../models/committee-summary';
import {forkJoin} from 'rxjs';
import {CommitteeUser} from '../models/committee-user';
import {Criteria} from '../models/criteria';

@Component({
  selector: 'app-committees-list',
  templateUrl: './committees-list.component.html',
  styleUrls: ['./committees-list.component.css']
})
export class CommitteesListComponent implements OnInit {
  committees: CommitteeSummary[] = [];
  committeesCriteriaStatus: Criteria[][] = [];
  constructor(public authentication: AuthenticationService, private yearService: YearService, private apiService: ApiService) {}

  ngOnInit(): void {
    this.getCommitteeList();
  }

  getCommitteeList() {
    this.yearService.getValue().subscribe(
      value => {
        if (value !== undefined && value !== '' && value !== null) {
          this.apiService.getCommitteesByYear(value).subscribe(
            value1 => {
              this.committees = value1;
              const reqs2 = [];
              const reqs3 = [];
              const reqs4 = [];
              this.committees.forEach(
                value2 => {
                  reqs2.push( this.apiService.getCommitteeMember(value2.id));
                  reqs3.push( this.apiService.getUnSatisfiedCriteria(value2.id));
                  reqs4.push( this.apiService.getCommitteeVolunteers(value2.id));
                }
              );
              forkJoin(reqs2).subscribe(
                results => {
                  for (let i = 0; i < results.length; i++) {
                    this.committees[i].members = results[i] as CommitteeUser[];
                  }
                }
              );
              forkJoin(reqs3).subscribe(
                results => {
                  results.forEach(
                    criteria => {
                      this.committeesCriteriaStatus.push(criteria as Criteria[]);
                    }
                  );
                }
              );
              forkJoin(reqs4).subscribe(
                results => {
                  for (let i = 0; i < results.length; i++) {
                    this.committees[i].volunteers = results[i] as CommitteeUser[];
                  }
                }
              );
            }
          );
        }
      }
    );
  }
  delete(committee: CommitteeSummary, i: number) {
    this.apiService.deleteCommittee(committee.id).subscribe();
    this.committees.splice(i, 1);
  }
}
