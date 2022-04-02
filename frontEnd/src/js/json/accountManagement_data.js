const Authority = [
    {
        "id": 1,
        "value": 1
    }, {
        "id": 2,
        "value": 2
    }
];

const StateId = [
    {
        "id": 0,
        "value": "啟用"
    }, {
        "id": 1,
        "value": "停用"
    }
]
const AccountColumns = [
    {
        "id": "ID",
        "name": "No",
        "allowEditing": false
    }, {
        "id": "Account",
        "name": "帳號",
    }, {
        "id": "User",
        "name": "使用者",
    },  {
        "id": "Password",
        "name": "密碼",
    }, {
        "id": "Authority",
        "name": "權限",
    }, {
        "id": "Enable",
        "name": "啟用/停用",
    }
]
export {Authority, StateId, AccountColumns}