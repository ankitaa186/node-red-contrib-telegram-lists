module.exports = function(RED) {
    function HelloWorld(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            msg.payload = "hello world"
            node.send(msg);
        });
    }
    RED.nodes.registerType("hello-world",HelloWorld);
}