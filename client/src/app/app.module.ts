import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {RouterModule} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Interceptor} from './utilities/interceptor';
import { SlideBarComponent } from './slide-bar/slide-bar.component';
import { FacultyComponent } from './faculty/faculty.component';
import { CommitteesDetailsComponent } from './committees-details/committees-details.component';
import { CommitteesListComponent } from './committees-list/committees-list.component';
import { ReportComponent } from './report/report.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {GoogleChartsModule} from 'angular-google-charts';
import { UWLComponent } from './uwl/uwl.component';
import { CancelModifyComponent } from './faculty/cancel-modify/cancel-modify.component';
import { DeleteUserComponent } from './faculty/delete-user/delete-user.component';
import { ModifyUserComponent } from './faculty/modify-user/modify-user.component';
import { AddUserComponent } from './faculty/add-user/add-user.component';
import { AddUserFromCSVComponent } from './faculty/add-user-from-csv/add-user-from-csv.component';
@NgModule({

  imports: [
    GoogleChartsModule,
    NgbModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    AppRoutingModule,
    RouterModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule
  ],

  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SlideBarComponent,
    FacultyComponent,
    CommitteesDetailsComponent,
    CommitteesListComponent,
    ReportComponent,
    UWLComponent,
    CancelModifyComponent,
    DeleteUserComponent,
    ModifyUserComponent,
    AddUserComponent,
    AddUserFromCSVComponent,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
