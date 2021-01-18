import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {YearService} from '../../service/year.service';
import {ApiService} from '../../service/api.service';
import {Department} from '../../models/department';
import {Gender} from '../../models/gender';

@Component({
  selector: 'app-add-gender',
  templateUrl: './add-gender.component.html',
  styleUrls: ['./add-gender.component.css']
})
export class AddGenderComponent implements OnInit {
  @Output() addGen = new EventEmitter();
  genName: string;
  constructor(private yearService: YearService, private apiService: ApiService) { }
  ngOnInit(): void {
  }

  addNewGen() {
    const gen = new Gender();
    gen.name = this.genName;
    gen.year = this.yearService.getYearValue;
    this.apiService.createGender(gen).subscribe(
      resGen => {
        this.addGen.emit();
      }
    );
  }
}
