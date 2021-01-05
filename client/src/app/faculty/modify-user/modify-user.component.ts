import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-modify-user',
  templateUrl: './modify-user.component.html',
  styleUrls: ['./modify-user.component.css']
})
export class ModifyUserComponent implements OnInit {
  @Output() modifyUser = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

}
