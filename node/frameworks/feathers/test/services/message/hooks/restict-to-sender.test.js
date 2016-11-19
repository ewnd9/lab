'use strict';

const assert = require('assert');
const restictToSender = require('../../../../src/services/message/hooks/restict-to-sender.js');

describe('message restictToSender hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'before',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    restictToSender()(mockHook);

    assert.ok(mockHook.restictToSender);
  });
});
