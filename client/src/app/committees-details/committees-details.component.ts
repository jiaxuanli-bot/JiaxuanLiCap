import {Component, OnInit} from '@angular/core';
import {YearService} from '../service/year.service';
import {ApiService} from '../service/api.service';
import {ActivatedRoute} from '@angular/router';
import {Committee} from '../models/committee';
import {forkJoin} from 'rxjs';
import {AuthenticationService} from '../service/authentication.service';

import { faCircle, faCheckCircle, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import {TopBarService} from '../service/top-bar.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AssignMemberComponent} from './assign-member/assign-member.component';
import {RemoveMemberComponent} from './remove-member/remove-member.component';

@Component({
  selector: 'app-committees-details',
  templateUrl: './committees-details.component.html',
  styleUrls: ['./committees-details.component.css']
})
export class CommitteesDetailsComponent implements OnInit {
  committee: Committee;
  usersCommittees: Committee[][];
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
    private modalService: NgbModal,
    public authentication: AuthenticationService,
    private topBarService: TopBarService,
    private yearService: YearService,
    private apiService: ApiService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.topBarService.setTopBarName('Committee Details');
    this.route.params.subscribe(
      param => {
        this.uploadCommitteeById( param.id );
      },
      (err) => console.error(err),
    );
  }

  toggleView( view: string ): void {
    this.views[view] = !this.views[view];
  }

  removeMember(id: string): void {
    this.apiService.removeUserFromCommittee(this.committee.id, id).subscribe(
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
  assignVolunteer(id: string): void {
    this.apiService.assignUserToOneCommittee(this.committee.id, id).subscribe(
      value => {
        this.uploadCommitteeById(this.committee.id);
      }
    );
  }
  deleteUser(id): void {
    const modalRef = this.modalService.open(RemoveMemberComponent, {backdropClass: 'light-blue-backdrop'});
    modalRef.componentInstance.parentComponent = this;
    modalRef.componentInstance.userId = id;
  }
  assignUser(id): void {
    const modalRef = this.modalService.open(AssignMemberComponent, {backdropClass: 'light-blue-backdrop'});
    modalRef.componentInstance.parentComponent = this;
    modalRef.componentInstance.userId = id;
  }
}
