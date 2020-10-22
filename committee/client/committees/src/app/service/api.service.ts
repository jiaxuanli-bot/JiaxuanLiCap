import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthenticationService} from './authentication.service';
import {Observable} from 'rxjs';
import {AppConstants} from '../constants/app-constants';
import {Committee} from '../models/committee';
import {Survey} from '../models/survey';
import {User} from '../models/user';
import {HashedCommittees} from '../models/hashed-committees';
import {Page} from '../models/page';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  constructor( private http: HttpClient, private authService: AuthenticationService) {}

  getCommittees(): Observable<Committee[]> {
    return this.http.get<Committee[]>( `${AppConstants.API_URL}/committees` );
  }

  getCommitteesByYear(year): Observable<Committee[]> {
      return this.http.get<Committee[]>( `${AppConstants.API_URL}/committees?startYear=${year}&endYear=${year}` );
  }

  getHashedCommitteesByYears(startYear, endYear): Observable<HashedCommittees> {
    return this.http.get<HashedCommittees>( `${AppConstants.API_URL}/hashedCommittees?startYear=${startYear}&endYear=${endYear}` );
  }

  createSurvey(userId, committeeId) {
    return this.http.post<Survey>(`${AppConstants.API_URL}/users/${userId}/enlistings/${committeeId}`, {} );
  }

  getCommitteesYears() {
    return this.http.get<string[]>(`${AppConstants.API_URL}/committees/years`, {} );
  }

  getCommitteeYears(id) {
    return this.http.get<string[]>(`${AppConstants.API_URL}/committees/${id}/years`, {} );
  }

  getSurveys(userId) {
    return this.http.get<Survey[]>(`${AppConstants.API_URL}/users/${userId}/enlistings`, { });
  }

  getFacultyByYear(year) {
    return this.http.get<Page>(`${AppConstants.API_URL}/users?year=${year}`);
  }

  getFacultyByYearAndQueries(year , queries , pageNo) {
    return this.http.get<Page>(`${AppConstants.API_URL}/users?year=${year}&pageNo=${pageNo}${queries}`);
  }

  modifyUser(first, last, rank, college, tenured, soe, admin, gender, userId) {
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

  deleteUser(userId: string) {
    return this.http.delete(`${AppConstants.API_URL}/users/${userId}`);
  }

  getCommitteesByPagation(year , pageNo: number) {
    return this.http.get<Page>(`${AppConstants.API_URL}/users?year=${year}&pageNo=${pageNo}`, {} );
  }

  getUserVolunteeredCommittees(userId) {
    return this.http.get<Committee[]>(`${AppConstants.API_URL}/users/${userId}/enlistings/committees`, {} );
  }

  getUserAssignedCommittees(userId, year) {
    return this.http.get<Committee[]>(`${AppConstants.API_URL}/users/${userId}/committees?year=${year}`, {} );
  }

  assignUserToOneCommittee(committeeId, userId) {
    return this.http.put(`${AppConstants.API_URL}/committees/${committeeId}/members/${userId}`, {} );
  }

  removeUserFromCommittee(committeeId, userId) {
    return this.http.delete(`${AppConstants.API_URL}/committees/${committeeId}/members/${userId}`);
  }

  getCommitteeById(committeeId) {
    return this.http.get<Committee>(`${AppConstants.API_URL}/committees/${committeeId}`);
  }

  getCommitteeVolunteers(committeeId) {
    return this.http.get<User[]>(`${AppConstants.API_URL}/committees/${committeeId}/volunteers/users`);
  }

  createUser(first, last, rank, college, tenured, admin, soe, gender) {
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    const data = {
      "email": '123',
      "first" : first,
      "last" : last,
      "rank" : rank,
      "college" : college,
      "tenured" : tenured,
      "adminResponsibility" : admin,
      "soe" : soe,
      "gender" : gender
    };
    return this.http.post <User> (`${AppConstants.API_URL}/users`, data, config);
  }

  getCommitteeIdByYearAndName(year, name) {
    return this.http.get<string>(`${AppConstants.API_URL}/committees/${name}/years/${year}`, {} );
  }

  getUserYears(email) {
    return this.http.get<string>(`${AppConstants.API_URL}/users/email/${email}/years`, {} );
  }
}
