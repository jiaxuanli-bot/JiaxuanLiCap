import {Component, OnInit} from '@angular/core';
import {YearService} from '../service/year.service';
import {ApiService} from '../service/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Committee} from '../models/committee';
import {forkJoin} from 'rxjs';
import {newArray} from '@angular/compiler/src/util';
import {User} from '../models/user';
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
  unsatisfiedCriteria: string[] = [];
  critreriaExpand = false;
  usersCommittees: Committee[][];
  volunteers: User[] = [];
  volunteersCommittees: Committee[][];
  constructor(private http: HttpClient, public authentication: AuthenticationService, private yearService: YearService,
              private apiService: ApiService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      param => {
        this.uploadCommitteeById(param.id);
        this.yearService.committeeGetValue().subscribe(
          year => {
            if (year !== '' ) {
              this.apiService.getCommitteeIdByYearAndName(year, this.committee.name).subscribe(
                value7 => {
                  this.router.navigate( ['/uwl/committees/' , value7.id ], {fragment: year});
                }
              );
            }
          }
        );
      },
      (err) => console.error(err),
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
      committee => {
        this.uploadCommitteeById(this.committee.id);
      }
    );
  }
  uploadCommitteeById(committeeId: string) {
    this.apiService.getCommitteeById(committeeId).subscribe (
      committee => {
        this.committee = committee;
        this.apiService.getUnSatisfiedCriteria(this.committee.id).subscribe(
          criteria => {
            criteria.forEach(
              criteria2 => {
                this.unsatisfiedCriteria.push(criteria2.criteria);
              }
            );
          }
        );
        const reqs = committee.members.map( m => this.apiService.getUserAssignedCommittees(m.id) );
        forkJoin(reqs).subscribe(
          results => {
            this.usersCommittees = results as Committee[][];
          }
        );
        const reqs2 = [];
        this.volunteersCommittees = newArray(this.committee.volunteers.length);
        this.committee.volunteers.forEach(
          value1 => {
            reqs2.push(this.apiService.getUserAssignedCommittees(value1.id));
          }
        );
        forkJoin(reqs2).subscribe(
          results => {
            this.volunteersCommittees = results as Committee[][];
          }
        );
      }
    );
  }
  assignVolunteer(): void {
    this.apiService.assignUserToOneCommittee(this.committee.id, this.seletedUserid).subscribe(
      value => {
        this.uploadCommitteeById(this.committee.id);
      }
    );
  }
  selectUser(id): void {
    this.seletedUserid = id;
  }
}
