from types import new_class
from fastapi import (
    FastAPI,
    Response,
    Request,
    Query,
    Header
)
from fastapi.responses import (
    HTMLResponse,
    FileResponse,
    StreamingResponse
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from tortoise.contrib.fastapi import register_tortoise
import io
import pandas as pd
from typing import Optional

import argparse
from pathlib import Path
import time
import random as ran
from pydantic import (
    BaseModel,
    Field,
    conint
)
import datetime
import calendar
import copy
import json
import uuid
from faker import Faker

fake = Faker('zh_TW')


#region 設定 Fastapi

#建立 app 實例
app = FastAPI(
    title="EMS-fastapi 模組",
    # docs_url="/documentation", #重新導向 /docs 的url
    # redoc_url=None, #關閉 /redoc 功能
)

#解決 CORS 問題
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# #設定前端文件:靜態文件與HTML檔
# app.mount("/static", StaticFiles(directory="static"), name="static")
# templates = Jinja2Templates(directory="templates")


# 確保 UUID4 亂數產生器每次產生都是同一批
uuid_ran = ran.Random()
uuid_ran.seed(0)
uuid4 = uuid.uuid4
uuid.uuid4 = lambda: uuid.UUID(int=uuid_ran.getrandbits(128))

#region 虛擬貨幣

#region 登入
#region /login
class CurrueryLogin(BaseModel):
    User: str
    Password: str


class CurrueryLogin(BaseModel):
    data: CurrueryLogin

@app.post("/login")
async def sanho_login(CurrueryLogin: CurrueryLogin):
    if (CurrueryLogin.data.User == "1") and (CurrueryLogin.data.Password == "1"):
        mode = "view"
    elif (CurrueryLogin.data.User == "2") and (CurrueryLogin.data.Password == "2"):
        mode = "manager"
    else:
        mode = False
    return {
        "status": True,
        "message": '',
        "data": {
            "id":fake.ssn(),
            "mode": mode,  # view/manager
            "token":str(uuid.uuid4()),

        }
    }

#endregion /login
#endregion 登入

#region /getData/accountManagement 
@app.get("/getData/accountManagement")
async def getData_accountManagement():
    return {
        "status":True,
        "data":[{
            "ID": i + 1,
            "User": fake.name_male(),
            "Password": fake.ssn(),
            "Authority": ran.randint(1,2),
            "Enable": ran.randint(0,1)
        }
        for i in range(30)
        ]
    }

#endregion /getData/accountManagement

#region 貨幣管理
#region /getData/currencyManagement
@app.get("/getData/currencyManagement")
async def getData_currencyManagement():
    return {
        "status":True,
        "data":[{
            "ID": i + 1,
            "Name": fake.currency_code(),
            "Describe": fake.words(),
            "Remark":fake.words()
        }
        for i in range(10)
        ]
    }

#endregion /getData/currencyManagement
#endregion 貨幣管理

#region 現貨歷史
#region /getData/currencyID
@app.get("/getData/currencyID")
async def getData_currencyManagement():
    return {
        "status":True,
        "data":[{
            "CurrencyID": i + 1,
            "CurrencyName": fake.currency_code(),
        }
        for i in range(30)
        ]
    }

#endregion /getData/currencyID
#endregion 現貨歷史

#region 現貨歷史
#region /getData/spotGoodsManagement
@app.get("/getData/spotGoodsManagement")
async def getData_saleManagement():
    return {
        "status":True,
        "data":[{
            "ID": i + 1,
            "Date": fake.unix_time(),
            "CurrencyID": i + 1,
            "Number": ran.randint(0,100),
            "Price": ran.randint(0,100),
            "Turnover":ran.randint(0,100),
            "Bargain": ran.randint(0,1),
            "Remark":fake.words()
        }
        for i in range(30)
        ]
    }

#endregion /getData/spotGoodsManagement
#endregion 現貨歷史

#region 合約歷史
#region /getData/contractManagement
@app.get("/getData/contractManagement")
async def getData_saleManagement():
    return {
        "status":True,
        "data":[{
            "ID": i + 1,
            "Date": fake.unix_time(),
            "CurrencyID": i + 1,
            "Number": ran.randint(0,100),
            "Price": ran.randint(0,100),
            "Turnover":ran.randint(0,100),
            "Bargain":ran.randint(0,1),
            "Type": ran.randint(0,1),
            "Remark":fake.words()
        }
        for i in range(30)
        ]
    }

#endregion /getData/contractManagement
#endregion 合約歷史

#region 歷史查詢
#region /getItemData/historyQuery 
@app.post("/getItemData/historyQuery")
async def getItemData_inventoryList():
    return {
        "status":True,
        "data":{
            "CurrencyID":[
                "A"
                for i in range(5)
            ],
            # "BuyAllSellStatus":["買","賣"],
            # "MoreAllShortStatus":["做多","做空"]
        }
    }
#endregion /getItemData/historyQuery 

#region /getData/historyQuery
@app.post("/getData/historyQuery")
async def getData_saleManagement():
    return {
        "status":True,
        "data":[{
            "ID": i + 1,
            "Date": fake.unix_time(),
            "CurrencyID": i + 1,
            "Number": ran.randint(0,100),
            "Price": ran.randint(0,100),
            "Turnover":ran.randint(0,100),
            "Bargain":ran.randint(0,2),
            "Type": ran.randint(0,2),
            "Remark":fake.words()
        }
        for i in range(30)
        ]
    }

#endregion /getData/historyQuery
#endregion 歷史查詢


#region 持有資產
#region /getData/holdMoney
@app.post("/getData/holdMoney")
async def getData_saleManagement():
    return {
        "status":True,
        "data":[{
            "ID": i + 1,
            "CurrencyID": i + 1,
            "Number": ran.randint(0,100),
            "AveragePrice": ran.randint(0,100),
            "OpeningPrice":ran.randint(0,100),
            "Multiple":ran.randint(0,125),
        }
        for i in range(30)
        ]
    }

#endregion /getData/holdMoney
#endregion 持有資產

#region 我的資產
#region /funds/account
@app.post("/funds/account")
async def getData_funds_account():
    return {
        "status":True,
        "data":{
            "User": fake.name_female(),
            "Number": fake.ssn(),
            "Total":round(ran.uniform(0, 10000), 8),
            "Type":"USDT",
        }
    }

#endregion /funds/account
#endregion 我的資產

#region 我的資產
#region /funds/asset
@app.post("/funds/asset")
async def getData_funds_asset():
    return {
        "status":True,
        "data":{
            'OneMonth':[{
                'Date': fake.unix_time(),
                'Value':round(ran.uniform(0, 1000), 5),
            }
                for i in range(30)
            ],
            'TwoMonth':[{
                'Date': fake.unix_time(),
                'Value':round(ran.uniform(0, 1000), 5),
            }
                for i in range(30)
            ],
            'ThreeMonth':[{
                'Date': fake.unix_time(),
                'Value':round(ran.uniform(0, 1000), 5),
            }
                for i in range(30)
            ],
            'OneYear':[{
                'Date': fake.unix_time(),
                'Value':round(ran.uniform(0, 1000), 5),
            }
                for i in range(30)
            ],
        }
    }

#endregion /funds/asset
#endregion 我的資產

#region 我的資產
#region /funds/tabel
@app.post("/funds/tabel")
async def getData_funds_account():
    return {
        "status":True,
        "data":[{
            "ID": i + 1,
            "Date": fake.unix_time(),
            "AddWallet": round(ran.uniform(0, 1000), 2),
            "Balance":round(ran.uniform(0, 1000), 2),
        }
        for i in range(10)
        ]
    }

#endregion /funds/tabel
#endregion 我的資產

#endregion 虛擬貨幣

#定義啟動方式
if __name__=='__main__':
    import uvicorn
    import os
    
    #獲取本檔案檔名並運行伺服器 (fastapi)
    thisFileName_str=os.path.basename(__file__).replace('.py','')
    

    
    #獲取服務設定
    config_dict=None
    with open(Path(__file__).parent / 'config.json') as f:
        config_dict = json.load(f)
    
    print('[INFO] docs url:',f"http://{config_dict['host']}:{config_dict['port']}/docs")
    
    #執行服務
    uvicorn.run(
        f'{thisFileName_str}:app',
        host=config_dict['host'],
        port=config_dict['port'],
        # reload=True,
        debug=True,
    )