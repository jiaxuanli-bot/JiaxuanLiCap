import {UserCommittees} from './user-committees';
import {Role} from './role';

export class User {
  id: string;
  email: string;
  first: string;
  last: string;
  rank: string;
  college: string;
  tenured: boolean;
  soe: boolean;
  adminResponsibility: boolean;
  gender: string;
  year: string;
  committees: UserCommittees[];
  roles: Role[];
  years: string[];
}
