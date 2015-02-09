suite('azure table (sas)', function() {
  var Promise     = require('promise');
  var assert      = require('assert');
  var debug       = require('debug')('auth:test:azure');
  var helper      = require('./helper');
  var slugid      = require('slugid');
  var _           = require('lodash');
  var subject     = helper.setup({title: "azure-tests"});

  test('azureTableSAS', function() {
    return subject.auth.azureTableSAS(
      subject.testaccount,
      'TestTable'
    ).then(function(result) {
      assert(typeof(result.sas) === 'string', "Expected some form of string");
      assert(new Date(result.expiry).getTime() > new Date().getTime(),
             "Expected expiry to be in the future");
    });
  });


  test('azureTableSAS (allowed table)', function() {
    // Restrict access a bit
    var auth = new subject.Auth({
      baseUrl:          subject.baseUrl,
      credentials:      subject.root,
      authorizedScopes: [
        'auth:azure-table-access:' + subject.testaccount + '/allowedTable'
      ]
    });
    return auth.azureTableSAS(
      subject.testaccount,
      'allowedTable'
    ).then(function(result) {
      assert(typeof(result.sas) === 'string', "Expected some form of string");
      assert(new Date(result.expiry).getTime() > new Date().getTime(),
             "Expected expiry to be in the future");
    });
  });

  test('azureTableSAS (unauthorized table)', function() {
    // Restrict access a bit
    var auth = new subject.Auth({
      baseUrl:          subject.baseUrl,
      credentials:      subject.root,
      authorizedScopes: [
        'auth:azure-table-access:' + subject.testaccount + '/allowedTable'
      ]
    });
    return auth.azureTableSAS(
      subject.testaccount,
      'unauthorizedTable'
    ).then(function(result) {
      assert(false, "Expected an authentication error!");
    }, function(err) {
      assert(err.statusCode == 401, "Expected authorization error!");
    });
  });
});