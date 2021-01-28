import { Component, OnInit } from '@angular/core';
import {YearService} from '../service/year.service';
import {ApiService} from '../service/api.service';
import {AuthenticationService} from '../service/authentication.service';
import {CommitteeSummary} from '../models/committee-summary';
import {forkJoin} from 'rxjs';
import {CommitteeUser} from '../models/committee-user';
import {Criteria} from '../models/criteria';

import { faTimesCircle, faCheckCircle, faTrash} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-committees-list',
  templateUrl: './committees-list.component.html',
  styleUrls: ['./committees-list.component.css']
})
export class CommitteesListComponent implements OnInit {
  committees: CommitteeSummary[] = [];
  committeesCriteriaStatus: Criteria[][] = [];

  icons = {
    faTimesCircle : faTimesCircle,
    faCheckCircle : faCheckCircle,
    faTrash : faTrash
  }

  constructor(public authentication: AuthenticationService, private yearService: YearService, private apiService: ApiService) {}

  ngOnInit(): void {
    this.getCommitteeList();
  }

  getCommitteeList() {
    this.apiService.getYears().subscribe( years => {
      this.yearService.setYears( years );
    });

    this.yearService.getValue().subscribe(
      year => {
        if (year !== undefined && year !== '' && year !== null) {
          this.apiService.getCommitteesByYear(year).subscribe(
            committees => this.committees = committees
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
