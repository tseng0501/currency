import Page from './page.js'
import { DrawDataGrid, DxDataGridOptions } from './tool/dx/dxDataGrid.js';
import SendRequest from './tool/dx/sendRequest.js';
import ContractColumns from './json/contractHistory_data.js';
import {MoreAllShort} from './json/buyAllSell.js';

Page.contractHistory = {};
Page.contractHistory.draw = function (mode, config) {
    Page.contractHistory.drawHTML(mode)
    Page.contractHistory.setColumns(config)
    Page.contractHistory.drawDataGrid(config)
}

Page.contractHistory.drawHTML = function (mode) {
    const html = `
    <div id="${mode}">
        <div id="gridContainer"></div>
    </div>`;
    Page.$panel.html(html);
}

Page.contractHistory.setColumns = function (config) {
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
        } else if (element.id == "Type") {
            this._columns.push({
                dataField: element.id,
                caption: element.name,
                alignment: 'center',
                dataType: element.dataType,
                lookup: {
                    dataSource: MoreAllShort,
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
Page.contractHistory.drawDataGrid = function (config) {
    const options = {
        dataSource: new DevExpress.data.CustomStore({
            key: "ID",
            load: function () {
                return SendRequest(config.server + "/getData/contractHistory");
            },
            insert: function (values) {
                return SendRequest(config.server + "/setData/contractHistory", "POST", {
                    data: values,
                    mode: "insertOrder"
                });
            },
            update: function (key, values) {
                return SendRequest(config.server + "/setData/contractHistory", "POST", {
                    key: key,
                    data: values,
                    mode: "updateOrder"
                });
            },
            remove: function (key) {
                return SendRequest(config.server + "/setData/contractHistory", "POST", {
                    key: key,
                    mode: "deleteOrder"
                });
            }
        }),
        columns: this._columns
    }
    DrawDataGrid($('#gridContainer'), new DxDataGridOptions(options))
}