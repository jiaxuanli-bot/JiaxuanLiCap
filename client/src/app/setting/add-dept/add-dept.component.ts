import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {YearService} from '../../service/year.service';
import {ApiService} from '../../service/api.service';
import {College} from '../../models/college';
import {Department} from '../../models/department';

@Component({
  selector: 'app-add-dept',
  templateUrl: './add-dept.component.html',
  styleUrls: ['./add-dept.component.css']
})
export class AddDeptComponent implements OnInit {
  @Output() addDept = new EventEmitter();
  deptName: string;
  constructor(private yearService: YearService, private apiService: ApiService) { }
  ngOnInit(): void {
  }

  addNewDept() {
    alert(this.deptName);
    const dept = new Department();
    dept.name = this.deptName;
    dept.year = this.yearService.getYearValue;
    this.apiService.createDept(dept).subscribe(
      resDept => {
        this.addDept.emit();
      }
    );
  }
}
