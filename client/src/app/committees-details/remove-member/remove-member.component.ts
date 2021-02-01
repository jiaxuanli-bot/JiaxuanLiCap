import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-remove-member',
  templateUrl: './remove-member.component.html',
  styleUrls: ['./remove-member.component.css']
})
export class RemoveMemberComponent implements OnInit {
  public parentComponent: any;
  public userId: string;
  constructor(public activeModal: NgbActiveModal) { }
  ngOnInit(): void {
  }

  removeUser() {
    this.activeModal.dismiss();
    this.parentComponent.removeMember(this.userId);
  }
}
