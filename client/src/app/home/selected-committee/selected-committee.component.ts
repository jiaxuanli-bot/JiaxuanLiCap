import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Committee} from '../../models/committee';
import {Survey} from '../../models/survey';
import {User} from '../../models/user';

@Component({
  selector: 'app-selected-committee',
  templateUrl: './selected-committee.component.html',
  styleUrls: ['./selected-committee.component.css']
})
export class SelectedCommitteeComponent implements OnInit {
  @Input() selectedCommittee: Committee;
  @Output() selectedCommitteeChange = new EventEmitter();
  introductionExpand = true;
  dutyExpand = true;
  critreriaExpand = true;
  committees: Committee[] = [];
  user: User;
  constructor() { }

  ngOnInit(): void {
  }
  expandCriteria() {
    this.critreriaExpand = !this.critreriaExpand;
  }
  expandDuty() {
    this.dutyExpand = !this.dutyExpand;
  }
  expandIntroduction() {
    this.introductionExpand = !this.introductionExpand;
  }
}
