import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { User } from '../models/user';
import { debounceTime } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { YearService } from '../service/year.service';
import { Papa, ParseResult } from 'ngx-papaparse';
import { Committee } from '../models/committee';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../service/authentication.service';
import { Role } from '../models/role';

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
    gender: ['', 'F', 'M']
  }

  page : any = {
    first : false,
    last : false,
    number : 0,
    totalPages : 0
  }

  userVolunteeredCommittees: Committee[];
  userAssignedCommittees: Committee[];

  editIndex: number;
  deleteIndex: number;
  file: any;
  fileHeaders = new Array<any>();
  propertyMapFileName = new Map<any, any>();
  fileNameMapProperty = new Map<any, any>();

  csvProperties = ['first', 'last', 'rank', 'college', 'tenured', 'soe', 'adminResponsibility', 'gender', 'email'];
  uploadedFaculties: User[];

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
  selectedFile: any;

  constructor(public authentication: AuthenticationService, private yearService: YearService, private apiService: ApiService,
    private router: Router, private formBuilder: FormBuilder, private papa: Papa) {
    this.searchTextChanged.pipe(debounceTime(1000)).subscribe( () => this.getFaculty() );
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
      gender: ''
    };

    // @ts-ignore
    this.queries = Object.keys(this.facultiesForm.controls)
      .filter(key => this.facultiesForm.controls[key].value)
      .reduce((acc, key) => {
        acc[key] = this.facultiesForm.controls[key].value;
        return acc;
      }, {});

    this.apiService.getFacultyByYearAndQueries(this.yearService.getYearValue, this.queries, this.page.number).subscribe(
      value => {
        this.faculties = value.content;
        this.page = {
          first : value.first,
          last : value.last,
          totalPages : value.totalPages,
          number : value.number          
        }
      }
    );
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
      rank: [''],
      college: [''],
      tenured: [''],
      admin: [''],
      soe: [''],
      gender: [''],
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
      email: [''],
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

    this.year.subscribe(value => {
      this.getFaculty();
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
    Object.keys(this.facultiesForm.controls).forEach( key => this.facultiesForm.controls[key].setValue(''));
    this.getFaculty();
  }

  modifyUser(): void {
    this.apiService.modifyUser(this.facultiesForm.controls.editFirst.value, this.facultiesForm.controls.editLast.value,
      this.facultiesForm.controls.editRank.value, this.facultiesForm.controls.editCollege.value,
      this.facultiesForm.controls.editTenured.value, this.facultiesForm.controls.editSoe.value,
      this.facultiesForm.controls.editAdmin.value, this.facultiesForm.controls.editGender.value.substring(0, 1),
      this.faculties[this.editIndex].id).subscribe(
        res => {
          this.faculties[this.editIndex] = res;
          this.editIndex = -1;
        }
      );
  }

  cancelEdit(): void {
    this.editIndex = -1;
  }

  deleteUser(): void {
    this.apiService.deleteUser(this.faculties[this.deleteIndex].id).subscribe(
      res => {
        this.faculties.splice(this.deleteIndex, 1);
        this.deleteIndex = -1;
      }
    );

    this.gotoPage(this.page.number);
  }

  delete(i: number): void {
    this.deleteIndex = i;
  }

  gotoPage(pageIndex: number): void {
    this.page.number = pageIndex;
    this.getFaculty();
  }

  nextPage(): void {
    if( !this.page.last ) this.page.number++;
    this.getFaculty();
  }

  prevoiusPage(): void {
    if( !this.page.first ) this.page.number--;
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

  addFaculty(): void {
    this.apiService.createUser(this.addUserForm.controls.email.value, this.addUserForm.controls.first.value,
      this.addUserForm.controls.last.value, this.addUserForm.controls.rank.value, this.addUserForm.controls.college.value,
      Number(this.addUserForm.controls.tenured.value), Number(this.addUserForm.controls.admin.value),
      Number(this.addUserForm.controls.soe.value), this.addUserForm.controls.gender.value, this.yearService.getYearValue).
      subscribe();
  }

  fileChanged(e) {
    this.file = e.target.files[0];
    this.propertyMapFileName = new Map<any, any>();
    this.fileNameMapProperty = new Map<any, any>();
    this.fileHeaders = new Array<any>();
    this.parseCSVFile();
  }

  parseCSVFile() {
    this.papa.parse(this.file, {
      preview: 1,
      complete: result => {
        // iterate over every column in the first row
        result.data[0].forEach(
          header => {
            this.fileHeaders.push(header);
            this.csvProperties.forEach(
              value1 => {
                if (header.toString().toLowerCase() === value1.toString().toLowerCase()) {
                  this.propertyMapFileName.set(value1, header);
                  this.fileNameMapProperty.set(header, value1);
                  this.relation.controls['' + value1].setValue(header.toString());
                }
              }
            );
          }
        );
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
    this.uploadedFaculties = new Array<User>();
    this.papa.parse(this.file, {
      header: true,
      complete: result => {
        if (this.mapTheProperty(result)) {
          this.apiService.uploadFacultiesFromCSV(this.uploadedFaculties).subscribe(
            value => {
             this.getFaculty();
            }
          );
        }
      }
    });
  }

  mapTheProperty(result: ParseResult): boolean {
    for (const value of result.data) {
      let index = 0;
      const faculty = new User();
      const keys = Object.keys(value);
      for (const key of keys) {
        if (this.isBooleanTypeProperty(this.fileNameMapProperty.get(this.fileHeaders[index]))) {
          if (this.isBooleanType(value[key])) {
            faculty[`` + this.fileNameMapProperty.get(this.fileHeaders[index])] = Boolean(value[key]);
          } else {
            alert(this.fileHeaders[index] + ' is not mapping');
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
      this.uploadedFaculties.push(faculty);
    }
    return true;
  }

  isBooleanTypeProperty(property: any): boolean {
    return property === 'tenured' || property === 'soe' || property === 'adminResponsibility';
  }

  isBooleanType(value: string): boolean {
    return value.toLowerCase() === 'true' || value.toLowerCase() === 'false';
  }

  cancelSaveCSV() {
    this.selectedFile = null;
    this.propertyMapFileName = new Map<any, any>();
    this.fileNameMapProperty = new Map<any, any>();
  }
}