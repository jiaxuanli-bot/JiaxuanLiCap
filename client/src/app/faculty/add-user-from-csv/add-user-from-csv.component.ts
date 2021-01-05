import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Papa, ParseResult} from 'ngx-papaparse';
import {FormBuilder, FormGroup} from '@angular/forms';
import {User} from '../../models/user';
import {ApiService} from '../../service/api.service';
import {Role} from '../../models/role';
import {YearService} from '../../service/year.service';

@Component({
  selector: 'app-add-user-from-csv',
  templateUrl: './add-user-from-csv.component.html',
  styleUrls: ['./add-user-from-csv.component.css']
})
export class AddUserFromCSVComponent implements OnInit {
  @Output() addUserFromCSV = new EventEmitter();
  selectedFile: any;
  file: any;
  fileHeaders = new Array<any>();
  propertyMapFileName = new Map<any, any>();
  fileNameMapProperty = new Map<any, any>();
  uploadedFaculties: User[];
  csvProperties = ['first', 'last', 'rank', 'college', 'tenured', 'soe', 'adminResponsibility', 'gender', 'email'];
  relation: FormGroup;
  constructor(private papa: Papa, private formBuilder: FormBuilder, private apiService: ApiService, private yearService: YearService) { }
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

  cancelSaveCSV() {
    this.selectedFile = null;
    this.propertyMapFileName = new Map<any, any>();
    this.fileNameMapProperty = new Map<any, any>();
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
              this.addUserFromCSV.emit();
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
}
