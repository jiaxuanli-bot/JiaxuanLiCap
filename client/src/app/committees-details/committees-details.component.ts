import {Component, OnInit} from '@angular/core';
import {YearService} from '../service/year.service';
import {ApiService} from '../service/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Committee} from '../models/committee';
import {forkJoin} from 'rxjs';
import {User} from '../models/user';
import {AuthenticationService} from '../service/authentication.service';

import { faCircle, faCheckCircle, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-committees-details',
  templateUrl: './committees-details.component.html',
  styleUrls: ['./committees-details.component.css']
})
export class CommitteesDetailsComponent implements OnInit {
  seletedUserid: string;  
  committee: Committee;  
  usersCommittees: Committee[][];
  volunteers: User[] = [];
  volunteersCommittees: Committee[][];

  views = {
    introduction: false,
    duties : false,
    criteria : false,
    members: true,
    volunteers: true
  }

  icons = {
    faCircle : faCircle,
    faCheckCircle : faCheckCircle,
    faAngleDown : faAngleDown,
    faAngleUp : faAngleUp
  }

  constructor(
    public authentication: AuthenticationService, 
    private yearService: YearService,
    private apiService: ApiService, 
    private route: ActivatedRoute, 
    private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      param => {
        this.uploadCommitteeById( param.id );
      },
      (err) => console.error(err),
    );
  }

  toggleView( view : string ) : void {
    this.views[view] = !this.views[view];
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
        this.committee.members.forEach( m => m.rank = m.rank.split(' ')[0] );
        this.committee.volunteers.forEach( m => m.rank = m.rank.split(' ')[0] );

        const assignedUsersReqs = committee.members.map( m => this.apiService.getUserAssignedCommittees(m.id) );
        forkJoin(assignedUsersReqs).subscribe(
          results => {
            this.usersCommittees = results as Committee[][];
          }
        );

        const unassignedUserReqs = this.committee.volunteers.map( m => this.apiService.getUserAssignedCommittees(m.id) );
        forkJoin(unassignedUserReqs).subscribe(
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
