import { Component, OnInit } from '@angular/core';
import {ApiService} from '../service/api.service';
import {User} from '../models/user';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {YearService} from '../service/year.service';
import { AfterViewInit } from '@angular/core';
import * as Feather from 'feather-icons';
import {Committee} from '../models/committee';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AuthenticationService} from '../service/authentication.service';

@Component({
  selector: 'app-faculty',
  templateUrl: './faculty.component.html',
  styleUrls: ['./faculty.component.css']
})
export class FacultyComponent implements OnInit, AfterViewInit {
  selectedUserId: string;
  introductionExpand: number;
  dutyExpand: number;
  critreriaExpand: number;
  searched: boolean;
  selectedCommittee: Committee;
  showVolunteeredCommittees: boolean;
  showAssignedCommittees: boolean;
  userVolunteeredCommittees: Committee[];
  userAssignedCommittees: Committee[];
  currentPage: number;
  pageNum: number;
  editIndex: number;
  editFirst: string;
  editLast: string;
  editRank: string;
  editCollege: string;
  editTenured: number;
  editSoe: number;
  editAdmin: number;
  editGender: string;
  deleteindex: number;
  faculties: User[];
  first: string = '';
  last: string = '';
  rank: string = 'None';
  college: string = 'None';
  tenured: string = 'None';
  soe: string = 'None';
  admin: string = 'None';
  gender: string = 'None';
  searchTextChanged = new Subject<string>();
  searchedFaculties: User[];
  year: Observable<string>;
  addUserForm: FormGroup;
  filteredFaculities: User[];
  constructor(public authentication: AuthenticationService, private yearService: YearService, private apiService: ApiService, private router: Router,  private formBuilder: FormBuilder) {
    this.searchTextChanged.pipe(debounceTime(1000)).subscribe(() => {
      if (this.first.length === 0 && this.last.length === 0 && this.rank === 'None' && this.college === 'None' && this.tenured === 'None' && this.soe === 'None' && this.admin === 'None' && this.gender === 'None') {
        this.searched = false;
        this.year.subscribe(
          value => {
            if (value !== '') {
              this.apiService.getFacultyByYear(value).subscribe(
                res => {
                  this.faculties = res;
                  this.pageNum = Math.ceil(res.length / 20);
                  this.apiService.getCommitteesByPagation(value , 0, 20).subscribe(
                    res2 => {
                      this.searchedFaculties = res2;
                      this.currentPage = 0;
                    }
                  );
                }
              );
            }
          }
        );
      }
      this.searchedFaculties = [...this.faculties];
      if (this.first.length > 0) {
        this.searched = true;
        this.filteredFaculities = this.searchedFaculties.filter(item => item.first.toUpperCase().indexOf(this.first.toUpperCase()) >= 0);
        this.searchedFaculties = [...this.filteredFaculities.slice(0, 20)];
      }
      if (this.last.length > 0) {
        this.searched = true;
        this.filteredFaculities = this.searchedFaculties.filter(item => item.last.toUpperCase().indexOf(this.last.toUpperCase()) >= 0);
        this.searchedFaculties = [...this.filteredFaculities.slice(0, 20)];
      }
      if (this.rank !== 'None') {
        this.searched = true;
        this.filteredFaculities = this.searchedFaculties.filter(item => item.rank == this.rank);
        this.searchedFaculties = [...this.filteredFaculities.slice(0, 20)];
      }
      if (this.college !== 'None') {
        this.searched = true;
        this.filteredFaculities = this.searchedFaculties.filter(item => item.college == this.college);
        this.searchedFaculties = [...this.filteredFaculities.slice(0, 20)];
      }
      if (this.tenured !== 'None') {
        this.searched = true;
        this.filteredFaculities = this.searchedFaculties.filter((item, idx, arr) => {
          if (item.tenured === 1 && this.tenured === 'Yes' ) {
            return true;
          }
          if (item.tenured === 0 && this.tenured === 'No') {
            return true;
          }
          return false;
        });
        this.searchedFaculties = [...this.filteredFaculities.slice(0, 20)];
      }
      if (this.soe !== 'None') {
        this.searched = true;
        this.filteredFaculities = this.searchedFaculties.filter((item, idx, arr) => {
          if (item.soe === 1 && this.soe === 'Yes' ) {
            return true;
          }
          if (item.soe === 0 && this.soe === 'No') {
            return true;
          }
          return false;
        });
        this.searchedFaculties = [...this.filteredFaculities.slice(0, 20)];
      }
      if (this.admin !== 'None') {
        this.searched = true;
        this.filteredFaculities = this.searchedFaculties.filter((item, idx, arr) => {
          if (item.adminResponsibility === 1 && this.admin === 'Yes' ) {
            return true;
          }
          if (item.adminResponsibility === 0 && this.admin === 'No') {
            return true;
          }
          return false;
        });
        this.searchedFaculties = [...this.filteredFaculities.slice(0, 20)];
      }
      if (this.gender !== 'None') {
        this.searched = true;
        this.filteredFaculities = this.searchedFaculties.filter(item => item.gender === this.gender.substring(0, 1));
        this.searchedFaculties = [...this.filteredFaculities.slice(0, 20)];
      }
      this.pageNum  = Math.ceil(this.filteredFaculities.length / 20);
    });
  }

  ngOnInit(): void {
    this.year = this.yearService.getValue();
    this.addUserForm = this.formBuilder.group({
      first: [''],
      last: [''],
      rank: ['Full Professor'],
      college: ['CASH'],
      tenured: [false],
      admin: [false],
      soe: [false],
      gender: ['M']
    });
    this.apiService.getCommitteesYears().subscribe(
      years => {
        years.sort();
        this.yearService.setYears(years)
        this.yearService.setValue(years[0]);
        this.year.subscribe( value => {
          if (value !== '') {
            this.apiService.getFacultyByYear(value).subscribe(
              res => {
                this.faculties = res;
                this.pageNum = Math.ceil(res.length / 20);
                this.apiService.getCommitteesByPagation(value , 0, 20).subscribe(
                  res2 => {
                    this.searchedFaculties = res2;
                    this.currentPage = 0;
                  }
                );
              }
            );
          }
        });
      }
    );
  }

  ngAfterViewInit() {
    Feather.replace();
  }

  changed($event: any) {
    this.searchTextChanged.next();
  }
  edit(i) {
    this.editIndex = i;
    this.editFirst = this.searchedFaculties[i].first;
    this.editLast = this.searchedFaculties[i].last;
    this.editRank = this.searchedFaculties[i].rank;
    this.editCollege = this.searchedFaculties[i].college;
    this.editTenured = this.searchedFaculties[i].tenured;
    this.editSoe = this.searchedFaculties[i].soe;
    this.editAdmin = this.searchedFaculties[i].adminResponsibility;
    if (this.searchedFaculties[i].gender === 'F') {
      this.editGender = 'Female';
    }
    else {
      this.editGender = 'Male';
    }
  }
  // searchFaculty($event) {
  //   this.searchTextChanged.next($event.target.value);
  // }
  clear() {
    this.first = '';
    this.last = '';
    this.rank = 'None';
    this.college = 'None';
    this.tenured = 'None';
    this.soe = 'None';
    this.admin = 'None';
    this.gender = 'None';
    this.yearService.getValue().subscribe(
      value => {
        this.apiService.getCommitteesByPagation(value , 0, 20).subscribe(
          res => {
            this.searchedFaculties = res;
            this.currentPage = 0;
          }
        );
      }
    );
  }
   modifyUser() {
    this.apiService.modifyUser(this.editFirst, this.editLast, this.editRank, this.editCollege, Number(this.editTenured), Number(this.editSoe), Number(this.editAdmin), this.editGender.substring(0, 1), this.searchedFaculties[this.editIndex].id).subscribe(
      res => {
        this.searchedFaculties[this.editIndex] = res;
        this.editIndex = -1;
      }
    );
   }

  cancleEdit() {
    this.editIndex = -1;
  }

  deleteUser() {
    this.apiService.deleteUser(this.searchedFaculties[this.deleteindex].id).subscribe(
      res => {
        this.searchedFaculties.splice(this.deleteindex , 1);
        this.deleteindex = -1;
      }
    );
  }

  delete(i) {
    this.deleteindex = i;
  }

  getPageItem(pageIndex) {
    if (this.searched) {
      this.currentPage = pageIndex;
      this.searchedFaculties = [...this.filteredFaculities.slice(20 * pageIndex , this.filteredFaculities.length - 1)];
    } else {
    this.yearService.getValue().subscribe(
      value => {
        this.apiService.getCommitteesByPagation(value , pageIndex, 20).subscribe(
          res => {
            this.searchedFaculties = res;
            this.currentPage = pageIndex;
          }
        );
      }
    );
    }
  }

  nextPage() {
    if (this.currentPage === this.pageNum - 1) {
      alert('The page is last page');
    } else {
    this.yearService.getValue().subscribe(
      value => {
        this.apiService.getCommitteesByPagation(value , this.currentPage + 1, 20).subscribe(
          res => {
            this.searchedFaculties = res;
            this.currentPage ++;
          }
        );
      }
    );
  }
  }

  prevoiusPage() {
    if (this.currentPage === 0) {
      alert('The page is first page');
    } else {
      this.yearService.getValue().subscribe(
        value => {
          this.apiService.getCommitteesByPagation(value , this.currentPage - 1, 20).subscribe(
            res => {
              this.searchedFaculties = res;
              this.currentPage --;
            }
          );
        }
      );
    }
  }

  firstPage() {
    this.yearService.getValue().subscribe(
      value => {
        this.apiService.getCommitteesByPagation(value , 0, 20).subscribe(
          res => {
            this.searchedFaculties = res;
            this.currentPage = 0;
          }
        );
      }
    );
  }

  lastPage() {
    this.yearService.getValue().subscribe(
      value => {
        this.apiService.getCommitteesByPagation(value , this.pageNum - 1, 20).subscribe(
          res => {
            this.searchedFaculties = res;
            this.currentPage  = this.pageNum - 1;
          }
        );
      }
    );
  }

  getUserCommittees(i) {
    this.introductionExpand = 1;
    this.dutyExpand = 1;
    this.critreriaExpand = 1 ;
    this.showVolunteeredCommittees = false;
    this.showAssignedCommittees = false;
    this.selectedUserId = this.searchedFaculties[i].id;
    this.apiService.getUserAssignedCommittees(this.searchedFaculties[i].id, this.yearService.getValue()).subscribe(
      committees => {
        this.userAssignedCommittees = committees;
      }
    )
    this.apiService.getUserVolunteeredCommittees(this.searchedFaculties[i].id).subscribe(
      committees => {
        alert(this.searchedFaculties[i].id)
        this.userVolunteeredCommittees = committees;
      }
    );
    // this.userAssignedCommittees = ;
  }


  expandCriteria() {
    this.critreriaExpand = 1 - this.critreriaExpand;
  }

  expandDuty() {
    this.dutyExpand = 1 - this.dutyExpand;
  }

  expandIntroduction() {
    this.introductionExpand = 1 - this.introductionExpand;
  }

  removeUser(committeeId) {
    this.apiService.removeUserFromCommittee(committeeId, this.selectedUserId).subscribe(
      value => {
        this.showVolunteeredCommittees = false;
        this.showAssignedCommittees = false;
        for (let i = 0; i < this.userAssignedCommittees.length; i++) {
          if (this.userAssignedCommittees[i].id === committeeId) {
            console.log(this.userAssignedCommittees);
            this.userAssignedCommittees.splice(i, 1);
            i--;
          }
        }
      }
    );
  }

  AssignUser(committeeId) {
    this.apiService.assignUserToOneCommittee(committeeId, this.selectedUserId).subscribe(
      value => {
        this.showVolunteeredCommittees = false;
        this.showAssignedCommittees = false;
        for (let i = 0; i < this.userVolunteeredCommittees.length; i++) {
          if (this.userVolunteeredCommittees[i].id === committeeId) {
            this.userAssignedCommittees.push(this.userVolunteeredCommittees[i])
            this.userVolunteeredCommittees.splice(i, 1);
            i--;
          }
        }
      }
    );
  }

  get f() { return this.addUserForm.controls; }

  addFaculty() {
    this.apiService.createUser(this.f.first.value, this.f.last.value, this.f.rank.value,
      this.f.college.value, Number(this.f.tenured.value), Number(this.f.admin.value), Number(this.f.soe.value), this.f.gender.value).subscribe();
  }
}
