import {AfterViewInit, Component, OnInit} from '@angular/core';
import {YearService} from '../service/year.service';
import {ApiService} from '../service/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Committee} from '../models/committee';
import {forkJoin, of} from 'rxjs';
import {UserCommittees} from '../models/user-committees';
import {newArray} from '@angular/compiler/src/util';
import {User} from '../models/user';
import {CommitteeUser} from '../models/committee-user';
import {AuthenticationService} from '../service/authentication.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-committees-details',
  templateUrl: './committees-details.component.html',
  styleUrls: ['./committees-details.component.css']
})
export class CommitteesDetailsComponent implements OnInit {
  seletedUserid: string;
  introductionExpand = false;
  committee: Committee;
  dutyExpand = false;
  critreriaExpand = false;
  usersCommittees: UserCommittees[][];
  volunteers: User[];
  volunteersCommittees: UserCommittees[][];
  popIntroductionExpand = false;
  popDutyExpand = false;
  popCritreriaExpand  = false;
  constructor(private http: HttpClient, public authentication: AuthenticationService, private yearService: YearService,
              private apiService: ApiService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      param => {
        this.apiService.getCommitteeYears(param.id).subscribe(
          years => {
            this.yearService.setYears(years);
            this.apiService.getCommitteeById(param.id).subscribe(
              value => {
                this.committee = value;
                this.yearService.getValue().subscribe(
                  value5 => {
                    this.apiService.getCommitteeIdByYearAndName(value5, this.committee.name).subscribe(
                      value7 => {
                        if (this.committee !== undefined) {
                          this.router.navigate(['/committees/' + value7]);
                        }
                      }
                    );
                  }
                );
                const reqs = value.members.map( m => this.apiService.getUserAssignedCommittees(m.id) );
                // for (let i = 0; i < value.members.length; i++) {
                //   reqs.push( this.apiService.getUserAssignedCommittees(value.members[i].id));
                // }
                forkJoin(reqs).subscribe(
                  results => {
                    this.usersCommittees = results as UserCommittees[][];
                  }
                );
                // this.apiService.getUserAssignedCommittees(value.members[i].id).subscribe(
                //   value2 => {
                //     this.usersCommittees[i] = value2;
                //   }
                // );
                this.apiService.getCommitteeVolunteers(param.id).subscribe(
                  v => {
                    this.volunteers = v;
                    for (let i = 0; i < this.volunteers.length; i++) {
                      // tslint:disable-next-line:prefer-for-of
                      for (let j = 0; j < this.committee.members.length; j++) {
                        if (this.volunteers[i].id === this.committee.members[j].id) {
                          this.volunteers.splice(i, 1);
                          i--;
                          break;
                        }
                      }
                    }
                    const reqs2 = [];
                    this.volunteersCommittees = newArray(v.length);
                    for (let i = 0; i < v.length; i++) {
                      reqs2.push( this.apiService.getUserAssignedCommittees(v[i].id));
                    }
                    forkJoin(reqs2).subscribe(
                      results => {
                        this.volunteersCommittees = results as UserCommittees[][];
                      }
                    );
                    // this.apiService.getUserAssignedCommittees(v[i].id).subscribe(
                    //   value2 => {
                    //     this.volunteersCommittees[i] = value2;
                    //   }
                    // );
                    console.log(this.volunteersCommittees);
                  }
                );
              }
            );
          }
          );
      }
    );
  }

  expandIntroduction(): void {
    this.introductionExpand = !this.introductionExpand;
  }

  expandCriteria(): void {
    this.critreriaExpand = !this.critreriaExpand;
  }

  expandDuties(): void {
    this.dutyExpand = !this.dutyExpand;
  }

  removeMember(): void {
    this.apiService.removeUserFromCommittee(this.committee.id, this.seletedUserid).subscribe(
      value => {
        this.volunteers.push(value);
        this.committee.members = this.committee.members.filter( m => m.id !== value.id );
        // for (let i = 0; i < this.committee.members.length; i++) {
        //   if (this.committee.members[i].id === this.seletedUserid) {
        //     const temp = new User();
        //     temp.id = this.committee.members[i].id;
        //     temp.first = this.committee.members[i].first;
        //     temp.gender = this.committee.members[i].gender;
        //     temp.soe = this.committee.members[i].soe;
        //     temp.adminResponsibility = this.committee.members[i].adminResponsibility;
        //     temp.tenured = this.committee.members[i].tenured;
        //     temp.last = this.committee.members[i].last;
        //     temp.rank = this.committee.members[i].rank;
        //     temp.college = this.committee.members[i].college;
        //     this.volunteers.push(temp);
        //     this.committee.members.splice(i , 1 );
        // }
        // }
      }
    );
  }

  assignVolunteer(): void {
    this.apiService.assignUserToOneCommittee(this.committee.id, this.seletedUserid).subscribe(
      value => {
        this.volunteers.filter( v => v.id !== value.id );
        this.committee.members.push(value);
        // for (let i = 0; i < this.volunteers.length; i++) {
        //   if (this.volunteers[i].id === this.seletedUserid) {
        //     const temp = new CommitteeUser();
        //     temp.college = this.volunteers[i].college;
        //     temp.last = this.volunteers[i].last;
        //     temp.rank = this.volunteers[i].rank;
        //     temp.tenured = this.volunteers[i].tenured;
        //     temp.adminResponsibility = this.volunteers[i].adminResponsibility;
        //     temp.soe = this.volunteers[i].soe;
        //     temp.gender = this.volunteers[i].gender;
        //     temp.first = this.volunteers[i].first;
        //     temp.id = this.volunteers[i].id;
        //     const temp2 = new UserCommittees();
        //     temp2.id = this.committee.id;
        //     temp2.introduction = this.committee.introduction;
        //     temp2.name = this.committee.name;
        //     temp2.year = this.committee.year;
        //     this.committee.members.push(temp);
        //     this.volunteers.splice(i , 1 );
        //   }
        // }
      }
      );
  }

  selectUser(id): void {
    this.seletedUserid = id;
  }

  closePop(): void {
    this.popIntroductionExpand = false;
    this.popDutyExpand = false;
    this.popCritreriaExpand = false;
  }
}
