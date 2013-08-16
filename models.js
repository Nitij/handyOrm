;
var ModelDef = function () {
    this._modelName = null;
    this._serviceName = null;
    this._methodName = null;
    this._columns = [];
    this._lastOperation = null;

    this.results = null;
    return this;
};
ModelDef.prototype = {
    clearFields: function (fields) {
        var i = 0;
        var control = null;
        for (; i < fields.length; i++) {
            control = $("*[model-name = '" + this._modelName + "']*[model-column = '" + fields[i] + "']");
            $(control[0]).val('');
        }
        return this;
    },
    columnElementId: function (columnName) {
        var control = null;
        if (jQuery.inArray(columnName, this._columns) !== -1) {
            control = $("*[model-name = '" + this._modelName + "']*[model-column = '" + columnName + "']");
        }
        if (control === null || control === undefined) {
            return control;
        }
        else {
            return control[0].id;
        }
    },
    lastOperation: function () {
        return this._lastOperation;
    },
    modelName: function (name) {
        this._modelName = name;
        return this;
    },
    operation: function (operationType, boundValues, customValues) {
        var colParams = [];
        var i = 0;
        var attribControl = null;
        var params = null;
        var setResults = this.setResults;

        //set the last operation value
        this._lastOperation = operationType;

        //set to empty array if these params are null or undefined
        if (customValues === null || customValues === undefined)
            customValues = [];

        if (boundValues === null || boundValues === undefined)
            boundValues = [];

        //lets get the values of columns which are bound to the fields
        for (; i < boundValues.length; i++) {
            attribControl = $("*[model-name = '" + this._modelName + "']*[model-column = '" + boundValues[i] + "']");
            colParams.push({ ColName: boundValues[i], ColValue: $(attribControl[0]).val() });
        }

        //get the custom values passed
        for (i = 0; i < customValues.length; i++) {
            colParams.push({ ColName: customValues[i].col, ColValue: customValues[i].val });
        }

        params = "{'operationType':'" + operationType + "','values':'" + JSON.stringify(colParams) + "'}";
        var myService = new Service(this._serviceName, this._methodName, params);
        return myService.callService();
    },
    serviceName: function (name) {
        this._serviceName = name;
        return this;
    },
    methodName: function (name) {
        this._methodName = name;
        return this;
    },
    columns: function (cols) {
        this._columns = cols;
        return this;
    }
};

var Promise = function () {
    this.resolved = null;
    this.rejected = null;
};
Promise.prototype = {
    then: function (onResolved, onRejected) {
        this.resolved = onResolved;
        this.rejected = onRejected;
    }
}

var Service = function (serviceName, methodName, methodParams) {
    this._serviceName = serviceName;
    this._methodName = methodName;
    this._methodParams = methodParams;
    return this;
};
Service.prototype = {
    callService: function () {
        var promise = new Promise();
        return $.ajax({
            type: "POST",
            url: "/" + this._serviceName + ".asmx/" + this._methodName,
            data: this._methodParams,
            contentType: "application/json; charset=utf-8",
            dataType: "json"//,
//            success: function (result) { promise.resolved(result.d); }, //still deciding to use jQuery promise or create my own
//            error: function (e) { promise.rejected(e); }
        });
        //return promise;
    }
}