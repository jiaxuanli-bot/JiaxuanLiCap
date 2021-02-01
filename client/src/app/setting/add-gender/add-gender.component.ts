import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {YearService} from '../../service/year.service';
import {ApiService} from '../../service/api.service';
import {Department} from '../../models/department';
import {Gender} from '../../models/gender';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-gender',
  templateUrl: './add-gender.component.html',
  styleUrls: ['./add-gender.component.css']
})
export class AddGenderComponent implements OnInit {
  parentComponent: any;
  genName: string;
  constructor(private yearService: YearService, private apiService: ApiService, public activeModal: NgbActiveModal) { }
  ngOnInit(): void {
  }

  addNewGen() {
    const gen = new Gender();
    gen.name = this.genName;
    gen.year = this.yearService.getYearValue;
    this.apiService.createGender(gen).subscribe(
      resGen => {
        this.parentComponent.getGen();
        this.activeModal.dismiss();
      }
    );
  }
}
