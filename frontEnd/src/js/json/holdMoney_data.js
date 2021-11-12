const Tabs = [
    {
        id: 0,
        text: "現貨",
        icon: "fas fa-dollar-sign",
        name: "goods"
    },
    {
        id: 1,
        text: "合約",
        icon: "fas fa-handshake",
        name: "contract"
    }
];

const GoodsColumns = [
    {
        "id": "ID",
        "dataType": 'string',
        "name": "No",
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
        "id": "AveragePrice",
        "dataType": 'number',
        "name": "均價",
    }
];
const ContactColumns = [
    {
        "id": "ID",
        "dataType": 'string',
        "name": "No",
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
        "id": "AveragePrice",
        "dataType": 'number',
        "name": "均價",
    },
    {
        "id": "OpeningPrice",
        "dataType": 'number',
        "name": "開倉價格",
    },
    {
        "id": "Multiple",
        "dataType": 'number',
        "name": "倍數",
    }
];
export { Tabs,GoodsColumns, ContactColumns }