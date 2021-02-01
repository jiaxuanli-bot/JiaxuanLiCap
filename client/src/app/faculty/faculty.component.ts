import {Component, OnInit} from '@angular/core';
import { ApiService } from '../service/api.service';
import { User } from '../models/user';
import { debounceTime } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { YearService } from '../service/year.service';
import { Papa } from 'ngx-papaparse';
import { Committee } from '../models/committee';
import { Router } from '@angular/router';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { AuthenticationService } from '../service/authentication.service';
import {College} from '../models/college';
import {Gender} from '../models/gender';
import {Department} from '../models/department';

import { faEdit, faCheckCircle, faTrash, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import {TopBarService} from "../service/top-bar.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddUserFromCSVComponent} from "./add-user-from-csv/add-user-from-csv.component";
import {AddUserComponent} from "./add-user/add-user.component";
import {DeleteUserComponent} from "./delete-user/delete-user.component";
import {ModifyUserComponent} from "./modify-user/modify-user.component";

@Component({
  selector: 'app-faculty',
  templateUrl: './faculty.component.html',
  styleUrls: ['./faculty.component.css']
})
export class FacultyComponent implements OnInit {
  options = {
    rank: ['', 'Associate Professor', 'Assistant Professor', 'Full Professor'],
    college: ['', 'CASH', 'CBA', 'CSH'],
    tenured: ['', 'Yes', 'No'],
    soe: ['', 'Yes', 'No'],
    admin: ['', 'Yes', 'No'],
    chair: ['', 'Yes', 'No'],
    gender: [''],
    dept: ['']
  };

  page: any = {
    first : false,
    last : false,
    number : 0,
    totalPages : 0
  };

  icons = {
    faCheckCircle : faCheckCircle,
    faTrash: faTrash,
    faEdit: faEdit,
    faInfoCircle: faInfoCircle
  }

  userVolunteeredCommittees: Committee[];
  userAssignedCommittees: Committee[];

  editIndex: number;
  deleteIndex: number;
  file: any;
  searchFormChanged: boolean =  false;


  queries = {
    first: '',
    last: '',
    rank: '',
    college: '',
    tenured: '',
    soe: '',
    admin: '',
    gender: '',
    dept: '',
    chair: '',
  };
  faculties: User[];
  facultiesForm: FormGroup;
  searchTextChanged = new Subject<string>();
  year: Observable<string>;
  genders: Gender[];
  colleges: College[];
  depts: Department[];
  editedUser: User;
  constructor(
    private modalService: NgbModal,
    public authentication: AuthenticationService,
    private yearService: YearService,
    private apiService: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    private topBarService: TopBarService,
    private papa: Papa) {
    this.searchTextChanged.pipe(debounceTime(1000)).subscribe( () => this.getFaculty() );
    this.apiService.getYears().subscribe( years => {
      this.yearService.setYears( years );
    });
  }

  getFaculty() {
    this.queries = {
      first: '',
      last: '',
      rank: '',
      college: '',
      tenured: '',
      soe: '',
      admin: '',
      gender: '',
      dept: '',
      chair: '',
    };

    // @ts-ignore
    this.queries = Object.keys(this.facultiesForm.controls)
      .filter(key => this.facultiesForm.controls[key].value)
      .reduce((acc, key) => {
        if (key === `rank`) {
          acc[key] = this.facultiesForm.controls[key].value.split(' ')[0];
        } else {
          acc[key] = this.facultiesForm.controls[key].value;
        }
        return acc;
      }, {});

      if( this.searchFormChanged ) {
        this.page.number = 0;
      }

    this.apiService.getFacultyByYearAndQueries(this.yearService.getYearValue, this.queries, this.page.number).subscribe(
      value => {
        this.searchFormChanged = false;
        this.faculties = value.content;
        this.page = {
          first : value.first,
          last : value.last,
          totalPages : value.totalPages,
          number : value.number
        };
      }
    );
  }

  ngOnInit(): void {
    this.topBarService.setTopBarName('Users');
    this.facultiesForm = this.formBuilder.group({
      first: [''],
      last: [''],
      rank: [''],
      college: [''],
      tenured: [''],
      admin: [''],
      soe: [''],
      gender: [''],
      dept: [''],
      chair: [''],
    });
    this.year = this.yearService.getValue();
    this.year.subscribe(year => {
      this.getFaculty();
      this.apiService.getFacultyByYear(year).subscribe();
    });
  }

  changed($event: any): void {
    this.searchTextChanged.next();
    this.searchFormChanged = true;
  }
  clear(): void {
    Object.keys(this.facultiesForm.controls).forEach( key => this.facultiesForm.controls[key].setValue(''));
    this.getFaculty();
  }

  deleteUser(): void {
    this.apiService.deleteUser(this.faculties[this.deleteIndex].id).subscribe(
      res => {
        this.gotoPage(this.page.number);
      }
    );
  }

  delete(i: number): void {
    this.deleteIndex = i;
    const modalRef = this.modalService.open(DeleteUserComponent, {backdropClass: 'light-blue-backdrop'});
    modalRef.componentInstance.pageNum = this.page.number;
    modalRef.componentInstance.parentComponent = this;
  }

  gotoPage(pageIndex: number): void {
    this.page.number = pageIndex;
    this.getFaculty();
  }

  nextPage(): void {
    if ( !this.page.last ) { this.page.number++; }
    this.getFaculty();
  }

  prevoiusPage(): void {
    if ( !this.page.first ) { this.page.number--; }
    this.getFaculty();
  }

  firstPage(): void {
    this.page.number = 0;
    this.getFaculty();
  }

  lastPage(): void {
    this.page.number = this.page.totalPages - 1;
    this.getFaculty();
  }

  getUserCommittees(i: number): void {
    this.apiService.getUserAssignedCommittees(this.faculties[i].id).subscribe(
      committees => {
        this.userAssignedCommittees = committees;
      }
    );
    this.apiService.getUserVolunteeredCommittees(this.faculties[i].id).subscribe(
      committees => {
        this.userVolunteeredCommittees = committees;
      }
    );
  }
  uploadCSV() {
    const modalRef = this.modalService.open(AddUserFromCSVComponent, {backdropClass: 'light-blue-backdrop'});
    modalRef.componentInstance.pageNum = this.page.number;
    modalRef.componentInstance.parentComponent = this;
  }

  addFaculty() {
    const modalRef = this.modalService.open(AddUserComponent, {backdropClass: 'light-blue-backdrop'});
    modalRef.componentInstance.parentComponent = this;
  }

  edit(faculty: User) {
    const modalRef = this.modalService.open(ModifyUserComponent, {backdropClass: 'light-blue-backdrop'});
    modalRef.componentInstance.parentComponent = this;
    modalRef.componentInstance.modifyUser = faculty;
    modalRef.componentInstance.pageNum = this.page.number;
  }
}
