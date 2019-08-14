exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  framework: 'jasmine',
  specs: ['src\\google-search-spec.ts'],
  capabilities: {
    browserName: 'chrome'
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
  }
};