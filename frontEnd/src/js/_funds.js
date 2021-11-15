import Page from './page.js'
import { DrawDataGrid, DxDataGridOptions } from './tool/dx/dxDataGrid.js';
import { DrawButton, DxButtonOptions } from './tool/dx/dxButton.js';
import { DrawTextBox, DxTextBoxOptions } from './tool/dx/dxTextBox.js';
import { AccountList, WalletList, Types, FundsCoulumns } from './json/funds_data.js';
import LocalStorage from './tool/localStorage.js'
import Ajax from './tool/ajax.js';


Page.funds = {};
Page.funds.draw = function (mode, config) {
    let ls = new LocalStorage('user');
    ls = ls.get();

    Page.funds.drawTotalHtml()
    Page.funds.drawWalletHtml(mode)
    Page.funds.drawAccountHtml(mode)
    Page.funds.drawHtml(mode)
    Page.funds.AddWalletBtn(config)
    Page.funds.ClaimNumberBtn(config)
    Page.funds._getAjax(mode, ls)
    Page.funds._getAssetAjax(mode, ls)
    Page.funds._getTableAjax(mode, ls)
}

Page.funds.drawTotalHtml = function () {

    const total = `
        <div id="Total">
            <div class="total_title">總金額</div>
            <div class="total_amount"></div>
            <div class="total_type"></div>
        </div>`;
    this.total = `${total}`
}

Page.funds.drawWalletHtml = function (mode) {
    let wallet = '';

    for (let i = 0; i < WalletList.length; i++) {
        const element = WalletList[i];
        wallet += `
        <div class="input-group">
            <div class="dx-field-value">
                <div id="${mode}_${element.name}"></div>
            </div>
        </div>
        `
    }
    this.wallet = `${wallet}`
}
Page.funds.drawAccountHtml = function (mode) {
    let account = '';

    for (let i = 0; i < AccountList.length; i++) {
        const element = AccountList[i];
        account += `
        <div class="input-group">
            <div class="input-group-textselect">${element.value}</div>
            <div class="dx-field-value">
                <div id="${mode}_${element.name}"></div>
            </div>
        </div>
        `
    }
    this.account = `${account}`
}
Page.funds.AddWalletBtn = function (config) {
    this.$funds_AddWallet = $("#Funds_AddWallet")

    const options = {
        text: '新增錢包',
        type: 'normal',
        width: 150,
        onClick() {
            DevExpress.ui.notify('新增錢包');
            const $popup = $('<div id="DxPopup-AddWalletinfo" class="addWallet-info"></div>').appendTo('body');
            $popup.dxPopup({
                contentTemplate: function () {
                    return $("<div class='popupContentTemplate'>").append(
                        $(`<p>請輸入新增錢包數量： <input type="number" id="AddWalletInput" value='' min='1'></p>`),
                    );
                },
                showCloseButton: true,
                showTitle: true,
                dragEnabled: true,
                title: "新增錢包",
                visible: true,
                width: 400,
                height: 200,
                position: {
                    at: "center",
                    my: "center",
                },
                toolbarItems: [{
                    widget: "dxButton",
                    toolbar: "bottom",
                    location: "before",
                    options: {
                        text: "取消",
                        onClick: function (e) {
                            $popup.hide();
                        }
                    }
                }, {
                    widget: "dxButton",
                    toolbar: "bottom",
                    location: "after",
                    options: {
                        text: "確定",
                        onClick: function (e) {
                            const count = document.querySelector('#AddWalletInput').value
                            $.ajax({
                                url: config.server + "/funds/AddWallet",
                                type: 'PUT',
                                data: JSON.stringify({ count }),
                                success: function (r) {
                                    DevExpress.ui.notify("請求成功", textStatus, 3000);
                                    dataGrid.refresh()
                                },
                                error: function (xhr, textStatus) {
                                    let message = xhr.responseJSON.message
                                    DevExpress.ui.notify("請求失敗 " + message, textStatus, 3000);
                                }
                            });
                            $popup.hide();
                        },
                    }
                }],
                onHidden: function (e) {
                    e.element.remove();
                },
                closeOnOutsideClick: function () {
                    return $("#DxPopup-AddWalletinfo").get()[0];
                },
            });
        },
    }
    this.$addWallet_dxbutton = DrawButton(this.$funds_AddWallet, new DxButtonOptions(options))
}
Page.funds.ClaimNumberBtn = function (config) {
    this.$funds_ClaimNumber = $("#Funds_ClaimNumber")

    const options = {
        text: '領取錢包',
        type: 'normal',
        width: 150,
        onClick() {
            DevExpress.ui.notify('領取錢包');
            const $popup = $('<div id="DxPopup-ClaimNumberinfo" class="claimNumber-info"></div>').appendTo('body');
            $popup.dxPopup({
                contentTemplate: function () {
                    return $("<div class='popupContentTemplate'>").append(
                        $(`<p>請輸入領取錢包數量： <input type="number" id="ClaimNumberInput" value='' min='1'></p>`),
                    );
                },
                showCloseButton: true,
                showTitle: true,
                dragEnabled: true,
                title: "領取錢包",
                visible: true,
                width: 400,
                height: 200,
                position: {
                    at: "center",
                    my: "center",
                },
                toolbarItems: [{
                    widget: "dxButton",
                    toolbar: "bottom",
                    location: "before",
                    options: {
                        text: "取消",
                        onClick: function (e) {
                            $popup.hide();
                        }
                    }
                }, {
                    widget: "dxButton",
                    toolbar: "bottom",
                    location: "after",
                    options: {
                        text: "確定",
                        onClick: function (e) {
                            const count = document.querySelector('#ClaimNumberInput').value
                            $.ajax({
                                url: config.server + "/funds/ClaimNumber",
                                type: 'PUT',
                                data: JSON.stringify({ count }),
                                success: function (r) {
                                    DevExpress.ui.notify("請求成功", textStatus, 3000);
                                    dataGrid.refresh()
                                },
                                error: function (xhr, textStatus) {
                                    let message = xhr.responseJSON.message
                                    DevExpress.ui.notify("請求失敗 " + message, textStatus, 3000);
                                }
                            });
                            $popup.hide();
                        },
                    }
                }],
                onHidden: function (e) {
                    e.element.remove();
                },
                closeOnOutsideClick: function () {
                    return $("#DxPopup-ClaimNumberinfo").get()[0];
                },
            });
        },
    }
    this.$claimNumber_dxbutton = DrawButton(this.$funds_ClaimNumber, new DxButtonOptions(options))
}
Page.funds.drawHtml = function (mode) {
    const html = `
        <div id="${mode}">
            <div id="${mode}Filter">
                ${this.total}
                <div id="Wallet">
                    ${this.wallet}
                </div>
                <div id="Account">
                    ${this.account}
                </div>
            </div>
            <div id="Chart"></div>
            <div class="option">
                <span class="options_text">類型</span>
                <div id="Types"></div>
          </div>
        <div id="gridContainer"></div>
        </div>`;

    Page.$panel.html(html);
    this.$panel = this.$panel
}
Page.funds._getAjax = function (mode, ls) {
    let data = {
        id: ls.id,
        mode: mode
    }
    Ajax({
        customizedUrl: "/funds/account",
        data: data,
        success: function (r) {

            Page.funds.userInput(r.User)
            Page.funds.accountInput(r.Account)
            Page.funds.totalText(r)
        }
    })
}
Page.funds._getAssetAjax = function (mode, ls) {
    let data = {
        id: ls.id,
        mode: mode
    }
    Ajax({
        customizedUrl: "/funds/asset",
        data: data,
        success: function (r) {

            Page.funds.assetChart(r)
        }
    })
}
Page.funds._getTableAjax = function (mode, ls) {
    let data = {
        id: ls.id,
        mode: mode
    }
    Ajax({
        customizedUrl: "/funds/tabel",
        data: data,
        success: function (r) {

            Page.funds.setColumns()
            Page.funds.drawDataGrid(r)
        }
    })
}
Page.funds.totalText = function (data) {
    $('.total_amount').text(data.Total)
    $('.total_type').text(data.Type)
}
Page.funds.userInput = function (data) {
    this.$funds_user = $("#Funds_user")
    const options = {
        value: data,
        disabled: true,
    }
    this.$user_dxTextBox = DrawTextBox(this.$funds_user, new DxTextBoxOptions(options))
}
Page.funds.accountInput = function (data) {
    this.$funds_account = $("#Funds_account")

    const options = {
        value: data,
        disabled: true,
    }
    this.$account_dxTextBox = DrawTextBox(this.$funds_account, new DxTextBoxOptions(options))
}
Page.funds.assetChart = function (data) {
    const chart = $('#Chart').dxChart({
        palette: 'Harmony Light',
        dataSource: data.OneMonth,
        commonSeriesSettings: {
            type: 'area',
            argumentField: 'Date',
        },
        series: [
            { valueField: 'Value' },
        ],
        margin: {
            bottom: 20,
        },
        argumentAxis: {
            valueMarginsEnabled: false,
            label: {
                customizeText: function (e) {
                    return moment(e.value).format('YYYY/MM/DD HH:mm:ss')
                },
                font: {
                    size: 16
                }
            },
        },
        export: {
            enabled: true,
        },
        legend: {
            visible: false,
        },
        tooltip: {
            enabled: true,
            customizeTooltip(arg) {
                let time = moment(arg.argument).format('YYYY/MM/DD HH:mm:ss')
                return {
                    text: `${time}<br/>${arg.valueText}`,
                };
            },
        },
    }).dxChart('instance');

    $('#Types').dxSelectBox({
        dataSource: new DevExpress.data.ArrayStore({
            data: Types,
            key: 'id',
        }),
        displayExpr: 'name',
        valueExpr: 'value',
        value: Types[0].value,
        onValueChanged(e) {
            let newData = e.value;

            if (newData === 'OneMonth') {
                chart.option('dataSource', data.OneMonth);
            }
            else if (newData === 'TwoMonth') {
                chart.option('dataSource', data.TwoMonth);
            }
            else if (newData === 'ThreeMonth') {
                chart.option('dataSource', data.ThreeMonth);
            }
            else {
                chart.option('dataSource', data.OneYear);
            }
        },
    });
}
Page.funds.setColumns = function () {
    this._columns = []
    for (let i = 0; i < FundsCoulumns.length; i++) {
        const element = FundsCoulumns[i];
        this._columns.push({
            dataField: element.id,
            caption: element.name,
            dataType: element.dataType,
            alignment: 'center',
            format: element.format
        });
    }
}
Page.funds.drawDataGrid = function (data) {
    const options = {
        dataSource: data,
        columns: this._columns,
        editing: {
            allowAdding: false,
            allowDeleting: false,
            allowUpdating: false,
        },
        paging: {
            pageSize: 5,
        },
        showColumnLines: false
    }
    DrawDataGrid($('#gridContainer'), new DxDataGridOptions(options))
}