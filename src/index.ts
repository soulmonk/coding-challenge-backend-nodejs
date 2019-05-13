import {createServer} from './server';

async function init() {
  const app = createServer();

  // TODO config from file
  const config = {port: 7430};
  app.listen(config.port);

  console.log('Server running on port ' + config.port);

}
