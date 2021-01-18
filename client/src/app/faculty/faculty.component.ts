import {Component, OnInit} from '@angular/core';
import { ApiService } from '../service/api.service';
import { User } from '../models/user';
import { debounceTime } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { YearService } from '../service/year.service';
import { Papa } from 'ngx-papaparse';
import { Committee } from '../models/committee';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../service/authentication.service';

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

  userVolunteeredCommittees: Committee[];
  userAssignedCommittees: Committee[];

  editIndex: number;
  deleteIndex: number;
  file: any;

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
  ranks = ['Assistant', 'Associate', 'Full'];
  genders = ['F', 'M'];
  colleges = ['CASH', 'CBA', 'CSH'];
  relation: FormGroup;

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
    console.log(this.queries);

    this.apiService.getFacultyByYearAndQueries(this.yearService.getYearValue, this.queries, this.page.number).subscribe(
      value => {
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
      dept: [''],
      chair: [''],
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
    this.year.subscribe(year => {
      this.getFaculty();
      this.apiService.getFacultyByYear(year).subscribe();
      this.apiService.getGendersByYear(year).subscribe(
        genders => {
          genders.forEach(
            gender => {
              this.options.gender.push(gender.name);
            }
          );
        }
      );
      this.apiService.getCollegeByYear(year).subscribe(
        colleges => {
          colleges.forEach(
            college => {
              this.options.college.push(college.name);
            }
          );
        }
      );
      this.apiService.getDeptByYear(year).subscribe(
        depts => {
          depts.forEach(
            dept => {
              this.options.dept.push(dept.name);
            }
          );
        }
      );
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
    if (this.faculties[i].gender.name === 'F') {
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
}
