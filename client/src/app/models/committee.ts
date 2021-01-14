import {CommitteeUser} from './committee-user';
import {Criteria} from './criteria';
import {Duty} from './duty';
export class Committee {
  id: string;
  introduction: string;
  name: string;
  year: string;
  members: CommitteeUser[];
  volunteer: CommitteeUser[];
  criteria: Criteria[];
  duties: Duty[];
}
