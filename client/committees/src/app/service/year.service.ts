import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class YearService {
  private YearInfo: BehaviorSubject<string>;
  private yearForCommitteePage: BehaviorSubject<string>;
  private years: BehaviorSubject<string[]>;
  constructor() {
    this.years = new BehaviorSubject<string[]>([]);
    this.YearInfo = new BehaviorSubject<string>('');
    this.yearForCommitteePage = new BehaviorSubject<string>('');
  }
  setYears(years): void {
    this.years.next(years);
    console.log(years);
  }
  getYears(): Observable<string[]> {
    return this.years.asObservable();
  }
  setValue(newValue): void {
    this.YearInfo.next(newValue);
  }
  getValue(): Observable<string> {
    return this.YearInfo.asObservable();
  }
  public get currentYear(): string {
    return this.YearInfo.value;
  }

  setCYearValue(newValue): void {
    this.yearForCommitteePage.next(newValue);
  }
  getCYeaValue(): Observable<string> {
    return this.yearForCommitteePage.asObservable();
  }
  public get currentCommitteeYear(): string {
    return this.yearForCommitteePage.value;
  }
}
