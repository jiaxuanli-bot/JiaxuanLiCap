import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../models/user';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class YearService {
  private pos: BehaviorSubject<string>;
  private currentYear: BehaviorSubject<string>;
  private yearForCommitteePage: BehaviorSubject<string>;
  private years: BehaviorSubject<string[]>;
  constructor(private router: Router) {
    this.pos = new BehaviorSubject<string>('');
    this.years = new BehaviorSubject<string[]>([]);
    this.currentYear = new BehaviorSubject<string>('');
    this.yearForCommitteePage = new BehaviorSubject<string>('');
  }
  setYears(years): void {
    this.years.next(years);
  }
  getYears(): Observable<string[]> {
    return this.years.asObservable();
  }
  setValue(newValue): void {
    //activate class
    const regex = /^\/committees\/[1-9]\d*$/
    if (this.router.url.match(regex) !== null  ) {
      this.yearForCommitteePage.next(newValue);
    } else {
      this.currentYear.next(newValue);
    }
  }
  getValue(): Observable<string> {
    const regex = /^\/committees\/[1-9]\d*$/
    if (this.router.url.match(regex) !== null  ) {
      return this.yearForCommitteePage.asObservable();
    } else {
      return this.currentYear.asObservable();
    }
  }
  public get getYearValue(): string {
    return this.currentYear.value;
  }
}
