import {IPolice, Police} from '@models/Police';
import {AssignService} from './assign';
import {logger} from './logger';

export class PoliceService {
  static toPublic(record: IPolice) {
    return {
      id: record.id,
      fullName: record.fullName,
      caseId: record.caseId || (record.case && record.case.id) || null // todo sequelize update association (without find) after set
    };
  }

  static async create(data: IPolice) {
    logger.debug('Create model police: ', data);

    const record = await Police.create(data);

    const availableCase = await AssignService.findUnassignedCase();

    if (availableCase) {
      await record.setCase(availableCase);
      record.caseId = availableCase.id; // todo update "case" after set
    }

    return PoliceService.toPublic(record);
  }

  static async list() {
    const records = await Police.findAll({
      include: [Police.associations.case],
      order: [['id', 'ASC']] // todo do I need this?
    });
    return records.map(PoliceService.toPublic);
  }

  static async delete(id: number) {
    // todo what better: one query with join or two one if needed second?
    const police = await Police.findByPk(id);

    if (!police) {
      return false;
    }

    const policeCase = await police.getCase();
    if (policeCase) {
      throw new Error('Police officer has a case: ' + policeCase.id);
    }

    return police.destroy();
  }
}
