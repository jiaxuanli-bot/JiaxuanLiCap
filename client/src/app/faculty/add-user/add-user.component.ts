import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ApiService} from '../../service/api.service';
import {YearService} from '../../service/year.service';
import {Gender} from '../../models/gender';
import {College} from '../../models/college';
import {Department} from '../../models/department';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  genders: Gender[];
  colleges: College[];
  depts: Department[];
  @Output() addUser = new EventEmitter();
  addUserForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private yearService: YearService, private apiService: ApiService) {
    this.addUserForm = this.formBuilder.group({
      email: [''],
      first: [''],
      last: [''],
      rank: ['Full Professor'],
      college: ['CASH'],
      tenured: [false],
      admin: [false],
      soe: [false],
      gender: ['M'],
      chair: [false],
      dept: [],
    });
  }
  ngOnInit(): void {
    this.apiService.getGendersByYear(this.yearService.getYearValue).subscribe(
      genders => {
        this.genders = genders;
      }
    );
    this.apiService.getCollegeByYear(this.yearService.getYearValue).subscribe(
      colleges => {
        this.colleges = colleges;
      }
    );
    this.apiService.getDeptByYear(this.yearService.getYearValue).subscribe(
      depts => {
        this.depts = depts;
      }
    );
  }
  addFaculty(): void {
    this.apiService.createUser(this.addUserForm.controls.email.value, this.addUserForm.controls.first.value,
      this.addUserForm.controls.last.value, this.addUserForm.controls.rank.value, this.addUserForm.controls.college.value,
      Number(this.addUserForm.controls.tenured.value), Number(this.addUserForm.controls.admin.value),
      Number(this.addUserForm.controls.soe.value), this.addUserForm.controls.gender.value, this.yearService.getYearValue).
    subscribe(
      value => {
        this.addUser.emit();
      }
    );
  }
}
