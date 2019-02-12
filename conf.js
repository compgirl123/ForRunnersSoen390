exports.config = {
    framework: 'jasmine',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['spec/*.spec.js'],
    multiCapabilities: [{
      browserName: 'chrome'
    }],
    jasmineNodeOpts: {
      defaultTimeoutInterval: 250000
    },
  }