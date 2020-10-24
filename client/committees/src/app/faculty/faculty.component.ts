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
  userVolunteeredCommittees: Committee[];
  userAssignedCommittees: Committee[];
  currentPage = 0;
  pageNum  = 1;
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
  first = '';
  last = '';
  rank = 'None';
  college = 'None';
  tenured = 'None';
  soe = 'None';
  admin = 'None';
  gender = 'None';
  queries = '';
  searchTextChanged = new Subject<string>();
  searchedFaculties: User[];
  year: Observable<string>;
  addUserForm: FormGroup;
  queryPrototype = {
    first: 'first',
    last: 'last',
    rank: 'rank',
    college: 'college',
    tenured: 'tenured',
    soe: 'soe',
    admin: 'admin_responsibility',
    gender: 'gender'
  };
  constructor(public authentication: AuthenticationService, private yearService: YearService, private apiService: ApiService, private router: Router,  private formBuilder: FormBuilder) {
    this.searchTextChanged.pipe(debounceTime(1000)).subscribe(() => {
      this.queries = '';
      if (this.first.length === 0 && this.last.length === 0 && this.rank === 'None' && this.college === 'None' && this.tenured === 'None' && this.soe === 'None' && this.admin === 'None' && this.gender === 'None') {
        this.year.subscribe(
          value => {
            if (value !== '') {
              this.apiService.getFacultyByYear(value).subscribe(
                res => {
                  this.faculties = res.content;
                  this.pageNum = res.totalPages;
                  this.searchedFaculties = res.content;
                  this.apiService.getCommitteesByPagation(value , 0).subscribe(
                    res2 => {
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
          this.queries += '&' + this.queryPrototype.first + '=' + this.first;
      }
      if (this.last.length > 0) {
          this.queries += '&' + this.queryPrototype.last + '=' + this.last;
      }
      if (this.rank !== 'None') {
        if (this.rank === 'Full Professor') {
          this.queries += '&' + this.queryPrototype.rank + '=Full';
        } else if (this.rank === 'Associate Professor') {
          this.queries += '&' + this.queryPrototype.rank + '=Associate';
        } else {
          this.queries += '&' + this.queryPrototype.rank + '=Assistant';
        }
      }
      if (this.college !== 'None') {
          this.queries += '&' + this.queryPrototype.college + '=' + this.college;
      }
      if (this.tenured !== 'None') {
          this.queries += '&' + this.queryPrototype.tenured + '=' + this.tenured;
      }
      if (this.soe !== 'None') {
          this.queries += '&' + this.queryPrototype.soe + '=' + this.soe;
      }
      if (this.admin !== 'None') {
          this.queries += '&' + this.queryPrototype.admin + '=' + this.admin;
      }
      if (this.gender !== 'None') {
          this.queries += '&' + this.queryPrototype.gender + '=' + this.gender.substring(0, 1);
      }
      if (this.queries.length > 0) {
        this.apiService.getFacultyByYearAndQueries(this.yearService.getYearValue , this.queries, 0).subscribe(
          value => {
            this.searchedFaculties = value.content;
            this.pageNum = value.totalPages;
            this.searchedFaculties = value.content;
            this.currentPage = 0;
          }
        );
      }
    });
  }

  ngOnInit(): void {
    this.yearService.setPos('faculty');
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
                this.faculties = res.content;
                this.pageNum = res.totalPages;
                this.searchedFaculties = res.content;
                this.currentPage = 0;
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
        this.apiService.getCommitteesByPagation(value , 0).subscribe(
          res => {
            this.searchedFaculties = res.content;
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
    if (this.queries.length > 0) {
      this.apiService.getFacultyByYearAndQueries(this.yearService.getYearValue , this.queries, pageIndex).subscribe(
        value => {
          this.searchedFaculties = value.content;
          this.currentPage = pageIndex;
        }
      );
    } else {
      this.yearService.getValue().subscribe(
        value => {
          this.apiService.getCommitteesByPagation(value , pageIndex ).subscribe(
            res => {
              this.searchedFaculties = res.content;
              this.currentPage = pageIndex;
            }
          );
        }
      );
    }
  }

  nextPage() {
    if (this.currentPage !== this.pageNum - 1) {
      if (this.queries.length > 0) {
        this.apiService.getFacultyByYearAndQueries(this.yearService.getYearValue , this.queries, this.currentPage + 1).subscribe(
          value => {
            this.searchedFaculties = value.content;
            this.currentPage ++;
          }
        );
      } else {
        this.yearService.getValue().subscribe(
          value => {
            this.apiService.getCommitteesByPagation(value , this.currentPage + 1).subscribe(
              res => {
                this.searchedFaculties = res.content;
                this.currentPage ++;
              }
            );
          }
        );
      }
    }
  }

  prevoiusPage() {
    if (this.currentPage !== 0) {
    if (this.queries.length > 0) {
      this.apiService.getFacultyByYearAndQueries(this.yearService.getYearValue , this.queries, this.currentPage - 1).subscribe(
        value => {
          this.searchedFaculties = value.content;
          this.currentPage --;
        }
      );
    } else {
        this.yearService.getValue().subscribe(
          value => {
            this.apiService.getCommitteesByPagation(value , this.currentPage - 1).subscribe(
              res => {
                this.searchedFaculties = res.content;
                this.currentPage --;
              }
            );
          }
        );
      }
    }
  }

  firstPage() {
    if (this.queries.length > 0) {
      this.apiService.getFacultyByYearAndQueries(this.yearService.getYearValue , this.queries,  0).subscribe(
        value => {
          this.searchedFaculties = value.content;
          this.currentPage  = 0;
        }
      );
    } else {
      this.yearService.getValue().subscribe(
        value => {
          this.apiService.getCommitteesByPagation(value , 0).subscribe(
            res => {
              this.searchedFaculties = res.content;
              this.currentPage = 0;
            }
          );
        }
      );
    }
  }

  lastPage() {
    if (this.queries.length > 0) {
      this.apiService.getFacultyByYearAndQueries(this.yearService.getYearValue , this.queries, this.pageNum - 1).subscribe(
        value => {
          this.searchedFaculties = value.content;
          this.currentPage = this.pageNum - 1;
        }
      );
    } else {
      this.yearService.getValue().subscribe(
        value => {
          this.apiService.getCommitteesByPagation(value , this.pageNum - 1).subscribe(
            res => {
              this.searchedFaculties = res.content;
              this.currentPage  = this.pageNum - 1;
            }
          );
        }
      );
    }
  }

  getUserCommittees(i) {
    this.apiService.getUserAssignedCommittees(this.searchedFaculties[i].id).subscribe(
      committees => {
        this.userAssignedCommittees = committees;
      }
    )
    this.apiService.getUserVolunteeredCommittees(this.searchedFaculties[i].id).subscribe(
      committees => {
        this.userVolunteeredCommittees = committees;
      }
    );
    // this.userAssignedCommittees = ;
  }

  get f() { return this.addUserForm.controls; }

  addFaculty() {
    this.apiService.createUser(this.f.first.value, this.f.last.value, this.f.rank.value,
      this.f.college.value, Number(this.f.tenured.value), Number(this.f.admin.value), Number(this.f.soe.value), this.f.gender.value).subscribe();
  }
}
