import {Committee} from './committee';
import {UserCommittees} from './user-committees';

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
  role: string[];
  year: string;
}
