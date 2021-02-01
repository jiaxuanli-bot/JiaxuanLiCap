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
  private currentYear: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private yearForCommitteePage: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private years: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  private path: string;
  private committeeId: string;

  constructor(public authentication: AuthenticationService, private router: Router,
              private route: ActivatedRoute, private apiService: ApiService) {
    this.route.fragment.subscribe((fragment: string) => {
      if (/^[1-9]\d{3}$/.test(fragment)) {
        this.currentYear.next(fragment);
      }
    });

    this.router.events
      .pipe( filter(e => (e instanceof ActivationEnd) ),
             map(e => e instanceof ActivationEnd ? e.snapshot : {} )
      ).subscribe( state => {
      });
  }


  setValue(newValue): void {
    if (this.path === 'committees' && this.committeeId !== undefined && this.committeeId !== null) {
      this.yearForCommitteePage.next(newValue);
    } else {
      window.location.hash = newValue;
      this.currentYear.next(newValue);
    }
  }

  committeeGetValue(): Observable<string> {
    return this.yearForCommitteePage.asObservable();
  }

  getValue(): Observable<string> {
    return this.currentYear.asObservable();
  }

  public get getYearValue(): string {
    return this.currentYear.value;
  }

  public setYears(years: string[]) {
    this.years.next(years);
  }

  public get getYears() {
    return this.years.asObservable();
  }
}
