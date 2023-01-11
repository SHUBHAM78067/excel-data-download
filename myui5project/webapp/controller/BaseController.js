sap.ui.define([
    'sap/ui/core/mvc/Controller'
], function(Controller) {
    'use strict';
    return Controller.extend("mickey.controller.BaseController",{
        x: "this is a reuse variable",
        oCore: sap.ui.getCore(),
        someResueableFunction(){
            alert('Bahubali')
        }
    });
});