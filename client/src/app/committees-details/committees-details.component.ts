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
        alert(param.id)
        this.apiService.getCommitteeById(param.id).subscribe(
              committee => {
                console.log(committee);
                this.committee = committee;
                this.apiService.getUnSatisfiedCriteria(param.id).subscribe(
                  criteria => {
                    criteria.forEach(
                      criteria2 => {
                        this.unsatisfiedCriteria.push(criteria2.criteria);
                      }
                    );
                  }
                );
                this.yearService.committeeGetValue().subscribe(
                  year => {
                    if (year !== '' ) {
                      this.apiService.getCommitteeIdByYearAndName(year, committee.name).subscribe(
                        value7 => {
                          this.router.navigate(['/uwl/committees/' + value7.id]);
                        }
                      );
                    }
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
                console.log(this.volunteersCommittees);
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
}
