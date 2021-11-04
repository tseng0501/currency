import Page from "./page.js";
import LocalStorage from '../js/tool/localStorage.js';

Page.pageDrawer = {};
Page.pageDrawer.oldId = null
Page.pageDrawer.draw = function (r, user) {
    let data = r
    let config = new LocalStorage('config');
    config = config.get();
    data = data.map((x) => {
        const newItem = {};

        if (x.enable == true) {
            newItem.id = x.id;
            newItem.text = x.text;
            newItem.mode = x.mode;
            newItem.icon = x.icon;
            newItem.items = x.items;
            newItem.url = x.url;

            newItem.items?.map((historyItem) => {
                const newhistoryItem = {}

                if (historyItem.enable == true) {
                    newhistoryItem.id = historyItem.id
                    newhistoryItem.text = historyItem.text
                    newhistoryItem.mode = historyItem.mode
                    newhistoryItem.icon = historyItem.icon
                    newhistoryItem.url = historyItem.url;
                }
                return newhistoryItem
            })
        }
        return newItem
    })
    var newData = data.filter(value => Object.keys(value).length !== 0).map((group) => {

        return { ...group, items: group.items?.filter(value => value.enable) }
    })

    $("#Menu").dxMenu({
        dataSource: newData,
        onItemClick: function (data) {
            Page.pageDrawer.resetMainContentHtml();
            const mode = data.itemData.mode;

            switch (mode) {
                case 'CurrencyManagement':
                    Page.currencyManagement.draw(mode, config);
                    break;
                case 'SpotGoodsManagement':
                    Page.spotGoodsManagement.draw(mode, config);
                    break;
                case 'ContractManagement':
                    Page.contractManagement.draw(mode, config);
                    break;
                case 'HistoryQuery':
                    Page.historyQuery.draw(mode, config);
                    break;
                default:
            }
            Page.pageDrawer.oldId = data.itemData.mode
        }
    }).dxMenu("instance");
    let firstMode = newData[0].mode;
    console.log(firstMode)
    if (user == "view") {
        Page.currencyManagement.draw("CurrencyManagement", config)

    } else {
        Page.currencyManagement.draw(firstMode, config)
    }
}
Page.pageDrawer.resetMainContentHtml = function () {
    Page.clear();
}
