module.exports = {
    splitList: function splitList(listcontent, maxSize) {
        var returnList = []
        if (!maxSize) {
            maxSize = 3500
        }
        if (listcontent && listcontent.length > maxSize) {
            const yardstick = new RegExp(`.{${maxSize}}`, 'g'); // /.{10}/g;
            const pieces = listcontent.match(yardstick);
            const accumulated = (pieces.length * maxSize);
            const modulo = listcontent.length % accumulated;
            if (modulo) pieces.push(listcontent.slice(accumulated));
            returnList = pieces
        } else {
            returnList.push(listcontent)
            console.log("push")
        }
        return returnList
    },

    getList: function getList(fileContent, listName, format) {
        var parsedList = JSON.parse(fileContent)
        var output = "";
        if (format && format == "br") {
            var counter = 0;
            if (parsedList[listName] && parsedList[listName].length > 0) {
                for (var item of parsedList[listName]) {
                    counter++;
                    output = output + counter + ". " + item + '\n';
                }
                if (output && output.length > 0) {
                    output = output.slice(0, -1);
                }
            } else {
                output = "List is empty"
            }
        }
        return output
    }
}