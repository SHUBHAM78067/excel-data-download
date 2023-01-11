sap.ui.jsview("mickey.view.Main",{
    //as per documentation, there are 2 standard functions we need to add
    //to a JS view
    //1. this will return the name of controller where we written the processing
    //   logic of our view
    getControllerName: function(){
        return "mickey.controller.Main";
    },
    //2. We have to create object of UI Controls e.g Button and return that out
    createContent: function(oController){
        var oBtn = new sap.m.Button({
            id: "idSpiderman",
            text: "Spidy",
            press: oController.callMe
        });

        return oBtn;
    }
});