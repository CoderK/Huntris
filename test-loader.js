const context = require.context('mocha-loader!./src', true, /-specs.js$/);
context.keys().forEach(context);
