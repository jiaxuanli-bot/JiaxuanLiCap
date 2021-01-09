import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-assign-member',
  templateUrl: './assign-member.component.html',
  styleUrls: ['./assign-member.component.css']
})
export class AssignMemberComponent implements OnInit {
  @Output() assignVolunteer = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

}
