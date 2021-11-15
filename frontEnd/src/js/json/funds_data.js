const AccountList = [{
    id: 1,
    value: '使用者',
    name: "user"
}, {
    id: 2,
    value: '帳號',
    name: "account"

}]

const WalletList = [{
    id: 1,
    value: '新增錢包',
    name: "AddWallet"
}, {
    id: 2,
    value: '領取錢包',
    name: "ClaimNumber"

}]

const Types = [{
    id:1,
    name:'30日',
    value:'OneMonth'
},{
    id:2,
    name:'90日',
    value:'TwoMonth'
},{
    id:3,
    name:'180日',
    value:'ThreeMonth'
},{
    id:4,
    name:'1年',
    value:'OneYear'
}];

const FundsCoulumns = [
    {
        "id": "ID",
        "name": "No",
    },
    {
        "id": "Date",
        "dataType": 'datetime',
        "name": "日期",
        "format": 'yyyy/MM/dd HH:mm:ss'
    },
    {
        "id": "AddWallet",
        "dataType": 'number',
        "name": "新增錢包",
    },
    {
        "id": "ClaimNumber",
        "dataType": 'number',
        "name": "領取錢包",
    },
    {
        "id": "Balance",
        "dataType": 'number',
        "name": "餘額",
    }
];
export { AccountList, WalletList ,Types,FundsCoulumns}