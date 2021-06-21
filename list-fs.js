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

    getList: function getList(fileContent, listName, delimiter) {
        var parsedList = JSON.parse(fileContent)
        var output = "";
        if (!delimiter) {
            delimiter = '\n';
        }
        var counter = 0;
        if (parsedList[listName] && parsedList[listName].length > 0) {
            for (var item of parsedList[listName]) {
                counter++;
                output = output + counter + ". " + item + delimiter;
            }
            if (output && output.length > 0) {
                output = output.slice(0, -1);
            }
        } else {
            output = null
        }

        return output
    },

    addList: function addList(fileContent, listName) {
        var parsedList = JSON.parse(fileContent)
        if (!parsedList || parsedList.length == 0) {
            parsedList = JSON.parse("{}")
        }
        if (!parsedList[listName]) {
            parsedList[listName] = []
        }
        return JSON.stringify(parsedList)
    },

    removeList: function removeList(fileContent, listName) {
        var parsedList = JSON.parse(fileContent)
        if (!parsedList || parsedList.length == 0) {
            parsedList = JSON.parse("{}")
        }
        if (parsedList[listName]) {
            delete parsedList[listName]
        }
        return JSON.stringify(parsedList)
    },

    addItem: function addItem(fileContent, listName, item) {
        var parsedList = JSON.parse(this.addList(fileContent, listName))
        parsedList[listName].push(item)
        return JSON.stringify(parsedList)
    },

    removeItem: function addItem(fileContent, listName, item) {
        var parsedList = JSON.parse(this.addList(fileContent, listName))
        var newList = []
        for (const i of parsedList[listName]) {
            if (i != item) {
                newList.push(i)
            }
        }
        parsedList[listName] = newList
        return JSON.stringify(parsedList)
    }

}