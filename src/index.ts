import {createServer} from './server';
import {createApplication} from './application';

async function init() {
  const app = createApplication();

  const appSrv = createServer(app);

  appSrv.listen(app.config.port);

  console.log('Server running on port ' + app.config.port);

}

// noinspection JSIgnoredPromiseFromCall
init();
