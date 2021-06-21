const readList = require("./read-list.js");

module.exports = function (RED) {
    "use strict";
    var util = require("util");
    var vm = require("vm");
    var fs = require("fs");
    var listFs = require("./list-fs.js")

    function AddItem(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function (msg) {
            console.log("### Add item ###")
            //Read File
            var filename = msg.filename
            var listname = msg.listname
            var item = msg.payload
            var fileContent = ''
            if (!filename || !listname || filename.length == 0 || listname.length == 0 || !item || item.length == 0) {
                console.error("Filename, listname or item is empty");
                console.log("### error ###")
                return;
            }
            console.log("### filename ###" + filename)
            try {
                fileContent = fs.readFileSync(filename, 'utf-8')
            } catch (err) {
                if (err.code === 'ENOENT') {
                    console.log('File not found! - ' + filename);
                    fs.writeFileSync(filename, '{}', 'utf8')
                    fileContent = fs.readFileSync(filename, 'utf-8')
                } else {
                    throw err;
                }
            }
            console.log("1 -" + fileContent)
            console.log("### error ###")
            if (fileContent && fileContent.length > 0) {
                fileContent = listFs.addItem(fileContent, listname, item)
                fs.writeFileSync(filename, fileContent, 'utf8')
                msg.payload = listFs.getList(fileContent, listname, '\n')
                node.send(msg);
            } else {
                node.warn("File " + filename + " is empty")
                console.log("### empty ###")
            }
        });
    }

    RED.nodes.registerType("add-item", AddItem);
}