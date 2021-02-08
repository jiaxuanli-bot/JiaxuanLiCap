import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../service/authentication.service';
import {YearService} from '../service/year.service';
import {ApiService} from '../service/api.service';
import {Router} from '@angular/router';
import {Gender} from '../models/gender';
import {College} from '../models/college';
import {Department} from '../models/department';

import { faTrash, faEdit, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import {TopBarService} from '../service/top-bar.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddDeptComponent} from './add-dept/add-dept.component';
import {AddGenderComponent} from './add-gender/add-gender.component';
import {AddCollegeComponent} from './add-college/add-college.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  editIndex = {
    editCollegeIndex: -1,
    editGenderIndex: -1,
    editDeptIndex : -1,
  };
  add = {
    addCollege: false,
    addGender: false,
    addDept: false,
  };


  genders: Gender[] = [];
  colleges: College[] = [];
  depts: Department[] = [];
  editGenderText: string;
  editCollegeText: string;
  editDeptText: string;

  icons = {
    faTrash : faTrash,
    faEdit : faEdit,
    faPlusSquare : faPlusSquare
  };

  constructor(
    public authentication: AuthenticationService,
    private yearService: YearService,
    private apiService: ApiService,
    private topBarService: TopBarService,
    private modalService: NgbModal,
    private router: Router) {
    this.apiService.getYears().subscribe( years => {
      this.yearService.setYears( years );
    });
  }

  ngOnInit(): void {
    this.topBarService.setTopBarName('Settings');
    this.yearService.getValue().subscribe(
      year => {
        this.getCollege();
        this.getGen();
        this.getDept();
      }
    );
  }

  deleteDept(deptId: string, index: number) {
    this.apiService.deleteDept(deptId).subscribe(
      dept => {
        this.getGen();
        this.getDept();
        this.getCollege();
      }
    );
  }
  deleteGender(genderId: string, index: number) {
    this.apiService.deleteGender(genderId).subscribe(
      gender => {
        this.getGen();
        this.getDept();
        this.getCollege();
      }
    );
  }
  deleteCollege(collegeId: string, index: number) {
    this.apiService.deleteCollege(collegeId).subscribe(
      college => {
        this.getGen();
        this.getDept();
        this.getCollege();
      }
    );
  }
  cancelEditDept() {
    this.editDeptText = '';
    this.editIndex.editDeptIndex = -1;
  }
  saveDept(dept: Department) {
    dept.name = this.editDeptText;
    this.apiService.modifyDept(dept).subscribe(
      resDept => {
        dept = resDept;
        this.editDeptText = '';
        this.editIndex.editDeptIndex = -1;
      }
    );
  }
  editDept(index: number) {
    this.editIndex.editDeptIndex = index;
  }
  editGender(index: number) {
    this.editIndex.editGenderIndex = index;
  }
  editCollege(index: number) {
    this.editIndex.editCollegeIndex = index;
  }
  cancelEditCollege() {
    this.editCollegeText = '';
    this.editIndex.editCollegeIndex = -1;
  }
  saveCollege(college: College) {
    college.name = this.editCollegeText;
    this.apiService.modifyCollege(college).subscribe(
      resCollege => {
        college = resCollege;
        this.editIndex.editCollegeIndex = -1;
        this.editCollegeText = '';
      }
    );
  }
  cancelEditGender() {
    this.editGenderText = '';
    this.editIndex.editGenderIndex = -1;
  }
  saveGender(gender: Gender) {
    gender.name = this.editGenderText;
    this.apiService.modifyGender(gender).subscribe(
      resGender => {
        gender = resGender;
        this.editGenderText = '';
        this.editIndex.editGenderIndex = -1;
      }
    );
  }

  getCollege() {
    this.apiService.getCollegeByYear(this.yearService.getYearValue).subscribe(
      colleges => {
        this.colleges = colleges;
      }
    );
  }

  getGen() {
    this.apiService.getGendersByYear(this.yearService.getYearValue).subscribe(
      genders => {
        this.genders = genders;
      }
    );
  }

  getDept() {
    this.apiService.getDeptByYear(this.yearService.getYearValue).subscribe(
      depts => {
        this.depts = depts;
      }
    );
  }

  addDept() {
    const modalRef = this.modalService.open(AddDeptComponent, {backdropClass: 'light-blue-backdrop'});
    modalRef.componentInstance.parentComponent = this;
    modalRef.result.then(
      () => {
        this.getDept();
      }
    );
  }

  addGen() {
    const modalRef = this.modalService.open(AddGenderComponent, {backdropClass: 'light-blue-backdrop'});
    modalRef.result.then(
      () => {
        this.getGen();
      }
    );
  }

  addCollege() {
    const modalRef = this.modalService.open(AddCollegeComponent, {backdropClass: 'light-blue-backdrop'});
    modalRef.result.then(
      () => {
        this.getCollege();
      }
    );
  }
}
