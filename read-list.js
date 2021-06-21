module.exports = function (RED) {
    "use strict";
    var util = require("util");
    var vm = require("vm");
    var fs = require("fs");
    var readListFs = require("./read-list-fs.js")

    function ReadList(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function (msg) {
            console.log("### Read list ###")
            //Read File
            var filename = msg.filename
            var listname = msg.listname
            var fileContent = ''
            if (!filename || !listname || filename.size == 0 || listname.size == 0) {
                console.error("Filename or listname is empty");
                console.log("### error ###")
                return;
            }
            console.log("### filename ###" + filename)
            fileContent = fs.readFileSync(filename, 'utf-8')
            console.log("1 -" + fileContent)
            console.log("### error ###")
            if (fileContent && fileContent.length > 0) {
                var listcontent = []
                listcontent = readListFs.splitList(readListFs.getList(fileContent, listname, "br"), 3500)
                for (const item of listcontent) {
                    msg.payload = item
                    node.send(msg)
                }
            } else {
                node.warn("File " + filename + " is empty")
                console.log("### empty ###")
            }
        });
    }

    RED.nodes.registerType("read-list", ReadList);
}