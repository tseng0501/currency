const ContractColumns = [
    {
        "id": "ID",
        "name": "No",
        "allowEditing": false
    },
    {
        "id": "Date",
        "dataType": 'datetime',
        "name": "日期",
        "format": 'yyyy/MM/dd HH:mm:ss'
    },
    {
        "id": "CurrencyID",
        "name": "貨幣名稱",
    },
    {
        "id": "Number",
        "dataType": 'number',
        "name": "數量",
    },
    {
        "id": "Price",
        "dataType": 'number',
        "name": "掛單價格",
    },
    {
        "id": "Turnover",
        "dataType": 'number',
        "name": "成交額",
    },
    {
        "id": "Bargain",
        "dataType": 'number',
        "name": "買/賣",
    },
    {
        "id": "Type",
        "dataType": 'number',
        "name": "做多/做空",
    },
    {
        "id": "Remark",
        "dataType": 'string',
        "name": "備註",
    }
];

export default ContractColumns