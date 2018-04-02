const gulp = require('gulp');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const yargs = require('yargs');

const runSequence = require('run-sequence');
const reporter = require('multiple-cucumber-html-reporter');
const cucumber = require('gulp-cucumber');
const tagParser = require('./tag-parser');

const argv = yargs
  .usage('Usage: $0 <command> --ff=feature-name --t @tag1 --t @tag2')
  .command('cucumber', 'run cucumber for all features and generate report')
  .command('gen-report', 'generate report for cucumber output')
  .describe('ff', 'Feature file to execute')
  .alias('ff', 'feature-file')
  .nargs('ff', 1)
  .describe('tag', 'Cucumber feature/scenario tags')
  .alias('tag', 't')
  .alias('tag', 'tags')
  .describe('local', 'Activate local config')
  .alias('local', 'l')
  .help('hh')
  .alias('hh', 'usage')
  .argv;

// const localConfig = require('./local-config');

// if (argv.local) {
//   localConfig();
// }

const cucumberFor = (pattern, tags, featureFile) => () =>
  gulp.src(`${pattern}/${featureFile || '*'}.feature`).pipe(
    cucumber({
      tags: tagParser(
        [
          '~@descoped',
          '~@manual',
          '~@wip',
          '~@mock',
          '~@mocks',
          '~@duplicate',
          '~@obsolete',
        ].concat(tags || [])
      ),
      steps: ['index.js', `${pattern}/*.js`],
      format: ['summary', `json:output/json/bdd-results-${Date.now()}.json`],
    })
  );

gulp.task('prepare', () => {
  mkdirp.sync('output/json');
  mkdirp.sync('output/html');
  rimraf.sync('output/json/*');
  rimraf.sync('output/html/*');
});

gulp.task('gen-report', () =>
  reporter.generate({
    jsonDir: './output/json/',
    reportPath: './output/html',
    metadata: {
      device: 'Local test machine',
      platform: {
        name: 'linux',
      },
    },
    customData: {
      title: 'Run info',
      data: [
        { label: 'Project', value: 'Custom project' },
        { label: 'Release', value: '1.2.3' },
        { label: 'Cycle', value: 'B11221.34321' },
        { label: 'Execution Start Time', value: 'Nov 19th 2017, 02:31 PM EST' },
        { label: 'Execution End Time', value: 'Nov 19th 2017, 02:56 PM EST' },
      ],
    },
  })
);

gulp.task('cucumber:acceptance', cucumberFor('features/**', argv.tag, argv.ff));

gulp.task('cucumber', () => runSequence('prepare', 'cucumber:acceptance', 'gen-report'));
