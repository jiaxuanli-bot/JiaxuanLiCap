import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../service/authentication.service';
import {ApiService} from '../service/api.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {newArray} from '@angular/compiler/src/util';
import {HashedCommittees} from '../models/hashed-committees';
import {YearService} from '../service/year.service';
import {TopBarService} from "../service/top-bar.service";

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  CASH = 0;
  CSH = 0;
  CBA = 0;
  M = 0;
  FP = 0;
  AP = 0;
  ATP = 0;
  TT = 0;
  TF = 0;
  j = 0;
  max = {};
  committees: HashedCommittees;
  type = 'PieChart';
  RTitle = 'Rank';
  TTitle = 'Tenured';
  RData: any;
  TData: any;
  years: string[];
  yearForm: FormGroup;


  constructor(
    private yearService: YearService,
    public authentication: AuthenticationService,
    private apiservice: ApiService,
    private topBarService: TopBarService,
    private formBuilder: FormBuilder) {
    this.yearService.setYears([]);
  }
  ngOnInit(): void {
    this.topBarService.setTopBarName('Analysis');
    this.yearForm = this.formBuilder.group({
      startYear: [''],
      endYear: ['']
    });
  }

  get f() { return this.yearForm.controls; }
  search() {
    this.M = 0;
    this.apiservice.getHashedCommitteesByYears(this.f.startYear.value, this.f.endYear.value).subscribe(
      value => {
        this.committees = value;
        this.committeeMemberMaxLength(value);
        this.initPiecgart(value);
        this.years =  newArray( this.f.endYear.value - this.f.startYear.value + 1);
        for (let i = 0; i < this.f.endYear.value - this.f.startYear.value + 1; i++) {
          this.years[i] = (parseInt(this.f.startYear.value) + i).toString();
        }
      }
    );
  }

  private initPiecgart(committees: HashedCommittees) {
    for (const property in committees) {
      for (let j = 0; j < committees[property].length; j++) {
        this.FP += committees[property][j].members.filter(item => item.rank === 'Full Professor').length;
        this.AP += committees[property][j].members.filter(item => item.rank === 'Associate Professor').length;
        this.ATP += committees[property][j].members.filter(item => item.rank === 'Assistant Professor').length;
        this.TT += committees[property][j].members.filter(item => item.tenured === true).length;
        this.TF += committees[property][j].members.filter(item => item.tenured === false).length;
      }
    }
    this.RData = [
      ['Full Professor', this.FP],
      ['Associate Professor', this.AP],
      ['Assistant Professor', this.ATP]
    ];
    this.TData = [
      ['True', this.TT],
      ['False', this.TF]
    ];
  }

  committeeMemberMaxLength(committees) {
    for (const property in committees) {
      let maxNum = 0;
      for (let j = 0; j < committees[property].length; j++) {
        if  (committees[property][j].members.length > maxNum) {
          maxNum = committees[property][j].members.length;
        }
      }
      this.max[property] = maxNum;
    }
  }
}
