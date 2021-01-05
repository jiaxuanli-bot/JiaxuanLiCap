import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ApiService} from '../../service/api.service';
import {YearService} from '../../service/year.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
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
      gender: ['M']
    });
  }
  ngOnInit(): void {
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
