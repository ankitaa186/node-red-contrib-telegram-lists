var helper = require("node-red-node-test-helper");
var addItemNode = require("../add-item.js");
var readListFs = require("../list-fs.js");
var util = require("util");
var vm = require("vm");
var fs = require("fs");
const { assert } = require("assert");
helper.init(require.resolve('node-red'));

describe('add-item Node', function () {

  beforeEach(function (done) {
    helper.startServer(done);
  });

  afterEach(function (done) {
    helper.unload();
    helper.stopServer(done);
  });

  it('should be loaded', function (done) {
    var flow = [{ id: "n3", type: "add-item", name: "test name" }];
    helper.load(addItemNode, flow, function () {
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
      var result = readListFs.getList("{\"test\":[\"1\",\"2\"]}", "test", "\n")
      result.should.be.an.instanceof(String).and.equal("1. 1\n2. 2")
      done()
    } catch (err) {
      done(err)
    }
  });

  it('should return null if list is not found', function (done) {
    try {
      var result = readListFs.getList("{}", "test", "\n")
      assert
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
    var flow = [{ id: "n1", type: "add-item", name: "test name", wires: [["n2"]] },
    { id: "n2", type: "helper" }];
    //Create the test file
    const content = '{"testlist":["1"]}'
    fs.writeFile('./testfile.log', content, err => {
      if (err) {
        console.error(err)
        return
      }
      helper.load(addItemNode, flow, function () {
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
        n1.receive({ filename: "./testfile.log", listname: "testlist", payload: "2" });
      });
    });
  })
});