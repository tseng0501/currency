import Page from './page.js'
import { DrawDataGrid, DxDataGridOptions } from './tool/dx/dxDataGrid.js';
import SendRequest from './tool/dx/sendRequest.js';
import ContractColumns from './json/contractManagement_data.js';
import { MoreOrShort ,BuyOrSell,OpenOrClose} from './json/BuyOrSell.js';

Page.contractManagement = {};
Page.contractManagement.draw = function (mode, config) {
    Page.contractManagement.drawHTML(mode)
    Page.contractManagement.setColumns(config)
    Page.contractManagement.drawDataGrid(config)
}

Page.contractManagement.drawHTML = function (mode) {
    const html = `
    <div id="${mode}">
        <div id="gridContainer"></div>
    </div>`;
    Page.$panel.html(html);
}

Page.contractManagement.setColumns = function (config) {
    this._columns = []
    for (let i = 0; i < ContractColumns.length; i++) {
        const element = ContractColumns[i];
        if (element.allowEditing == false) {
            this._columns.push({
                dataField: element.id,
                caption: element.name,
                alignment: 'center',
                dataType: element.dataType,
                allowEditing: element.allowEditing
            });
        }
        else if (element.id == "Type") {
            this._columns.push({
                dataField: element.id,
                caption: element.name,
                alignment: 'center',
                dataType: element.dataType,
                lookup: {
                    dataSource: MoreOrShort,
                    displayExpr: "value",
                    valueExpr: "id"
                },
                cellTemplate: function (element, info) {
                    if (info.text === '做空') {
                        element.append("<div>" + info.text + "</div>")
                            .css("color", "red");
                    } else {
                        element.append("<div>" + info.text + "</div>")
                            .css("color", "green");
                    }
                }
            });
        }
        else if (element.id == "Bargain") {
            this._columns.push({
                dataField: element.id,
                caption: element.name,
                alignment: 'center',
                dataType: element.dataType,
                lookup: {
                    dataSource: BuyOrSell,
                    displayExpr: "value",
                    valueExpr: "id"
                },
                cellTemplate: function (element, info) {
                    if (info.text === '買') {
                        element.append("<div>" + info.text + "</div>")
                            .css("color", "red");
                    } else {
                        element.append("<div>" + info.text + "</div>")
                            .css("color", "green");
                    }
                }
            });
        }
        else if (element.id === 'CurrencyID') {
            this._columns.push({
                dataField: element.id,
                caption: element.name,
                alignment: 'center',
                lookup: {
                    dataSource: DevExpress.data.AspNet.createStore({
                        key: "CurrencyID",
                        loadMode: "raw",
                        loadUrl: config.server + "/getData/currencyID",
                    }),
                    valueExpr: "CurrencyID",
                    displayExpr: "CurrencyName"
                }
            });
        }
        else if (element.id == "OpenOrClose") {
            this._columns.push({
                dataField: element.id,
                caption: element.name,
                alignment: 'center',
                dataType: element.dataType,
                lookup: {
                    dataSource: OpenOrClose,
                    displayExpr: "value",
                    valueExpr: "id"
                },
            });
        }
        else if (element.id == "ProfitOrLoss") {
            this._columns.push({
                dataField: element.id,
                caption: element.name,
                alignment: 'center',
                dataType: element.dataType,
                cellTemplate: function (element, info) {
                    if (info.text <=0) {
                        element.append("<div>" + info.text + "</div>")
                            .css("color", "red");
                    } else {
                        element.append("<div>" + info.text + "</div>")
                            .css("color", "green");
                    }
                }
              
            });
        }
        else {
            this._columns.push({
                dataField: element.id,
                caption: element.name,
                dataType: element.dataType,
                alignment: 'center',
                format: element.format
            });
        }
    }
}
Page.contractManagement.drawDataGrid = function (config) {
    const options = {
        dataSource: new DevExpress.data.CustomStore({
            key: "ID",
            load: function () {
                return SendRequest(config.server + "/getData/contractManagement");
            },
            insert: function (values) {
                return SendRequest(config.server + "/setData/contractManagement", "POST", {
                    data: values,
                    mode: "insertOrder"
                });
            },
            update: function (key, values) {
                return SendRequest(config.server + "/setData/contractManagement", "POST", {
                    key: key,
                    data: values,
                    mode: "updateOrder"
                });
            },
            remove: function (key) {
                return SendRequest(config.server + "/setData/contractManagement", "POST", {
                    key: key,
                    mode: "deleteOrder"
                });
            }
        }),
        columns: this._columns
    }
    DrawDataGrid($('#gridContainer'), new DxDataGridOptions(options))
}