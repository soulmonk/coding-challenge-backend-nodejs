import {DBConnection} from 'models/index';

export class Application {
  public dbConnection: DBConnection
}

export const createApplication = () => {
  const application = new Application();
  return application;
};
