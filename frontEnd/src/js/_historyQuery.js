import Page from './page.js'
import { DrawSelectBox, DxSelectBoxOptions } from './tool/dx/dxSelectBox.js';
import { DrawDataGrid, DxDataGridOptions } from './tool/dx/dxDataGrid.js';
import { DrawButton, DxButtonOptions } from './tool/dx/dxButton.js';
import dateRange from './tool/dx/dxDateBox.js';
import Ajax from './tool/ajax.js'
import { BuyOrSell, MoreOrShort } from './json/BuyOrSell.js'
import { HistoryDropDown, HistoryQueryColumns ,HistoryQueryDateRange} from './json/historyQuery_data.js';
Page.historyQuery = {};
Page.historyQuery.draw = function (mode, config) {
    Page.historyQuery.drawDropDownListHtml(mode)
    Page.historyQuery.drawHtml(mode)
    Page.historyQuery.drawDateRange()
    Page.historyQuery._getCurrencyAjax()
    Page.historyQuery.drawBuyOrSellStatusSelectBox()
    Page.historyQuery.drawMoreOrShortStatusSelectBox()
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
                <div class="timeContent"></div>
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
    this.$BuyOrSellStatus = $("#HistoryQuery_BuyOrSellStatus")
    this.$MoreOrShortStatus = $("#HistoryQuery_MoreOrShortStatus")
    this.$gridSearch = $("#gridSearch")
    this.$gridContainer = $("#gridContainer")
    this.$timeContent = $(".timeContent")

}
Page.historyQuery.drawDateRange = function () {
    this.dateRange = new dateRange();
    this.dateRange.draw(this.$timeContent, HistoryQueryDateRange);
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
Page.historyQuery.drawBuyOrSellStatusSelectBox = function () {
    const options = {
        dataSource: BuyOrSell,
        displayExpr: 'value',
        valueExpr: 'id',
    };
    this.$BuyOrSellStatusSelectBox = DrawSelectBox(this.$BuyOrSellStatus, new DxSelectBoxOptions(options))
}
Page.historyQuery.drawMoreOrShortStatusSelectBox = function () {
    const options = {
        dataSource: MoreOrShort,
        displayExpr: 'value',
        valueExpr: 'id',
    };
    this.$MoreOrShortStatusSelectBox = DrawSelectBox(this.$MoreOrShortStatus, new DxSelectBoxOptions(options))
}
Page.historyQuery.drawSearchButton = function (mode, config) {
    const date = this.dateRange
    
    const options = {
        text: "搜尋",
        type: 'default',
        onClick: function () {
            let Currency = document.querySelector("#HistoryQuery_CurrencyID input").value
            let BuyOrSell = document.querySelector("#HistoryQuery_BuyOrSellStatus input").value
            let MoreOrShort = document.querySelector("#HistoryQuery_MoreOrShortStatus input").value
            let dateRange = date.get()

            if (!dateRange) {
                $("#gridContainer").addClass('d-none')
                return false;
            }

            let data = {
                data: {
                    CurrencyID: Currency ? Currency : null,
                    BuyOrSellStatus: BuyOrSell ? BuyOrSell : null,
                    MoreOrShortStatus: MoreOrShort ? MoreOrShort : null,
                    dateRange: dateRange

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