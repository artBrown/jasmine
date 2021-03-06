describe('Custom Async Matchers (Integration)', function() {
  var env;

  beforeEach(function() {
    env = new jasmineUnderTest.Env();
    env.configure({random: false});
  });

  it('passes the spec if the custom async matcher passes', function(done) {
    jasmine.getEnv().requirePromises();

    env.it('spec using custom async matcher', function() {
      env.addAsyncMatchers({
        toBeReal: function() {
          return { compare: function() { return Promise.resolve({ pass: true }); } };
        }
      });

      return env.expectAsync(true).toBeReal();
    });

    var specExpectations = function(result) {
      expect(result.status).toEqual('passed');
    };

    env.addReporter({ specDone: specExpectations, jasmineDone: done });
    env.execute();
  });

  it('uses the negative compare function for a negative comparison, if provided', function(done) {
    jasmine.getEnv().requirePromises();

    env.it('spec with custom negative comparison matcher', function() {
      env.addAsyncMatchers({
        toBeReal: function() {
          return {
            compare: function() { return Promise.resolve({ pass: true }); },
            negativeCompare: function() { return Promise.resolve({ pass: true }); }
          };
        }
      });

      return env.expectAsync(true).not.toBeReal();
    });

    var specExpectations = function(result) {
      expect(result.status).toEqual('passed');
    };

    env.addReporter({ specDone: specExpectations, jasmineDone: done });
    env.execute();
  });

  it('generates messages with the same rules as built in matchers absent a custom message', function(done) {
    jasmine.getEnv().requirePromises();

    env.it('spec with an expectation', function() {
      env.addAsyncMatchers({
        toBeReal: function() {
          return {
            compare: function() {
              return Promise.resolve({ pass: false });
            }
          };
        }
      });

      return env.expectAsync('a').toBeReal();
    });

    var specExpectations = function(result) {
      expect(result.failedExpectations[0].message).toEqual("Expected 'a' to be real.");
    };

    env.addReporter({ specDone: specExpectations, jasmineDone: done });
    env.execute();
  });
});
