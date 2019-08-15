exports.config = {
  seleniumServerJar: 'node_modules/webdriver-manager/selenium/selenium-server-standalone-3.141.59.jar',
  framework: 'jasmine',
  specs: ['src\\google-search-spec.ts'],
  capabilities: {
    browserName: 'chrome'
  },
  params: {
    baseUrl: 'https://www.google.com/',
    searchWord: 'Automation'
  },
  onPrepare() {
    //browser section
    browser.ignoreSynchronization = true;
    browser.driver.manage().window().maximize();
    
    //typescript section
    require('ts-node').register({
    project: require('path').join(__dirname, './tsconfig.json') // Relative path of tsconfig.json file 
    });

    //allure section
    var AllureReporter = require('jasmine-allure-reporter');
    jasmine.getEnv().addReporter(new AllureReporter({
      resultsDir: 'allure-results'
    }));

    //jasmine-spec-reporter
    var SpecReporter = require('jasmine-spec-reporter').SpecReporter;
    jasmine.getEnv().addReporter(new SpecReporter({ displayStacktrace: 'all' }));

    //jasmineReporters
    var jasmineReporters = require('jasmine-reporters');
    jasmine.getEnv().addReporter(
      new jasmineReporters.JUnitXmlReporter({
        consolidateAll: true,
        savePath: 'jasmine-result',
        filePrefix: 'xmlresults'
      })
    );
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