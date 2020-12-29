import { Component, OnInit } from '@angular/core';
import {ApiService} from '../service/api.service';
import {User} from '../models/user';
import {debounceTime} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {YearService} from '../service/year.service';
import { Papa } from 'ngx-papaparse';
import {Committee} from '../models/committee';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AuthenticationService} from '../service/authentication.service';
import {Role} from '../models/role';

@Component({
  selector: 'app-faculty',
  templateUrl: './faculty.component.html',
  styleUrls: ['./faculty.component.css']
})
export class FacultyComponent implements OnInit {
  userVolunteeredCommittees: Committee[];
  userAssignedCommittees: Committee[];
  currentPage = 0;
  pageNum  = 1;
  editIndex: number;
  deleteIndex: number;
  file: any;
  fileHeaders = new Array<any>();
  propertyMapFileName = new Map<any, any>();
  fileNameMapProperty = new Map<any, any>();
  facultiesProperty = ['first', 'last', 'rank', 'college', 'tenured', 'soe', 'adminResponsibility', 'gender', 'email'];
  queries = {
    first: '',
    last: '',
    rank: '',
    college: '',
    tenured: '',
    soe: '',
    admin: '',
    gender: ''
  };
  faculties: User[];
  facultiesForm: FormGroup;
  searchTextChanged = new Subject<string>();
  year: Observable<string>;
  addUserForm: FormGroup;
  ranks = ['Assistant', 'Associate', 'Full'];
  genders = ['F', 'M'];
  colleges = ['CASH', 'CBA', 'CSH'];
  relation: FormGroup;

  constructor(public authentication: AuthenticationService, private yearService: YearService, private apiService: ApiService,
              private router: Router,  private formBuilder: FormBuilder, private papa: Papa) {
    this.searchTextChanged.pipe( debounceTime(1000) ).subscribe(() => {
      if (this.facultiesForm.controls.first.value.length === 0 && this.facultiesForm.controls.last.value.length === 0 &&
        this.facultiesForm.controls.rank.value === 'None' && this.facultiesForm.controls.college.value === 'None' &&
        this.facultiesForm.controls.tenured.value === 'None' && this.facultiesForm.controls.soe.value === 'None' &&
        this.facultiesForm.controls.admin.value === 'None' && this.facultiesForm.controls.gender.value === 'None') {
        this.year.subscribe(
          value => {
            if (value !== '') {
              this.apiService.getFacultyByYear( value ).subscribe(
                res => {
                  this.faculties = res.content;
                  this.pageNum = res.totalPages;
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
      this.queries = {
        first: '',
        last: '',
        rank: '',
        college: '',
        tenured: '',
        soe: '',
        admin: '',
        gender: ''
      };
      let nonEmpty = false;
      // @ts-ignore
      this.queries =  Object.keys( this.facultiesForm.controls )
        .filter(key => this.facultiesForm.controls[key].value.length > 0
                && this.facultiesForm.controls[key].value !== 'None')
        .reduce( (acc, key) => {
                nonEmpty = true;
                acc[key] = this.facultiesForm.controls[key].value;
                return acc;
          }, {} );
      if (nonEmpty) {
        this.apiService.getFacultyByYearAndQueries(this.yearService.getYearValue, this.queries, 0).subscribe(
          value => {
            this.faculties = value.content;
            this.pageNum = value.totalPages;
            this.currentPage = 0;
          }
        );
      }
    });
  }

  ngOnInit(): void {
    this.relation = this.formBuilder.group({
      first: [''],
      last: [''],
      rank: [''],
      college: [''],
      tenured: [''],
      adminResponsibility: [''],
      soe: [''],
      gender: [''],
      email: ['']
    });
    this.facultiesForm = this.formBuilder.group({
      first: [''],
      last: [''],
      rank: ['None'],
      college: ['None'],
      tenured: ['None'],
      admin: ['None'],
      soe: ['None'],
      gender: ['None'],
      editFirst: [''],
      editLast: [''],
      editRank: [''],
      editCollege: [''],
      editTenured: [''],
      editAdmin: [''],
      editSoe: [''],
      editGender: ['']
    });
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
    this.apiService.getFacultyByYear(this.yearService.getYearValue).subscribe();
    this.year.subscribe( value => {
      if (value !== '') {
        this.apiService.getFacultyByYear(value).subscribe(
          res => {
            this.faculties = res.content;
            this.pageNum = res.totalPages;
            this.currentPage = 0;
          }
        );
      }
    });
  }

  changed($event: any): void {
    this.searchTextChanged.next();
  }

  edit(i: number): void {
    this.editIndex = i;
    this.facultiesForm.controls.editFirst.setValue(this.faculties[i].first);
    this.facultiesForm.controls.editLast.setValue(this.faculties[i].last);
    this.facultiesForm.controls.editRank.setValue(this.faculties[i].rank);
    this.facultiesForm.controls.editCollege.setValue(this.faculties[i].college);
    this.facultiesForm.controls.editTenured.setValue(this.faculties[i].tenured);
    this.facultiesForm.controls.editSoe.setValue(this.faculties[i].soe);
    this.facultiesForm.controls.editAdmin.setValue(this.faculties[i].adminResponsibility);
    if (this.faculties[i].gender === 'F') {
      this.facultiesForm.controls.editGender.setValue('Female');
    } else {
      this.facultiesForm.controls.editGender.setValue('Male');
    }
  }

  clear(): void {
    this.facultiesForm.controls.first.setValue('');
    this.facultiesForm.controls.last.setValue('');
    this.facultiesForm.controls.rank.setValue('None');
    this.facultiesForm.controls.college.setValue('None');
    this.facultiesForm.controls.tenured.setValue('None');
    this.facultiesForm.controls.soe.setValue('None');
    this.facultiesForm.controls.admin.setValue('None');
    this.facultiesForm.controls.gender.setValue('None');
    this.yearService.getValue().subscribe(
      value => {
        this.apiService.getCommitteesByPagation(value , 0).subscribe(
          res => {
            this.faculties = res.content;
            this.currentPage = 0;
          }
        );
      }
    );
  }
  ifFiltered(): boolean {
    return this.queries.gender.length > 0 || this.queries.admin.length > 0 || this.queries.college.length > 0
      || this.queries.first.length > 0 || this.queries.last.length > 0 || this.queries.rank.length > 0
      || this.queries.soe.length > 0 || this.queries.tenured.length > 0;
  }
  modifyUser(): void {
    this.apiService.modifyUser( this.facultiesForm.controls.editFirst.value,  this.facultiesForm.controls.editLast.value,
      this.facultiesForm.controls.editRank.value, this.facultiesForm.controls.editCollege.value,
      this.facultiesForm.controls.editTenured.value,  this.facultiesForm.controls.editSoe.value,
      this.facultiesForm.controls.editAdmin.value, this.facultiesForm.controls.editGender.value.substring(0, 1),
      this.faculties[this.editIndex].id).subscribe(
      res => {
        this.faculties[this.editIndex] = res;
        this.editIndex = -1;
      }
    );
  }

  cancleEdit(): void {
    this.editIndex = -1;
  }

  deleteUser(): void {
    this.apiService.deleteUser(this.faculties[this.deleteIndex].id).subscribe(
      res => {
        this.faculties.splice(this.deleteIndex , 1);
        this.deleteIndex = -1;
      }
    );
    this.getPageItem(this.currentPage);
  }

  delete(i: number): void {
    this.deleteIndex = i;
  }

  getPageItem(pageIndex: number): void {
    if (this.ifFiltered()) {
      this.apiService.getFacultyByYearAndQueries(this.yearService.getYearValue , this.queries, pageIndex).subscribe(
        value => {
          this.faculties = value.content;
          this.currentPage = pageIndex;
        }
      );
    } else {
      this.yearService.getValue().subscribe(
        value => {
          this.apiService.getCommitteesByPagation(value , pageIndex ).subscribe(
            res => {
              this.faculties = res.content;
              this.currentPage = pageIndex;
            }
          );
        }
      );
    }
  }

  nextPage(): void {
    if (this.currentPage !== this.pageNum - 1) {
      if (this.ifFiltered()) {
        this.apiService.getFacultyByYearAndQueries(this.yearService.getYearValue , this.queries, this.currentPage + 1).subscribe(
          value => {
            this.faculties = value.content;
            this.currentPage ++;
          }
        );
      } else {
        this.yearService.getValue().subscribe(
          value => {
            this.apiService.getCommitteesByPagation(value , this.currentPage + 1).subscribe(
              res => {
                this.faculties = res.content;
                this.currentPage ++;
              }
            );
          }
        );
      }
    }
  }

  prevoiusPage(): void {
    if (this.currentPage !== 0) {
    if (this.ifFiltered()) {
      this.apiService.getFacultyByYearAndQueries(this.yearService.getYearValue , this.queries, this.currentPage - 1).subscribe(
        value => {
          this.faculties = value.content;
          this.currentPage --;
        }
      );
    } else {
        this.yearService.getValue().subscribe(
          value => {
            this.apiService.getCommitteesByPagation(value , this.currentPage - 1).subscribe(
              res => {
                this.faculties = res.content;
                this.currentPage --;
              }
            );
          }
        );
      }
    }
  }

  firstPage(): void {
    if (this.ifFiltered()) {
      this.apiService.getFacultyByYearAndQueries(this.yearService.getYearValue , this.queries,  0).subscribe(
        value => {
          this.faculties = value.content;
          this.currentPage  = 0;
        }
      );
    } else {
      this.yearService.getValue().subscribe(
        value => {
          this.apiService.getCommitteesByPagation(value , 0).subscribe(
            res => {
              this.faculties = res.content;
              this.currentPage = 0;
            }
          );
        }
      );
    }
  }

  lastPage(): void {
    if (this.ifFiltered()) {
      this.apiService.getFacultyByYearAndQueries(this.yearService.getYearValue , this.queries, this.pageNum - 1).subscribe(
        value => {
          this.faculties = value.content;
          this.currentPage = this.pageNum - 1;
        }
      );
    } else {
      this.yearService.getValue().subscribe(
        value => {
          this.apiService.getCommitteesByPagation(value , this.pageNum - 1).subscribe(
            res => {
              this.faculties = res.content;
              this.currentPage  = this.pageNum - 1;
            }
          );
        }
      );
    }
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
  addFaculty(): void {
    this.apiService.createUser(this.addUserForm.controls.first.value, this.addUserForm.controls.last.value,
      this.addUserForm.controls.rank.value, this.addUserForm.controls.college.value, Number(this.addUserForm.controls.tenured.value),
      Number(this.addUserForm.controls.admin.value), Number(this.addUserForm.controls.soe.value), this.addUserForm.controls.gender.value).
    subscribe();
  }
  fileChanged(e) {
    this.file = e.target.files[0];
    this.propertyMapFileName = new Map<any, any>();
    this.fileNameMapProperty = new Map<any, any>();
    this.fileHeaders = new Array<any>();
  }
  uploadFile() {
    this.papa.parse(this.file, {
      preview: 1,
      complete: result => {
        let index = 0;
        result.data[0].forEach(
          value => {
            this.propertyMapFileName.set(this.facultiesProperty[index], value);
            this.fileHeaders.push(value);
            this.fileNameMapProperty.set(value, this.facultiesProperty[index]);
            index++;
          }
        );
        Object.keys( this.relation.controls ).forEach(
          value => {
            this.relation.controls[value].setValue( this.propertyMapFileName.get(value.toString()));
          });
      }
    });
  }
  propertyMapping(key: string) {
    const temp = this.propertyMapFileName.get(key);
    if (this.fileNameMapProperty.get(this.relation.controls[key].value) !== undefined) {
      this.relation.controls[this.fileNameMapProperty.get(this.relation.controls[key].value)].setValue('');
    }
    this.propertyMapFileName.set(key, this.relation.controls[key].value);
    this.propertyMapFileName.delete(this.fileNameMapProperty.get(this.relation.controls[key].value));
    this.fileNameMapProperty.delete(temp);
    this.fileNameMapProperty.set(this.relation.controls[key].value, key);
  }
  uploadFaculties() {
    const uploadedFaculties = new Array<User>();
    let stop = false;
    this.papa.parse(this.file, {
      header: true,
      complete: result => {
        console.log(result);
        for (const value of result.data) {
          let index = 0;
          const faculty = new User();
          const keys = Object.keys(value);
          for (const key of keys) {
            if (  this.isBooleanTypeProperty(this.fileNameMapProperty.get(this.fileHeaders[index]))) {
              if ( this.isBooleanType(value[key])) {
                faculty[`` + this.fileNameMapProperty.get(this.fileHeaders[index])] = Boolean(value[key]);
              } else {
                alert(this.fileHeaders[index] + ' is not mapping');
                stop = true;
                return false;
              }
            } else {
              faculty[`` + this.fileNameMapProperty.get(this.fileHeaders[index])] = value[key];
            }
            faculty.year = this.yearService.getYearValue;
            const role = new Role();
            role.role = 'Normal';
            const roles = [];
            roles.push(role);
            faculty.roles = roles;
            index++;
          }
          uploadedFaculties.push(faculty);
        }
        if (!stop) {
          console.log(uploadedFaculties);
          this.apiService.uploadFacultiesFromCSV(uploadedFaculties).subscribe(
            value => {
              this.getPageItem(this.currentPage);
            }
          );
        }
      }
    });
  }
  isBooleanTypeProperty(property: any): boolean {
    return property === 'tenured' || property === 'soe' || property === 'adminResponsibility';
  }
  isBooleanType(value: string): boolean {
    return value.toLowerCase() === 'true' || value.toLowerCase() === 'false'
  }
}
