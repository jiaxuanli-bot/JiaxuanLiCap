import {Committee} from './committee';
import {UserCommittees} from './user-committees';
import {Role} from './role';

export class User {
  id: string;
  email: string;
  first: string;
  last: string;
  rank: string;
  college: string;
  tenured: number;
  soe: number;
  adminResponsibility: number;
  gender: string;
  committees: UserCommittees[];
  roles: Role[];
  year: string;
}
