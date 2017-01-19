/* eslint-disable no-console*/
require('epipebomb')();  // Allow piping to 'head'

var Command = require('commander').Command,
    Storage = require('../src/server/storage/Storage'),
    Logger = require('../src/server/logger'),
    Query = require('../src/common/data-query'),
    logger = new Logger('NetsBlox:CLI:session'),
    storage = new Storage(logger),
    program = new Command();

program
    .arguments('[sessionIds...]')
    .option('--json', 'Print actions in json')
    .parse(process.argv);

storage.connect()
    .then(() => {
        logger.trace('About to print sessions');
        Query.printSessions(program.args, program);
    })
    .then(() => storage.disconnect())
    .catch(err => console.err(err));
/* eslint-enable no-console*/
