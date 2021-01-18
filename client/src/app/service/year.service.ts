import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {ActivatedRoute, Router, ActivationEnd} from '@angular/router';
import { map, filter } from 'rxjs/operators';
import {ApiService} from './api.service';
import {AuthenticationService} from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class YearService {
  private pos: BehaviorSubject<string>;
  private currentYear: BehaviorSubject<string>;
  private yearForCommitteePage: BehaviorSubject<string>;
  private years: BehaviorSubject<string[]>;
  private path: string;
  private committeeId: string;
  constructor(public authentication: AuthenticationService, private router: Router,
              private route: ActivatedRoute, private apiService: ApiService) {
    this.pos = new BehaviorSubject<string>('');
    this.years = new BehaviorSubject<string[]>([]);
    this.yearForCommitteePage = new BehaviorSubject<string>('');
    this.currentYear = new BehaviorSubject<string>('');
    this.route.fragment.subscribe((fragment: string) => {
      if (/^[1-9]\d{3}$/.test(fragment)) {
        this.currentYear.next(fragment);
      }
    });
    this.router.events
      .pipe(
        filter(e => (e instanceof ActivationEnd) ),
        map(e => e instanceof ActivationEnd ? e.snapshot : {} )
      )
      .subscribe( state => {
        // @ts-ignore
        this.path = state && state.url && state.url[0] && state.url[0].path;
        // @ts-ignore
        if (this.path === 'committees' && state.url[1] !== undefined && state.url[1] !== null) {
          // @ts-ignore
          this.apiService.getCommitteeYears(state.url[1]).subscribe(
            value => {
              // @ts-ignore
              this.committeeId = state.url[1];
              this.years.next(value);
              if (this.currentYear.value === undefined || this.currentYear.value === '' || !value.includes(this.currentYear.value)) {
                this.currentYear.next(value[0]);
                window.location.hash = this.currentYear.value;
              }
            }
          );
        } else if (this.path === 'survey') {
          this.committeeId = null;
          this.apiService.getUserYears(this.authentication.currentUserValue.email).subscribe(
            value => {
              this.years.next(value);
              if (this.currentYear.value === undefined || this.currentYear.value === '' || !value.includes(this.currentYear.value)) {
                this.currentYear.next(value[0]);
                window.location.hash = this.currentYear.value;
              }
            }
          );
        } else if (this.path !== 'uwl') {
          this.committeeId = null;
          this.apiService.getYears().subscribe(
            value => {
              this.years.next(value);
              if (this.currentYear.value === undefined || this.currentYear.value === '' || !value.includes(this.currentYear.value)) {
                this.currentYear.next(value[0]);
                window.location.hash = this.currentYear.value;
              }
            }
          );
        }
      });
  }
  setValue(newValue): void {
    if (this.path === 'committees' && this.committeeId !== undefined && this.committeeId !== null) {
      this.yearForCommitteePage.next(newValue);
    } else {
      this.currentYear.next(newValue);
    }
  }
  committeeGetValue(): Observable<string> {
    return this.yearForCommitteePage.asObservable();
  }
  getValue(): Observable<string> {
    //  alert(this.committeeId);
    return this.currentYear.asObservable();
  }
  public get getYearValue(): string {
    return this.currentYear.value;
  }
  public get getYears() {
    return this.years.asObservable();
  }
}
