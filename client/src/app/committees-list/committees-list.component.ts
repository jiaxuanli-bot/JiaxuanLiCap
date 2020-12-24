import { Component, OnInit } from '@angular/core';
import {YearService} from '../service/year.service';
import {ApiService} from '../service/api.service';
import {AuthenticationService} from '../service/authentication.service';
import {CommitteeSummary} from '../models/committee-summary';
import {forkJoin} from 'rxjs';
import {CommitteeUser} from '../models/committee-user';
import {Committee} from '../models/committee';
import {Duty} from '../models/duty';
import {Criteria} from '../models/criteria';

@Component({
  selector: 'app-committees-list',
  templateUrl: './committees-list.component.html',
  styleUrls: ['./committees-list.component.css']
})
export class CommitteesListComponent implements OnInit {
  newCommittee: Committee = new Committee();
  committees: CommitteeSummary[] = [];
  modifyNewCommittee = {
    editName: false,
    editCriteria: false,
    editDuties: false,
    editIntroduction: false,
  };
  newIntr = '';
  Du  = '';
  newName = '';
  cri: '';
  constructor(public authentication: AuthenticationService, private yearService: YearService, private apiService: ApiService) {}

  ngOnInit(): void {
        this.yearService.getValue().subscribe(
          value => {
            this.apiService.getCommitteesByYear(value).subscribe(
              value1 => {
                this.committees = value1;
                const reqs2 = [];
                // tslint:disable-next-line:prefer-for-of
                if (this.committees !== undefined ) {
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
                }
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

  delete(committee: CommitteeSummary, i: number) {
    this.apiService.deleteCommittee(committee.id).subscribe();
    this.committees.splice(i, 1);
  }

  modifyIntr() {
    this.modifyNewCommittee.editIntroduction = !this.modifyNewCommittee.editIntroduction;
  }

  modifyDu() {
    this.modifyNewCommittee.editDuties = !this.modifyNewCommittee.editDuties;
  }

  modifyCri() {
    this.modifyNewCommittee.editCriteria = !this.modifyNewCommittee.editCriteria;
  }

  modifyName() {
    this.modifyNewCommittee.editName = !this.modifyNewCommittee.editName;
  }

  saveIntr() {
    this.modifyNewCommittee.editIntroduction = !this.modifyNewCommittee.editIntroduction;
    this.newCommittee.introduction = this.newIntr;
  }

  addCri() {
    this.modifyNewCommittee.editCriteria = !this.modifyNewCommittee.editCriteria;
    const d = new Criteria();
    if (this.newCommittee.criteria === undefined) {
      this.newCommittee.criteria = [];
    }
    d.criteria = this.cri;
    this.newCommittee.criteria.push(d);
    this.cri = '';
  }

  addDu() {
    this.modifyNewCommittee.editDuties = !this.modifyNewCommittee.editDuties;
    const d = new Duty();
    if (this.newCommittee.duties === undefined) {
      this.newCommittee.duties = [];
    }
    d.duty = this.Du;
    this.newCommittee.duties.push(d);
    this.Du = '';
  }

  saveName() {
    this.modifyNewCommittee.editName = !this.modifyNewCommittee.editName;
    this.newCommittee.name = this.newName;
  }
  saveAll() {
    this.newCommittee.year = this.yearService.getYearValue;
    this.apiService.createCommittee(this.newCommittee).subscribe();
  }
}
