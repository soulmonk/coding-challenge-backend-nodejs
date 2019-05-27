import {Case} from '@models/Case';
import {Police} from '@models/Police';
import {QueryTypes} from 'sequelize';

export class AssignService {
  static async findUnassignedCase(): Promise<Case> {
    const caseModel = await Case.findOne({where: {policeId: null, resolved: false}});
    return caseModel;
  }

  // todo
  // 2) add field available, mark/unmark on assign
  static async findAvailablePolice(): Promise<Police> {
    const query = 'select * from polices where id not in (select c."policeId" from cases c where c."policeId" is not null) limit 1';
    // 1) select id of police find not used
    const police: Police = await Police.sequelize.query<Police>(
      query,
      {type: QueryTypes.SELECT, mapToModel: true, model: Police})
      .then(res => {
        return res.length ? res[0] : null;
      });
    return police;
  }

  static assignCaseToPolice() {
    //
  }
}
