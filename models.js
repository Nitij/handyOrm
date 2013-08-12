;
var ModelDef = function () {
    this._modelName = null;
    this._then = null;
    this._fail = null;
    this._serviceName = null;
    this._methodName = null;
    this._columns = [];    
    this._lastOperation = null;
    this._operationType = null;
    this._boundValues = null;
    this._customValues = null;

    this.results = null;
    return this;
}
ModelDef.prototype = {
    initialize: function () {
        this._fail = defaultFail;
        return this;
    },
    lastOperation: function () {
        return this._lastOperation;
    },
    operation: function (operationType, boundValues, customValues) {
        debugger;
        this._operationType = operationType;
        this._boundValues = boundValues;
        this._customValues = customValues;

        return this;
    },
    modelName: function (name) {
        this._modelName = name;
        return this;
    },
    then: function (t) {
        var colParams = [];
        var i = 0;
        var attribControl = null;
        var params = null;
        var operationType = this._operationType;
        var boundValues = this._boundValues;
        var customValues = this._customValues;
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
        
        for (i = 0; i < customValues.length; i++) {
            colParams.push({ ColName: customValues[i].col, ColValue: customValues[i].val });
        }

        params = "{'operationType':'" + operationType + "','values':'" + JSON.stringify(colParams) + "'}";
        var myService = new Service(this._serviceName, this._methodName, params,
         function (r) {
             t(r.d);
         }, this._fail);
        myService.callService();

        //set them to null because we are done using them
        this._operationType = null;
        this._boundValues = null;
        this._customValues = null;

        return this;
    },
    fail: function (f) {
        this._fail = f;
        return this;
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

function defaultFail() {
    //Default Fail
    console.log("Web Service Call Failed");
};

var Service = function (serviceName, methodName, methodParams, then, fail) {
    this._serviceName = serviceName;
    this._methodName = methodName;
    this._methodParams = methodParams;
    this._then = then;
    this._fail = fail;
    return this;
};
Service.prototype = {
    callService: function () {
        $.ajax({
            type: "POST",
            url: "/" + this._serviceName + ".asmx/" + this._methodName,
            data: this._methodParams,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: this._then,
            error: this._fail
        });
    }
}