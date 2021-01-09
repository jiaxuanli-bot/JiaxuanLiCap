import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Criteria} from '../../models/criteria';
import {Duty} from '../../models/duty';
import {Committee} from '../../models/committee';
import {YearService} from '../../service/year.service';
import {ApiService} from '../../service/api.service';

@Component({
  selector: 'app-add-committee',
  templateUrl: './add-committee.component.html',
  styleUrls: ['./add-committee.component.css']
})
export class AddCommitteeComponent implements OnInit {
  @Output() addCommittee = new EventEmitter();
  newIntr = '';
  Du  = '';
  newName = '';
  cri: '';
  modifyNewCommittee = {
    editName: false,
    editCriteria: false,
    editDuties: false,
    editIntroduction: false,
  };
  newCommittee: Committee = new Committee();
  constructor( private yearService: YearService, private apiService: ApiService) { }

  ngOnInit(): void {
  }
  modifyIntr() {
    this.modifyNewCommittee.editIntroduction = !this.modifyNewCommittee.editIntroduction;
  }

  modifyDu() {
    this.modifyNewCommittee.editDuties = !this.modifyNewCommittee.editDuties;
  }

  modifyCri() {
    this.modifyNewCommittee.editCriteria = !this.modifyNewCommittee.editCriteria;
  }

  modifyName() {
    this.modifyNewCommittee.editName = !this.modifyNewCommittee.editName;
  }

  saveIntr() {
    this.modifyNewCommittee.editIntroduction = !this.modifyNewCommittee.editIntroduction;
    this.newCommittee.introduction = this.newIntr;
  }

  addCri() {
    this.modifyNewCommittee.editCriteria = !this.modifyNewCommittee.editCriteria;
    const d = new Criteria();
    if (this.newCommittee.criteria === undefined) {
      this.newCommittee.criteria = [];
    }
    d.criteria = this.cri;
    this.newCommittee.criteria.push(d);
    this.cri = '';
  }

  addDu() {
    this.modifyNewCommittee.editDuties = !this.modifyNewCommittee.editDuties;
    const d = new Duty();
    if (this.newCommittee.duties === undefined) {
      this.newCommittee.duties = [];
    }
    d.duty = this.Du;
    this.newCommittee.duties.push(d);
    this.Du = '';
  }

  saveName() {
    this.modifyNewCommittee.editName = !this.modifyNewCommittee.editName;
    this.newCommittee.name = this.newName;
  }
  saveAll() {
    this.newCommittee.year = this.yearService.getYearValue;
    console.log(this.newCommittee);
    this.apiService.createCommittee(this.newCommittee).subscribe(
      value => {
        this.addCommittee.emit();
      }
    );
  }
}
