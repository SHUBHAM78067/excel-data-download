sap.ui.define(
  [
    "mickey/controller/BaseController",
    "mickey/models/model",
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet",
    "mickey/util/lifeSaver",
  ],
  //call back which will get called when all dependencies are loaded
  function (
    BaseController,
    Model,
    exportLibrary,
    Spreadsheet,
    NumberFormat,
    lifeSaver
  ) {
    var EdmType = exportLibrary.EdmType;
    return BaseController.extend("mickey.controller.Main", {
      formatter: lifeSaver,
      anotherFx: function () {
        //this- is the default object of current class - Main Controller
        //in OOPS ABAP it is compared with - ME
        var oView = this.getView();
        //From the view, we will get the control object
        //Opt 1
        var oInp = oView.byId("idInp");
        //Opt 2
        var oInp2 = this.oCore.byId("idXMLView--idInp");
        //Print the value
        alert(oInp.getValue());

        //alert("my xml view is live in action 😊");
      },

      onChangeData: function () {
        //Step 1: Get the model object
        var oModel = this.oCore.getModel();

        //Step 2: call the standard function to change single/multiple data
        oModel.setProperty("/empStr/empName", "Ananya");
      },
      createColumnConfig: function () {
        var aCols = [];

        aCols.push({
          label: "Full name",
          property: "empName",
          type: EdmType.String,
        });

        aCols.push({
          label: "ID",
          type: EdmType.Number,
          property: "empId",
          scale: 0,
        });

        aCols.push({
          property: "salary",
          type: EdmType.Number,
          scale: 2,
          delimiter: true,
        });

        aCols.push({
          property: "currency",
          type: EdmType.String,
        });

        aCols.push({
          property: "smoker",
          type: EdmType.Boolean,
          trueValue: "YES",
          falseValue: "NO",
        });
        aCols.push({
          property: "mStat",
          type: EdmType.String,
        });

        return aCols;
      },

      onExport: function (oEvent) {
        debugger;
        var aCols, oRowBinding, oSettings, oSheet, oTable;

        if (!this._oTable) {
          this._oTable = this.byId("idEmpTab");
        }

        aCols = this.createColumnConfig();

        oTable = this._oTable;
        oRowBinding = this.getView().getModel().getProperty("/empTab");

        oSettings = {
          workbook: {
            columns: aCols,
            hierarchyLevel: "Level",
          },
          dataSource: oRowBinding,
          fileName: "Table export sample.xlsx",
          //   worker: true, // We need to disable worker because we are using a MockServer as OData Service
        };

        oSheet = new Spreadsheet(oSettings);
        oSheet.build().finally(function () {
          oSheet.destroy();
        });
      },

      onUpload: function (e) {
        this._import(e.getParameter("files") && e.getParameter("files")[0]);
      },

      _import: function (file) {
        var that = this;
        var excelData = {};
        if (file && window.FileReader) {
          var reader = new FileReader();
          reader.onload = function (e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {
              type: "binary",
            });
            workbook.SheetNames.forEach(function (sheetName) {
              // Here is your object for every sheet in workbook
              excelData = XLSX.utils.sheet_to_row_object_array(
                workbook.Sheets[sheetName]
              );
            });
            // Setting the data to the local model
            that.localModel.setData({
              items: excelData,
            });
            that.localModel.refresh(true);
          };
          reader.onerror = function (ex) {
            console.log(ex);
          };
          reader.readAsBinaryString(file);
        }
      },

      onSelectChange: function (oEvent) {
        debugger;
        var sKey = oEvent.getParameters().selectedItem.getKey();
        var sSelectPath = oEvent.getSource().getBindingContext().sPath;
        var selectRowNo = sSelectPath.split("/")[2];
        var oModel = this.getView().getModel();
        var stabdata = oModel.getData().empTab;
        var gEmpid = stabdata[selectRowNo].empId;

        for (let i = 0; i < stabdata.length; i++) {
          var Emmpid = this.getView().getModel().getData().empTab[i].empId;
          if (Emmpid === gEmpid) {
            debugger;
            oModel.getData().empTab[i].mStat = sKey;
          }
        }
      },
      onDealer: function (oEvent) {
        this.getView().byId("idEmpTab").setShowOverlay(false);
        var trows = this.getView().byId("idEmpTab").getRows();
        for (let i = 0; i < trows.length; i++) {
          this.getView().byId("idEmpTab").getRows()[i].getCells()[1].setEditable(true);
          this.getView().byId("idEmpTab").getRows()[i].getCells()[6].setEditable(true);

          this.getView().byId("idEmpTab").getRows()[i].getCells()[2].setEditable(false);
          this.getView().byId("idEmpTab").getRows()[i].getCells()[4].setEditable(false);
          this.getView().byId("idEmpTab").getRows()[i].getCells()[7].setEditable(false);          
        }
        
        debugger;
      },
      onCsm: function (oEvent) {
        this.getView().byId("idEmpTab").setShowOverlay(false);
        var trows = this.getView().byId("idEmpTab").getRows();
        for (let i = 0; i < trows.length; i++) {
          this.getView().byId("idEmpTab").getRows()[i].getCells()[1].setEditable(false);
          this.getView().byId("idEmpTab").getRows()[i].getCells()[2].setEditable(true);
          this.getView().byId("idEmpTab").getRows()[i].getCells()[4].setEditable(true);
          this.getView().byId("idEmpTab").getRows()[i].getCells()[6].setEditable(false);
          this.getView().byId("idEmpTab").getRows()[i].getCells()[7].setEditable(true);          
        }

        debugger;
      },
      callMe: function () {
        //alert('welcome');

        //we can use the object of the button
        //First get the ui5 application object
        var oCore = sap.ui.getCore();

        //get the ui control object on which we can call ui5 functions
        var oBtn = oCore.byId("idSpiderman");

        //chaining is possible like below
        //sap.ui.getCore().byId("idSpiderman")

        //NEVER use the document API
        //var oBtn = document.getElementById("idSpiderman");

        //we can change the text using the setter function
        oBtn.setText("Change ho gaya!");
      },
      //Event handler function will get a FREE event object everytime
      onRowSelect: function (oAnubhav) {
        //Step 1: Address of the element which was selected
        var addressOfElement = oAnubhav.getParameter("rowContext").getPath();
        //Step 2: Get the object of Simple Form
        var oSimpleForm = this.getView().byId("idSimple");
        //Step 3: Bind this element to simple form so that we can take data from same memory
        oSimpleForm.bindElement(addressOfElement);

        //debugger;
        //alert('aaya kya ?');
      },
      //any function of our controller can access this global variable using this
      anu: 100,
      onInit: function () {
        this.localModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(this.localModel, "localModel");
        //alert('my controller object is ready');
        this.anu = this.anu + 120;
        //alert("global variable value is " + this.anu);
        var oModel = Model.createJSONModel("models/mockdata/sample.json");

        var oModel2 = Model.createJSONModel("models/mockdata/sample2.json");

        var oXMLModel = Model.createXMLModel();
        //Step 3: Make the model aware to the application or view or control
        //this is our default model
        this.oCore.setModel(oModel);

        //at this line -- xml model will supersed the json model
        //this.oCore.setModel(oXMLModel);

        //this concept is called named model, to avoid overwriting of default model
        this.oCore.setModel(oModel2, "got");

        var oResource = Model.createResourceModel();
        this.oCore.setModel(oResource, "i18n");

        //this.getView().byId("idEmpTab").bindRows("/empTab");
        this.getView().byId("idEmpTab").bindAggregation("rows", "/empTab");

        //Syntax No. 3: for binding property
        //this.getView().byId("idSal").bindValue("/empStr/salary");
        //Syntax No. 4 : using generic method for binding value property
        //this.getView().byId("idCurr").bindProperty("value", "/empStr/currency");
      },
      onSwtChange: function () {
        //Get the model objects for both default and named
        var oModel = this.oCore.getModel();
        var oModel2 = this.oCore.getModel("got");

        //Flip them with each other to getCore
        this.oCore.setModel(oModel2);
        this.oCore.setModel(oModel, "got");
      },
      onBeforeRendering: function () {
        // this.getView().byId("idEmpId").setValue("1001");
        // this.getView().byId("idEmpName").setValue("Anubhav");
        // this.getView().byId("idSal").setValue("10000");
        // this.getView().byId("idCurr").setValue("EUR");
        // this.getView().byId("idSmk").setSelected(false);
      },
      onAfterRendering: function () {
        $("#idXMLView--idSal").fadeOut(1000).fadeIn(5000);
      },
    });
  }
);
