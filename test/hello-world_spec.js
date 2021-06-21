var helper = require("node-red-node-test-helper");
var lowerNode = require("../hello-world.js");

helper.init(require.resolve('node-red'));

describe('hello-world Node', function () {

  beforeEach(function (done) {
    helper.startServer(done);
  });

  afterEach(function (done) {
    helper.unload();
    helper.stopServer(done);
  });




  it('should return hello world', function (done) {
    var flow = [{ id: "n1", type: "hello-world", name: "test name", wires: [["n2"]] },
    { id: "n2", type: "helper" }];
    helper.load(lowerNode, flow, function () {
      var n2 = helper.getNode("n2");
      var n1 = helper.getNode("n1");
      n2.on("input", function (msg) {
        try {
          msg.should.have.property('payload', 'hello world');
          done();
        } catch (err) {
          done(err)
        }
      });
      n1.receive({ payload: "UpperCase" });
    });
  });

  it('should be loaded', function (done) {
    var flow = [{ id: "n3", type: "hello-world", name: "test name" }];
    helper.load(lowerNode, flow, function () {
      var n1 = helper.getNode("n3");
      try {
        n1.should.have.property('name', 'test name');
        done();
      } catch (err) {
        done(err)
      }
    });
  });
});