const Jasmine = require('jasmine');
const JasmineConsoleReporter = require('jasmine-console-reporter');
const reporter = new JasmineConsoleReporter({
  colors: 2, // (0|false)|(1|true)|2
  cleanStack: 1, // (0|false)|(1|true)|2|3
  verbosity: 4, // (0|false)|1|2|(3|true)|4
  listStyle: 'indent', // "flat"|"indent"
  activity: true,
});

const jasmine = new Jasmine();
global.jasmineRequire = { interface: {} };
const jasmineAsPromise = require('jasmine-promises');
jasmine.loadConfigFile('./spec/jasmine.json');
jasmine.addReporter(reporter);
jasmine.execute();
