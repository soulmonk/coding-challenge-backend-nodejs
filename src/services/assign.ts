import {Case} from '@models/Case';
import {Police} from '@models/Police';
import {Promise} from 'sequelize';

export class AssignService {

  static findCase(id: number) {
    return Case.findOne({where: {policeId: id}});
  }

  static findUnassignedCase(): Promise<Case> {
    return Case.findOne({where: {policeId: null, resolved: false}});
  }

  static findAvalablePolice(): Promise<Police> {
    // todo
    // 1) select id of pollice find not used
    // 2) add field available, mark/unmark on assign
    return null;
  }
}
