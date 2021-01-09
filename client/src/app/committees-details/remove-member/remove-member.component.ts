import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-remove-member',
  templateUrl: './remove-member.component.html',
  styleUrls: ['./remove-member.component.css']
})
export class RemoveMemberComponent implements OnInit {
  @Output() closePop = new EventEmitter();
  @Output() removeMember = new EventEmitter();
  constructor() { }
  ngOnInit(): void {
  }

}
