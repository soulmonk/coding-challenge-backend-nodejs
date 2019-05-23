import {IPolice, Police} from '@models/Police';
import {logger} from './logger';

export class PoliceService {
  static toPublic(record: IPolice) {
    return {
      id: record.id,
      fullName: record.fullName,
      caseId: record.caseId
    };
  }

  static async create(data: IPolice) {
    logger.debug('Create model police: ', data);

    const record = await Police.create(data);
    return PoliceService.toPublic(record);
  }
}
