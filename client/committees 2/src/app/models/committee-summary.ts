import {CommitteeUser} from './committee-user';

export class CommitteeSummary {
  id: string;
  name: string;
  year: string;
  members: CommitteeUser[];
}
