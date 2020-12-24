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
  usersCommittees: Committee[][];
  volunteers: User[];
  volunteersCommittees: Committee[][];
  popIntroductionExpand = false;
  popDutyExpand = false;
  popCritreriaExpand  = false;
  constructor(private http: HttpClient, public authentication: AuthenticationService, private yearService: YearService,
              private apiService: ApiService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      param => {
            this.apiService.getCommitteeById(param.id).subscribe(
              value => {
                this.committee = value;
                console.log(value);
                this.yearService.getValue().subscribe(
                  value5 => {
                    this.apiService.getCommitteeIdByYearAndName(value5, this.committee.name).subscribe(
                      value7 => {
                        if (this.committee !== undefined) {
                          this.router.navigate(['/uwl/committees/' + value7]);
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
                    this.usersCommittees = results as Committee[][];
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
                    let i = 0;
                    this.volunteers.forEach(
                      value1 => {
                        this.committee.members.forEach(
                          value2 => {
                            i++;
                            if (value1.id === value2.id) {
                              this.volunteers = this.volunteers.splice(i, 1);
                              i--;
                            }
                          }
                        );
                      }
                    );
                    const reqs2 = [];
                    this.volunteersCommittees = newArray(v.length);
                    v.forEach(
                      value1 => {
                        reqs2.push(this.apiService.getUserAssignedCommittees(value1.id));
                      }
                    );
                    forkJoin(reqs2).subscribe(
                      results => {
                        this.volunteersCommittees = results as Committee[][];
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
        console.log(value);
        this.apiService.getUserAssignedCommittees(value.id).subscribe(
          value1 => {
            this.volunteersCommittees.push(value1);
          }
        );
        this.volunteers.push(value);
        this.committee.members = this.committee.members.filter( m => m.id !== value.id );
      }
    );
  }

  assignVolunteer(): void {
    this.apiService.assignUserToOneCommittee(this.committee.id, this.seletedUserid).subscribe(
      value => {
        this.apiService.getUserAssignedCommittees(value.id).subscribe(
          value1 => {
            this.usersCommittees.push(value1);
          }
        );
        this.volunteers = this.volunteers.filter( v => v.id !== value.id );
        this.committee.members.push(value);
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
