import {IOfficer, Officer} from '@models/Officer';
import {AssignService} from './assign';
import {logger} from './logger';

export class OfficerService {
  static toPublic(record: IOfficer) {
    return {
      id: record.id,
      fullName: record.fullName,
      caseId: record.caseId || (record.case && record.case.id) || null // todo sequelize update association (without find) after set
    };
  }

  static async create(data: IOfficer) {
    logger.debug('Create model officer: ', data);

    const record = await Officer.create(data);

    const availableCase = await AssignService.findUnassignedCase();

    if (availableCase) {
      await record.setCase(availableCase);
      record.caseId = availableCase.id; // todo update "case" after set
    }

    return OfficerService.toPublic(record);
  }

  static async list() {
    const records = await Officer.findAll({
      include: [Officer.associations.case],
      order: [['id', 'ASC']] // todo do I need this?
    });
    return records.map(OfficerService.toPublic);
  }

  static async delete(id: number) {
    // todo what better: one query with join or two one if needed second?
    const officer = await Officer.findByPk(id);

    if (!officer) {
      return false;
    }

    const assignedCase = await officer.getCase();
    if (assignedCase) {
      throw new Error('Officer officer has a case: ' + assignedCase.id);
    }

    return officer.destroy();
  }
}
