import {Component, OnInit} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-assign-member',
  templateUrl: './assign-member.component.html',
  styleUrls: ['./assign-member.component.css']
})
export class AssignMemberComponent implements OnInit {

  public parentComponent: any;
  public userId: string;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  assignMember() {
    this.activeModal.dismiss();
    this.parentComponent.assignVolunteer(this.userId);
  }
}
