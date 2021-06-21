var helper = require("node-red-node-test-helper");
var readListNode = require("../read-list.js");
var readListFs = require("../read-list-fs.js");
var util = require("util");
var vm = require("vm");
var fs = require("fs");
helper.init(require.resolve('node-red'));

describe('read-list Node', function () {

  beforeEach(function (done) {
    helper.startServer(done);
  });

  afterEach(function (done) {
    helper.unload();
    helper.stopServer(done);
  });

  it('should be loaded', function (done) {
    var flow = [{ id: "n3", type: "read-list", name: "test name" }];
    helper.load(readListNode, flow, function () {
      var n1 = helper.getNode("n3");
      try {
        n1.should.have.property('name', 'test name');
        done();
      } catch (err) {
        done(err)
      }
    });
  });

  it('should return list from file content', function (done) {
    try {
      var result = readListFs.getList("{\"test\":[\"1\",\"2\"]}", "test", "br")
      result.should.be.an.instanceof(String).and.equal("1. 1\n2. 2")
      done()
    } catch (err) {
      done(err)
    }
  });

  it('should split the content', function (done) {
    try {
      var result = readListFs.splitList("hello world", 5)
      result.should.be.an.instanceof(Array).and.have.lengthOf(3)
      result[0].should.be.equal("hello")
      done()
    } catch (err) {
      done(err)
    }
  });

  it('should return one element', function (done) {
    var flow = [{ id: "n1", type: "read-list", name: "test name", wires: [["n2"]] },
    { id: "n2", type: "helper" }];
    //Create the test file
    const content = '{"testlist":["1"]}'
    fs.writeFile('./testfile.log', content, err => {
      if (err) {
        console.error(err)
        return
      }
      helper.load(readListNode, flow, function () {
        var n2 = helper.getNode("n2");
        var n1 = helper.getNode("n1");
        n2.on("input", function (msg) {
          try {
            msg.should.have.property('payload', '1. 1');
            done();
          } catch (err) {
            done(err)
          }
        });
        n1.receive({ filename: "./testfile.log", listname: "testlist" });
      });
    });
  })

  it('should return 2 element', function (done) {
    var flow = [{ id: "n1", type: "read-list", name: "test name", wires: [["n2"]] },
    { id: "n2", type: "helper" }];
    //Create the test file
    const content = '{"testlist":["1", "2"]}'
    fs.writeFile('./testfile.log', content, err => {
      if (err) {
        console.error(err)
        return
      }
      helper.load(readListNode, flow, function () {
        var n2 = helper.getNode("n2");
        var n1 = helper.getNode("n1");
        n2.on("input", function (msg) {
          try {
            msg.should.have.property('payload', '1. 1\n2. 2');
            done();
          } catch (err) {
            done(err)
          }
        });
        n1.receive({ filename: "./testfile.log", listname: "testlist" });
      });
    });
  })
});