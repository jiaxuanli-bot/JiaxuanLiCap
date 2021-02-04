import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../service/api.service";
import {Committee} from "../../models/committee";

@Component({
  selector: 'app-get-user-committees',
  templateUrl: './get-user-committees.component.html',
  styleUrls: ['./get-user-committees.component.css']
})
export class GetUserCommitteesComponent implements OnInit {
  constructor(
    private apiService: ApiService
  ) { }
  userVolunteeredCommittees: Committee[];
  userAssignedCommittees: Committee[];
  ngOnInit(): void {
  }

}
