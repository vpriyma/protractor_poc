exports.config = {
  seleniumServerJar: 'node_modules/webdriver-manager/selenium/selenium-server-standalone-3.141.59.jar',
  // seleniumAddress: 'http://localhost:4444/wd/hub',
  framework: 'jasmine',
  specs: ['src/google-search-spec.ts'],
  capabilities: {
    browserName: 'chrome'

    // Run multiple specs simultaneously
    // shardTestFiles: true,
    // maxInstances: 3

    // For running same specs on different browsers/devices in parallel.
    // If you would like to run more than one instance of WebDriver on the same
    // tests, use multiCapabilities, which takes an array of capabilities.
    // If this is specified, capabilities will be ignored.
    // multiCapabilities: [
    //   {
    //     'browserName': 'chrome',
    //     user: 'user@perfectomobile.com',
    //     password: 'password',
    //     platformName: 'Android',
    //     manufacturer: 'Samsung',
    //     model: 'Galaxy S5'
    //   }, {
    //     'browserName': 'chrome',
    //     user: 'user@perfectomobile.com',
    //     password: 'password',
    //     platformName: 'Android',
    //     manufacturer: 'Samsung',
    //     model: 'Galaxy S6'
    //   }], 

  },
  params: {
    baseUrl: 'https://www.google.com/',
    searchWord: 'Automation'
  },

  beforeLaunch() {
    //clean folders
    var fs = require('fs-extra');
    fs.emptyDir('screenshots/');
    fs.emptyDir('jasmine-result/');
    fs.emptyDir('jasmine-report/');
    fs.emptyDir('allure-results/');
    fs.emptyDir('allure-report/');
  },

  onPrepare() {
    //browser config section
    browser.ignoreSynchronization = true;
    browser.driver.manage().window().maximize();
    
    //typescript config section
    require('ts-node').register({
    project: require('path').join(__dirname, './tsconfig.json') // Relative path of tsconfig.json file 
    });

    //jasmine-spec-reporter
    var SpecReporter = require('jasmine-spec-reporter').SpecReporter;
    jasmine.getEnv().addReporter(new SpecReporter({ displayStacktrace: 'all' }));

    //allure-report config section
    var AllureReporter = require('jasmine-allure-reporter');
    jasmine.getEnv().addReporter(new AllureReporter({
      resultsDir: 'allure-results'
    }));
    jasmine.getEnv().afterEach(function (done) {
      browser.takeScreenshot().then(function (png) {
        allure.createAttachment('Screenshot', function () {
          return new Buffer(png, 'base64')
        }, 'image/png')();
        done();
      })
    });

    //jasmine-reporters
    var jasmineReporters = require('jasmine-reporters');
    jasmine.getEnv().addReporter(
      new jasmineReporters.JUnitXmlReporter({
        consolidateAll: true,
        savePath: 'jasmine-result',
        filePrefix: 'xmlresults'
      })
    );

    //protractor-html-reporter-2 for screenshots
    var fs = require('fs-extra');
    jasmine.getEnv().addReporter({
      specDone: function (result) {
        if (result.status == 'failed') {
          browser.getCapabilities().then(function (caps) {
            var browserName = caps.get('browserName');
            browser.takeScreenshot().then(function (png) {
              var stream = fs.createWriteStream('screenshots/' + browserName + '-' + result.fullName + '.png');
              stream.write(new Buffer(png, 'base64'));
              stream.end();
            });
          });
        }
      }
    });
  },

  onComplete() {
    //HTMLReport called once tests are finished
    var browserName, browserVersion;
    var capsPromise = browser.getCapabilities();

    capsPromise.then(function (caps) {
      browserName = caps.get('browserName');
      browserVersion = caps.get('version');
      platform = caps.get('platform');

      var HTMLReport = require('protractor-html-reporter-2');

      testConfig = {
        reportTitle: 'Protractor Test Execution Report',
        outputPath: 'jasmine-report/',
        outputFilename: 'ProtractorTestReport',
        screenshotPath: 'screenshots/',
        testBrowser: browserName,
        browserVersion: browserVersion,
        modifiedSuiteName: false,
        screenshotsOnlyOnFailure: true,
        testPlatform: platform
      };
      new HTMLReport().from('jasmine-result/xmlresults.xml', testConfig);
    });
  }
};


