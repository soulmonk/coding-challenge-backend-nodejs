import {Case} from '@models/Case';
import {Officer} from '@models/Officer';
import {QueryTypes} from 'sequelize';

export class AssignService {
  static async findUnassignedCase(): Promise<Case> {
    const caseModel = await Case.findOne({where: {officerId: null, resolved: false}});
    return caseModel;
  }

  // todo
  // 2) add field available, mark/unmark on assign
  static async findAvailableOfficer(): Promise<Officer> {
    const query = 'select * from officers where id not in (select c."officerId" from cases c where c."officerId" is not null) limit 1';
    // 1) select id of officer find not used
    const officer: Officer = await Officer.sequelize.query<Officer>(
      query,
      {type: QueryTypes.SELECT, mapToModel: true, model: Officer})
      .then(res => {
        return res.length ? res[0] : null;
      });
    return officer;
  }
}
