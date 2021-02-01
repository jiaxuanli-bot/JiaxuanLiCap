import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ApiService} from '../../service/api.service';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.css']
})
export class DeleteUserComponent implements OnInit {
  parentComponent: any;
  constructor(
    public activeModal: NgbActiveModal) { }
  ngOnInit(): void {
  }

  deleteUser() {
    this.parentComponent.deleteUser();
    this.activeModal.dismiss();
  }
}
