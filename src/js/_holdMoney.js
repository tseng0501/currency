import Page from './page.js'

import { DrawDataGrid, DxDataGridOptions } from './tool/dx/dxDataGrid.js';
import Ajax from './tool/ajax.js'
import { Tabs, GoodsColumns, ContactColumns } from './json/holdMoney_data.js'
Page.holdMoney = {};
Page.holdMoney.draw = function (mode, config) {

    Page.holdMoney._getGoodsAjax(mode, config)
    Page.holdMoney.drawHtml(mode)
    Page.holdMoney.drawTabs(mode, config)
}

Page.holdMoney.drawHtml = function (mode) {
    const html = `
        <div id="${mode}">
            <div id="tabs">
                <div class="tabs-container"></div>
                <div class="dx-fieldset">
                    <div id="content"></div>
                </div>
            </div>
            <div id="gridContainer"></div>
        </div>`;
    Page.$panel.html(html);
    this.$content = $('#content')
}
Page.holdMoney.drawTabs = function (mode, config) {

    var tabsInstance = $("#tabs > .tabs-container").dxTabs({
        dataSource: Tabs,
        selectedIndex: 0,
        onItemClick: function (e) {
            let tagsId = e.itemData.id
            let tagsName = e.itemData.name
            if (tagsId === 0) {
                Page.holdMoney._getGoodsAjax(mode, config, tagsName)
            } else if (tagsId === 1) {
                Page.holdMoney._getGoodsAjax(mode, config, tagsName)
            }
            // Page.holdMoney.clear()
        }
    }).dxTabs("instance");
}
Page.holdMoney._getGoodsAjax = function (mode, config, tagsName) {
    console.log(tagsName, "tag")
    const data = {
        mode: mode,
        tags: tagsName === undefined ? 'goods' : tagsName
    }

    Ajax({
        customizedUrl: '/getData/holdMoney',
        data: data,
        success: function (r) {
            Page.holdMoney.setGoodsColumns(config, tagsName)
            Page.holdMoney.drawGoodsDataGrid(r)
        },
        error: function () {
            DevExpress.ui.notify("請求失敗", "error", 2000);
        },
    })
}
Page.holdMoney.setGoodsColumns = function (config, tagsName) {
    this._columns = [];
    let tags;
    if (tagsName === 'contract') {
        tags = ContactColumns
    }else{
        tags = GoodsColumns
    }
    for (let i = 0; i < tags.length; i++) {
        const element = tags[i];
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
Page.holdMoney.drawGoodsDataGrid = function (data) {

    const options = {
        dataSource: data,
        columns: this._columns,
        paging: {
            pageSize: 15
        },
        editing: {
            allowAdding: false,
            allowDeleting: false,
            allowUpdating: false,
        }
    }
    this.$datagrid = DrawDataGrid($('#gridContainer'), new DxDataGridOptions(options))
    this.$dxDataGrid = this.$datagrid.dxDataGrid('instance');
}

Page.holdMoney.clear = function () {
    if (this.$dxDataGrid) {
        this.$dxDataGrid.refresh()
    }
    $("#gridContainer").addClass('d-none')
}
Page.holdMoney.refresh = function () {
    this.$dxDataGrid.refresh()
}