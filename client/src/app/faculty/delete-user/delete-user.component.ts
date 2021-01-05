import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ApiService} from '../../service/api.service';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.css']
})
export class DeleteUserComponent implements OnInit {
  @Output() deleteUser = new EventEmitter();
  constructor() { }
  ngOnInit(): void {
  }
}
