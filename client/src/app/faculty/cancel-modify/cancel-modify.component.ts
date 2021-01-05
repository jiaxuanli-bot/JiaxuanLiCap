import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-cancel-modify',
  templateUrl: './cancel-modify.component.html',
  styleUrls: ['./cancel-modify.component.css']
})
export class CancelModifyComponent implements OnInit {
  @Input() editIndex: any;
  @Output() editIndexChange = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  cancelEdit() {
    this.editIndex = -1;
    this.editIndexChange.emit(this.editIndex);
  }
}
