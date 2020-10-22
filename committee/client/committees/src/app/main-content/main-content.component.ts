import { Component, OnInit } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import * as Feather from 'feather-icons';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.css']
})
export class MainContentComponent implements OnInit, AfterViewInit{

  constructor() { }

  ngAfterViewInit() {
    Feather.replace();
  }

  ngOnInit(): void {
  }

}
