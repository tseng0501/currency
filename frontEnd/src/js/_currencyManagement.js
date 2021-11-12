import Page from './page.js'
import { DrawDataGrid, DxDataGridOptions } from './tool/dx/dxDataGrid.js';
import SendRequest from './tool/dx/sendRequest.js';
import CurrencyColumns from './json/currencyManagement_data.js'
Page.currencyManagement = {};
Page.currencyManagement.draw = function (mode,config) {
    Page.currencyManagement.drawHTML(mode)
    Page.currencyManagement.setColumns()
    Page.currencyManagement.drawDataGrid(config)
}

Page.currencyManagement.drawHTML = function (mode) {
    const html = `
    <div id="${mode}">
        <div id="gridContainer"></div>
    </div>`;
    Page.$panel.html(html);
}

Page.currencyManagement.setColumns = function () {
    this._columns = []
    for (let i = 0; i < CurrencyColumns.length; i++) {
        const element = CurrencyColumns[i];
        if (element.allowEditing == false) {
            this._columns.push({
                dataField: element.id,
                caption: element.name,
                alignment: 'center',
                dataType:element.dataType,
                allowEditing: element.allowEditing
            });
        }
        else {
            this._columns.push({
                dataField: element.id,
                caption: element.name,
                dataType:element.dataType,
                alignment: 'center',
                format: element.format
            });
        }
    }
}
Page.currencyManagement.drawDataGrid = function (config) {
    const options = {
        dataSource: new DevExpress.data.CustomStore({
            key: "ID",
            load: function () {
                return SendRequest(config.server + "/getData/currencyManagement");
            },
            insert: function (values) {
                return SendRequest(config.server + "/setData/currencyManagement", "POST", {
                    data: values,
                    mode: "insertOrder"
                });
            },
            update: function (key, values) {
                return SendRequest(config.server + "/setData/currencyManagement", "POST", {
                    key: key,
                    data: values,
                    mode: "updateOrder"
                });
            },
            remove: function (key) {
                return SendRequest(config.server + "/setData/currencyManagement", "POST", {
                    key: key,
                    mode: "deleteOrder"
                });
            }
        }),
        columns: this._columns
    }
    DrawDataGrid($('#gridContainer'), new DxDataGridOptions(options))
}