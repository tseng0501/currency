import Page from './page.js'
import { DrawDataGrid, DxDataGridOptions } from './tool/dx/dxDataGrid.js';
import SendRequest from './tool/dx/sendRequest.js';
import SpotGoodsColumns from './json/spotGoodsHistory_data.js';
import {BuyAllSell} from './json/buyAllSell.js';

Page.spotGoodsHistory = {};
Page.spotGoodsHistory.draw = function (mode, config) {
    Page.spotGoodsHistory.drawHTML(mode)
    Page.spotGoodsHistory.setColumns(config)
    Page.spotGoodsHistory.drawDataGrid(config)
}

Page.spotGoodsHistory.drawHTML = function (mode) {
    const html = `
    <div id="${mode}">
        <div id="gridContainer"></div>
    </div>`;
    Page.$panel.html(html);
}

Page.spotGoodsHistory.setColumns = function (config) {
    this._columns = []
    for (let i = 0; i < SpotGoodsColumns.length; i++) {
        const element = SpotGoodsColumns[i];
        if (element.allowEditing == false) {
            this._columns.push({
                dataField: element.id,
                caption: element.name,
                alignment: 'center',
                dataType: element.dataType,
                allowEditing: element.allowEditing
            });
        } else if (element.id == "Bargain") {
            this._columns.push({
                dataField: element.id,
                caption: element.name,
                alignment: 'center',
                dataType: element.dataType,
                lookup: {
                    dataSource: BuyAllSell,
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
Page.spotGoodsHistory.drawDataGrid = function (config) {
    const options = {
        dataSource: new DevExpress.data.CustomStore({
            key: "ID",
            load: function () {
                return SendRequest(config.server + "/getData/spotGoodsHistory");
            },
            insert: function (values) {
                return SendRequest(config.server + "/setData/spotGoodsHistory", "POST", {
                    data: values,
                    mode: "insertOrder"
                });
            },
            update: function (key, values) {
                return SendRequest(config.server + "/setData/spotGoodsHistory", "POST", {
                    key: key,
                    data: values,
                    mode: "updateOrder"
                });
            },
            remove: function (key) {
                return SendRequest(config.server + "/setData/spotGoodsHistory", "POST", {
                    key: key,
                    mode: "deleteOrder"
                });
            }
        }),
        columns: this._columns
    }
    DrawDataGrid($('#gridContainer'), new DxDataGridOptions(options))
}