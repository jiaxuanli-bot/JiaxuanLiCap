import {AfterViewInit, Component, OnInit} from '@angular/core';
import {YearService} from '../service/year.service';
import {ApiService} from '../service/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Committee} from '../models/committee';
import {of} from 'rxjs';
import {UserCommittees} from '../models/user-committees';
import {newArray} from '@angular/compiler/src/util';
import {User} from '../models/user';
import {CommitteeUser} from '../models/committee-user';
import {AuthenticationService} from '../service/authentication.service';

@Component({
  selector: 'app-committees-details',
  templateUrl: './committees-details.component.html',
  styleUrls: ['./committees-details.component.css']
})
export class CommitteesDetailsComponent implements OnInit{
  seletedUserid: string;
  introductionExpand = 0;
  committee: Committee;
  dutyExpand = 0;
  critreriaExpand = 0;
  usersCommittees: UserCommittees[][];
  volunteers: User[];
  volunteersCommittees: UserCommittees[][];
  popIntroductionExpand = 0;
  popDutyExpand = 0;
  popCritreriaExpand  = 0;
  constructor(public authentication: AuthenticationService, private yearService: YearService, private apiService: ApiService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      param => {
        this.apiService.getCommitteeYears(param.id).subscribe(
          years => {
            years.sort();
            this.yearService.setYears(years);
            this.apiService.getCommitteeById(param.id).subscribe(
              value => {
                this.yearService.setValue(value.year)
                this.committee = value;
                for (let i = 0; i < value.members.length; i++) {
                  this.usersCommittees = newArray(value.members.length);
                  this.apiService.getUserAssignedCommittees(value.members[i].id, this.yearService.currentYear).subscribe(
                    value2 => {
                      this.usersCommittees[i] = value2;
                    }
                  );
                }
                this.yearService.getValue().subscribe(
                  value5 => {
                    if (this.committee !== undefined) {
                      this.apiService.getCommitteeIdByYearAndName(value5, this.committee.name.toString()).subscribe(
                        value1 => {
                          this.router.navigate(['/committees/' + value1.toString()]);
                        }
                      );
                    }
                  }
                );
                console.log(this.usersCommittees);
              }
            );
            this.apiService.getCommitteeVolunteers(param.id).subscribe(
              value => {
                this.volunteers = value;
                for (let i = 0; i < value.length; i++) {
                  this.volunteersCommittees = newArray(value.length);
                  this.apiService.getUserAssignedCommittees(value[i].id, this.yearService.currentYear).subscribe(
                    value2 => {
                      this.volunteersCommittees[i] = value2;
                    }
                  );
                }
                console.log(this.volunteersCommittees);
              }
            );
          }
          );
      }
    );
  }

  expandIntroduction() {
    this.introductionExpand = 1 - this.introductionExpand;
  }

  expandCriteria() {
    this.critreriaExpand = 1 - this.critreriaExpand;
  }

  expandDuties() {
    this.dutyExpand = 1 - this.dutyExpand;
  }

  removeMember() {
    this.apiService.removeUserFromCommittee(this.committee.id, this.seletedUserid).subscribe(
      value => {
        for (let i = 0; i < this.committee.members.length; i++) {
          if (this.committee.members[i].id === this.seletedUserid) {
            let temp = new User();
            temp.id = this.committee.members[i].id;
            temp.first = this.committee.members[i].first;
            temp.gender = this.committee.members[i].gender;
            temp.soe = this.committee.members[i].soe;
            temp.adminResponsibility = this.committee.members[i].adminResponsibility;
            temp.tenured = this.committee.members[i].tenured;
            temp.last = this.committee.members[i].last;
            temp.rank = this.committee.members[i].rank;
            temp.college = this.committee.members[i].college;
            this.volunteers.push(temp);
            this.committee.members.splice(i , 1 );
          }
        }
      }
    );
  }

  assignVolunteer() {
    this.apiService.assignUserToOneCommittee(this.committee.id, this.seletedUserid).subscribe(
      value => {
        for (let i = 0; i < this.volunteers.length; i++) {
          if (this.volunteers[i].id === this.seletedUserid) {
            let temp = new CommitteeUser();
            temp.college = this.volunteers[i].college;
            temp.last = this.volunteers[i].last;
            temp.rank = this.volunteers[i].rank;
            temp.tenured = this.volunteers[i].tenured;
            temp.adminResponsibility = this.volunteers[i].adminResponsibility;
            temp.soe = this.volunteers[i].soe;
            temp.gender = this.volunteers[i].gender;
            temp.first = this.volunteers[i].first;
            temp.id = this.volunteers[i].id
            let temp2 = new UserCommittees();
            temp2.id = this.committee.id;
            temp2.introduction = this.committee.introduction;
            temp2.name = this.committee.name;
            temp2.year = this.committee.year;
            this.volunteersCommittees[i].push(temp2)
            this.usersCommittees.push(this.volunteersCommittees[i])
            this.committee.members.push(temp);
            this.volunteers.splice(i , 1 );
          }
        }
      }
      );
  }

  selectUser(id) {
    this.seletedUserid = id;
  }

  closePop() {
    this.popIntroductionExpand = 0;
    this.popDutyExpand = 0;
    this.popCritreriaExpand = 0;
  }
}
