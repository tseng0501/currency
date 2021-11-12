import Page from './page.js'
import { HistoryDropDown, HistoryQueryColumns } from './json/historyQuery_data.js';
import { DrawSelectBox, DxSelectBoxOptions } from './tool/dx/dxSelectBox.js';
import { DrawDataGrid, DxDataGridOptions } from './tool/dx/dxDataGrid.js';
import { DrawButton, DxButtonOptions } from './tool/dx/dxButton.js';
import Ajax from './tool/ajax.js'
import { BuyAllSell, MoreAllShort } from './json/buyAllSell.js'
Page.historyQuery = {};
Page.historyQuery.draw = function (mode, config) {
    Page.historyQuery.drawDropDownListHtml(mode)
    Page.historyQuery.drawHtml(mode)
    Page.historyQuery._getCurrencyAjax()
    Page.historyQuery.drawBuyAllSellStatusSelectBox()
    Page.historyQuery.drawMoreAllShortStatusSelectBox()
    Page.historyQuery.drawSearchButton(mode, config)
}

Page.historyQuery.drawDropDownListHtml = function (mode) {
    let maindropdownhtml = '';

    for (let i = 0; i < HistoryDropDown.length; i++) {
        const element = HistoryDropDown[i];
        maindropdownhtml += `
        <div class="input-group">
            <div class="input-group-textselect">${element.value}</div>
            <div class="dx-field-value">
                <div id="${mode}_${element.name}"></div>
            </div>
        </div>
        `
    }
    this.maindropdownhtml = `${maindropdownhtml}`
}
Page.historyQuery.drawHtml = function (mode) {
    const html = `
        <div id="${mode}">
            <div id="${mode}Filter">
                ${this.maindropdownhtml}
                <div class="inventoryblock">
                    <div id="gridSearch"></div>
                    <div id="gridClearSelection"></div>
                </div>
            </div>
            <div id="${mode}Panel">
                <div id="gridContainer"></div>
            </div>
        </div>`;
    Page.$panel.html(html);
    this.$panel = this.$panel
    this.$currencyID = $("#HistoryQuery_CurrencyID")
    this.$buyAllSellStatus = $("#HistoryQuery_BuyAllSellStatus")
    this.$moreAllShortStatus = $("#HistoryQuery_MoreAllShortStatus")
    this.$gridSearch = $("#gridSearch")
    this.$gridContainer = $("#gridContainer")
}
Page.historyQuery._getCurrencyAjax = function () {
    Ajax({
        customizedUrl: '/getData/currencyID',
        ajaxType: 'GET',
        success: function (r) {
            Page.historyQuery.drawCurrencyIDSelectBox(r)
        },
        error: function () {
            DevExpress.ui.notify("請求失敗", "error", 2000);
        },
    })
}
Page.historyQuery.drawCurrencyIDSelectBox = function (data) {

    const options = {
        dataSource: new DevExpress.data.ArrayStore({
            data: data,
            key: 'CurrencyID',
        }),
        displayExpr: 'CurrencyName',
        valueExpr: 'CurrencyID',
    };
    this.$currencySelectBox = DrawSelectBox(this.$currencyID, new DxSelectBoxOptions(options))
}
Page.historyQuery.drawBuyAllSellStatusSelectBox = function () {
    const options = {
        dataSource: BuyAllSell,
        displayExpr: 'value',
        valueExpr: 'id',
    };
    this.$buyAllSellStatusSelectBox = DrawSelectBox(this.$buyAllSellStatus, new DxSelectBoxOptions(options))
}
Page.historyQuery.drawMoreAllShortStatusSelectBox = function () {
    const options = {
        dataSource: MoreAllShort,
        displayExpr: 'value',
        valueExpr: 'id',
    };
    this.$moreAllShortStatusSelectBox = DrawSelectBox(this.$moreAllShortStatus, new DxSelectBoxOptions(options))
}
Page.historyQuery.drawSearchButton = function (mode, config) {
    const options = {
        text: "搜尋",
        type: 'default',
        onClick: function () {
            let Currency = document.querySelector("#HistoryQuery_CurrencyID input").value
            let BuyAllSell = document.querySelector("#HistoryQuery_BuyAllSellStatus input").value
            let MoreAllShort = document.querySelector("#HistoryQuery_MoreAllShortStatus input").value

            let data = {
                data: {
                    CurrencyID: Currency ? Currency : null,
                    BuyAllSellStatus: BuyAllSell ? BuyAllSell : null,
                    MoreAllShortStatus: MoreAllShort ? MoreAllShort : null,
                },
                mode: mode
            }
            Ajax({
                customizedUrl: '/getData/historyQuery',
                data: data,
                success: function (r) {
                    Page.historyQuery.setColumns(config)
                    Page.historyQuery.drawDataGrid(r)
                    DevExpress.ui.notify("請求成功", "success", 2000);
                },
                error: function () {
                    DevExpress.ui.notify("請求失敗", "error", 2000);
                }
            })
        }
    };
    this.$dxbutton = DrawButton(this.$gridSearch, new DxButtonOptions(options))
}
Page.historyQuery.setColumns = function (config) {
    this._columns = []
    for (let i = 0; i < HistoryQueryColumns.length; i++) {
        const element = HistoryQueryColumns[i];
        if (element.id == "Type") {
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
        else if (element.id == "Bargain") {
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
Page.historyQuery.drawDataGrid = function (data) {
    const options = {
        dataSource: data,
        editing: {
            allowAdding: false,
            allowDeleting: false,
            allowUpdating: false,
        },
        columns: this._columns,
        paging: {
            pageSize: 15
        }
    }
    this.$datagrid = DrawDataGrid(this.$gridContainer, new DxDataGridOptions(options))
    this.$dxDataGrid = this.$datagrid.dxDataGrid('instance');
}