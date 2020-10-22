import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../service/authentication.service';
import {ApiService} from '../service/api.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {newArray} from '@angular/compiler/src/util';
import {Committee} from '../models/committee';
import {HashedCommittees} from '../models/hashed-committees';
import {YearService} from '../service/year.service';

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
  F = 0;
  FP = 0;
  AP = 0;
  ATP = 0;
  TT = 0;
  TF = 0;
  j = 0;
  max = {};
  committees: HashedCommittees;
  type = 'PieChart';
  CTitle = 'College Affiliation';
  GTitle = 'Gender';
  RTitle = 'Rank';
  TTitle = 'Tenured';
  GData: any;
  CData: any;
  RData: any;
  TData: any;
  years: string[];
  yearForm: FormGroup;


  constructor(private yearService: YearService, public authentication: AuthenticationService, private apiservice: ApiService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.apiservice.getCommitteesYears().subscribe(
      years => {
        years.sort();
        this.yearService.setYears(years)
        this.yearService.setValue(years[0]);
      }
    );
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
        console.log(value);
        this.committeeMemberMaxLength(value);
        this.initPiecgart(value);
        this.years =  newArray( this.f.endYear.value - this.f.startYear.value + 1);
        for (let i = 0; i < this.f.endYear.value - this.f.startYear.value + 1; i++)  {
          this.years[i] = ( parseInt(this.f.startYear.value) + i ).toString();
        }
      }
    );
  }

  private initPiecgart(committees) {
    for (const property in committees) {
      for (let j = 0; j < committees[property].length; j++) {
        this.M += committees[property][j].members.filter(item => item.gender === 'M').length;
        this.F += committees[property][j].members.filter(item => item.gender === 'F').length;
        this.CASH += committees[property][j].members.filter(item => item.college === 'CASH').length;
        this.CBA += committees[property][j].members.filter(item => item.college === 'CBA').length;
        this.CSH += committees[property][j].members.filter(item => item.college === 'CSH').length;
        this.FP += committees[property][j].members.filter(item => item.rank === 'Full Professor').length;
        this.AP += committees[property][j].members.filter(item => item.rank === 'Associate Professor').length;
        this.ATP += committees[property][j].members.filter(item => item.rank === 'Assistant Professor').length;
        this.TT += committees[property][j].members.filter(item => item.tenured == 1).length;
        this.TF += committees[property][j].members.filter(item => item.tenured == 0).length;
      }
    }
    this.GData = [
      ['Male', this.M],
      ['Female', this.F],
    ];
    this.CData = [
      ['CASH', this.CASH],
      ['CBA', this.CBA],
      ['CSH', this.CSH]
    ];
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
      console.log(property)
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
