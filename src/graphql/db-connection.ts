import {Pool} from 'pg';
import config = require('config');

export const db = new Pool(config.get('db2'));
