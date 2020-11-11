import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import {HomeComponent} from './home/home.component';
import {FacultyComponent} from './faculty/faculty.component';
import {CommitteesDetailsComponent} from './committees-details/committees-details.component';
import {Survey} from './models/survey';
import {CommitteesListComponent} from './committees-list/committees-list.component';
import {ReportComponent} from './report/report.component';
import {AuthGuard} from './utilities/auth-guard';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'committees/:id', component: CommitteesDetailsComponent, canActivate: [AuthGuard]},
  { path: 'faculty', component: FacultyComponent, canActivate: [AuthGuard]},
  { path: 'survey', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'committees', component: CommitteesListComponent, canActivate: [AuthGuard]},
  { path: 'report', component : ReportComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
