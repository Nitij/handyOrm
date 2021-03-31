I have been working on some enterprise web applications for some time which happen to be very responsive and asynchronous in nature. While working on them I was always annoyed when I had to write so much boilerplate code for making asynchronous calls and passing data to the server. Although this process is already abstracted by using jQuery or some other in-house or third party libraries, still I felt something is missing. So this object library is my attempt and effort to make our lives further simpler. So I began working on this some time back(it has been week now at the time this page was initially written).

This object library is still in initial phase and I will be providing all the updates here.


Check out some ways in which this can be used:

### Initialize the model and chain methods in any sequence: 

```
var myModel = null;
myModel = new ModelDef()
              .modelName("MyModel")
              .serviceName("DataService")
              .methodName("ExecuteModelOperation")
              .columns(["id", "name", "phone", "address"]);
```

or call them individually according to your requirement:

```
myModel.serviceName("DataService");
myModel.columns(["id", "name", "phone", "address"]);
```


### Bind input DOM elements to the columns of our model:

```
<input ... model-name = "MyModel" model-column = "id" disabled = "true"/> <br />
<input ... model-name = "MyModel" model-column = "name"/> <br />
<input ... model-name = "MyModel" model-column = "phone"/> <br />
```


### When its time to make the asynchronous call to the server, you just need a single line:
```
myModel.operation("Insert", ["name", "phone", "address"], null).then(ReadRecords, handleError);
...
myModel.operation("Update", ["id", "name", "phone", "address"], null).then(ReadRecords, handleError);
...
myModel.operation("Delete", null, [{ col: "id", val: id}]).then(ReadRecords, handleError);
```

### Here is the summary of all the available functions:


***

**columnElementId(columnName):** Returns the id of the bound column passed.

_columnName_: Name of the column, typeof String.

***

**lastOperation():** Returns the name of the last operation executed.

***

modelName(name): Sets the model name.
 
_name_: Name of the model.

***

**operation(operationType, boundValues, customValues):** Executes a single operation.

_operationType_: Type of operation, usually a String.

_boundValues_: Values to use which are in the DOM elements bound to the columns, in the form of [col1, col2, ...]:col1, col2 = typeof String.

_customValues_: Custom values for columns, in the form of [{col:columnName, val:value}, ...].

***

**serviceName(name):** Sets the web service name to use.

_name_: Name of the web service.

***

**methodName(name):** Sets the name of the web service method to call.

_name_: Name of the web service method.

***

**clearFields(fields):** Clear the bound fields for those column names passed as a parameter.

_fields_: Name of bound columns to be cleared in the form of [col1, col2, ...]:col1, col2 = typeof String.

***

You can refer to the sample application code on github [here](https://github.com/Nitij/handyOrmSampleApplication).
