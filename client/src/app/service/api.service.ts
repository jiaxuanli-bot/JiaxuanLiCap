import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {AuthenticationService} from './authentication.service';
import {forkJoin, Observable} from 'rxjs';
import {AppConstants} from '../constants/app-constants';
import {Committee} from '../models/committee';
import {Survey} from '../models/survey';
import {User} from '../models/user';
import {HashedCommittees} from '../models/hashed-committees';
import {Page} from '../models/page';
import {Criteria} from '../models/criteria';
import {ApplicationComment} from '../models/application-comment';
import {Gender} from '../models/gender';
import {Dept} from '../models/dept';
import {College} from '../models/college';
import {CommitteeSummary} from '../models/committee-summary';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  constructor( private http: HttpClient, private authService: AuthenticationService) {}

  getCommittees(): Observable<Committee[]> {
    return this.http.get<Committee[]>( `${AppConstants.API_URL}/committees` );
  }

  getCommitteesByYear(year: string): Observable<CommitteeSummary[]> {
      return this.http.get<CommitteeSummary[]>( `${AppConstants.API_URL}/committees?startYear=${year}&endYear=${year}` );
  }

  getHashedCommitteesByYears(startYear: string, endYear: string): Observable<HashedCommittees> {
    return this.http.get<HashedCommittees>( `${AppConstants.API_URL}/hashedCommittees?startYear=${startYear}&endYear=${endYear}` );
  }


  getCommitteesYears(): Observable<string[]> {
    return this.http.get<string[]>(`${AppConstants.API_URL}/committees/years`, {} );
  }

  getCommitteeYears(id: string): Observable<string[]> {
    return this.http.get<string[]>(`${AppConstants.API_URL}/committees/${id}/years`, {} );
  }

  getSurveys(userId: string, year: string): Observable<Survey[]> {
    return this.http.get<Survey[]>(`${AppConstants.API_URL}/users/${userId}/enlistings?year=${year}`, { });
  }

  getFacultyByYear(year: string): Observable<Page> {
    return this.http.get<Page>(`${AppConstants.API_URL}/users?year=${year}`);
  }

  getFacultyByYearAndQueries(year: string, queries: any, pageNo: number) {
    let params = Object.keys( queries ).filter(value =>  queries[value].length > 0).reduce(
      (acc, val) => acc = acc.append(val, queries[val] ), new HttpParams() );
    params = params.append( 'year', year );
    params = params.append( 'pageNo', pageNo.toString() );
    return this.http.get<Page>(`${AppConstants.API_URL}/users`, { params : params } );
  }

  modifyUser(first: string, last: string, rank: string, college: string, tenured: boolean, soe: boolean,
             admin: boolean, gender: string, userId: string): Observable<User> {
    const data = {
      first : first,
      last : last,
      rank : rank,
      college : college,
      tenured : tenured,
      soe : soe,
      adminResponsibility : admin,
      gender : gender
    };
    return this.http.put<User>(`${AppConstants.API_URL}/users/${userId}`, data);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${AppConstants.API_URL}/users/${userId}`);
  }

  getUserVolunteeredCommittees(userId): Observable<Committee[]> {
    return this.http.get<Committee[]>(`${AppConstants.API_URL}/users/${userId}/enlistings/committees`, {} );
  }

  getUserAssignedCommittees(userId): Observable<Committee[]> {
    return this.http.get<Committee[]>(`${AppConstants.API_URL}/users/${userId}/committees`, {} );
  }

  assignUserToOneCommittee(committeeId, userId): Observable<any> {
    return  this.http.put(`${AppConstants.API_URL}/committees/${committeeId}/members/${userId}`, {} );
  }

  removeUserFromCommittee(committeeId, userId): Observable<User> {
    // @ts-ignore
    return this.http.delete(`${AppConstants.API_URL}/committees/${committeeId}/members/${userId}`);
  }

  getCommitteeMember(committeeId): Observable<User[]> {
    return  this.http.get<User[]>(`${AppConstants.API_URL}/committees/${committeeId}/members`);
  }
  getCommitteeById(committeeId): Observable<Committee> {
    return this.http.get<Committee>(`${AppConstants.API_URL}/committees/${committeeId}`);
  }

  getCommitteeVolunteers(committeeId): Observable<User[]> {
    return this.http.get<User[]>(`${AppConstants.API_URL}/committees/${committeeId}/volunteers/users`);
  }
  createUser(email, first, last, rank, college, tenured, admin, soe, gender, year): Observable<User> {
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    const data = {
      "email": email,
      "first" : first,
      "last" : last,
      "rank" : rank,
      "college" : college,
      "tenured" : tenured,
      "adminResponsibility" : admin,
      "soe" : soe,
      "gender" : gender,
      "roles": [{ "role" : "Normal"}],
      "year": year
    }
    return this.http.post <User> (`${AppConstants.API_URL}/users`, data, config);
  }
  uploadFacultiesFromCSV(faculties: User[]) {
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    const reqs2 = [];
    // tslint:disable-next-line:prefer-for-of
    faculties.forEach(
      value2 => {
        reqs2.push(this.http.post <User> (`${AppConstants.API_URL}/users`, value2, config));
      }
    );
    return  forkJoin(reqs2);
    // return this.http.post <User> (`${AppConstants.API_URL}/user`, faculties, config);
  }
  createCommittee(newCommittee: Committee) {
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    const data = {
      introduction: newCommittee.introduction,
      name: newCommittee.name,
      year: newCommittee.year,
      criteria: newCommittee.criteria,
      duties: newCommittee.duties,
    };
    return this.http.post <User> (`${AppConstants.API_URL}/committees`, data, config);
  }
  createSurvey(userId: string, committeeId: string, year: string): Observable<Survey> {
    return this.http.post<Survey>(`${AppConstants.API_URL}/users/${userId}/enlistings/${committeeId}?year=${year}`, {} );
  }

  createYear(year: string): Observable<string> {
    return this.http.post <string> (`${AppConstants.API_URL}/years/${year}`, {});
  }

  getCommitteeIdByYearAndName(year, name): Observable<string> {
    return this.http.get<string>(`${AppConstants.API_URL}/committees/${name}/years/${year}`, {} );
  }
  getUserYears(email): Observable<string[]> {
    return this.http.get<string[]>(`${AppConstants.API_URL}/users/email/${email}/years`, {} );
  }
  deleteCommittee(committeeId: string): Observable<Committee> {
    return this.http.delete<Committee>(`${AppConstants.API_URL}/committees/${committeeId}`);
  }
  getUnSatisfiedCriteria(committeeId: string): Observable<Criteria[]> {
    return this.http.get<Criteria[]>( `${AppConstants.API_URL}/committees/${committeeId}/unsatisfiedCriteria`);
  }
  createComment(comment: string, userId: string, committeeId: string) {
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    const data = {
      comment,
    };
    return this.http.post (`${AppConstants.API_URL}/users/${userId}/enlistings/committees/${committeeId}/comment`, data, config);
  }
  getComment(userId: string, committeeId: string): Observable<ApplicationComment> {
    return this.http.get<ApplicationComment>(`${AppConstants.API_URL}/users/${userId}/enlistings/committees/${committeeId}/comment`);
  }
  getGendersByYear(year: string): Observable<Gender[]> {
    return this.http.get<Gender[]>(`${AppConstants.API_URL}/setting/${year}/gender`);
  }
  getDeptByYear(year: string): Observable<Dept[]> {
    return this.http.get<Dept[]>(`${AppConstants.API_URL}/setting/${year}/dept`);
  }
  getCollegeByYear(year: string): Observable<College[]> {
    return this.http.get<College[]>(`${AppConstants.API_URL}/setting/${year}/college`);
  }
}
