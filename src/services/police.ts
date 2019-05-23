import {IPolice, Police} from '@models/Police';
import {AssignService} from './assign';
import {logger} from './logger';

export class PoliceService {
  static toPublic(record: IPolice) {
    return {
      id: record.id,
      fullName: record.fullName,
    };
  }

  static async create(data: IPolice) {
    logger.debug('Create model police: ', data);

    const record = await Police.create(data);
    return PoliceService.toPublic(record);
  }

  static async list() {
    const records = await Police.findAll();
    return records.map(PoliceService.toPublic);
  }

  static async delete(id: number) {
    const police = await Police.findByPk(id, {
      include: [Police.associations.case]
    });

    console.log('police.ts::delete::31 >>>', police);

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
