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
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { FacultyComponent } from './faculty/faculty.component';
import { CommitteesDetailsComponent } from './committees-details/committees-details.component';
import { CommitteesListComponent } from './committees-list/committees-list.component';
import { ReportComponent } from './report/report.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {GoogleChartsModule} from 'angular-google-charts';
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
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
