# Simple Twitter Web App

此專案為前後端分離專案，使用 Vue.js 框架開發。功能模擬 Twitter 社群網站。專案中區分一般使用者與後台管理者兩個角色。一般使用者可註冊帳號、登入、推文、回覆、瀏覽推文、追踪等到。而後台管理者瀏覽一般使用者基本資料、瀏覽推文及刪文。

###

#### 前台一般使用者登入 info：

- account: user1
- password: 12345678

- account: user2
- password: 12345678

#### 後台管理者登入 info：

- account: root
- password: 12345678

# 網頁主要功能

## 一般使用者：

1. 註冊頁/登入頁/登出頁 - 使用者註冊帳號及編輯自己的基本資料
2. 抵達頁 - 使用者登入以後抵達使用者首頁，可以瀏覽所有推文清單、點擊貼文可以瀏覽貼文詳細資料與所有回覆。
3. 側邊欄 - 使用者可以透過左邊側邊欄前往個人資料、通知、公開聊天室、私人訊息、設定頁面與回到首頁
4. 個人資料頁 - 使用者可以檢視自己的詳細資料與所有推文、回覆、喜歡的內容
5. 通知 - 使用者可以檢視所有訂閱對象的動態通知，以及在同一個通知介面，檢視自己與他人互動的動態通知
6. 公開聊天室 - 使用者可以與線上的其他使用者即時聊天，以及看到聊天的歷史紀錄
7. 私人訊息 - 使用者可以與其它使用者進行一對一的私人即時聊天，以及看到聊天的歷史紀錄
8. 貼文留言 - 使用者可以瀏覽、發送以及回覆帖文
9. 使用者互動 - 使用者互相追踪/取消追踪，按贊/取消按贊
10. 設定頁 - 使用者可以修改自己的帳號、名稱、信箱與密碼
11. 訂閱 - 開啟了訂閱通知 (個人資訊下方的小鈴鐺) 之後，一旦對方有新的動態，就會即時地收到小鈴鐺推播通知，使用者可以在「通知」介面裡，察看自己收到的通知。被訂閱的動態包括:

- 對方發布新的貼文
- 對方有新的回覆貼文
- 對方喜歡一則貼文
- 對方有新追蹤

12. 即時推播、通知 - 收到私人訊息、公開聊天訊息、訂閱對象通知時，側邊欄上對應的圖示會立即的出現「小紅點」即時通知，不用刷新頁面。並且紅點裡會顯示「目前未讀通知」的數量

## 後台管理者：

1. 管理者可以瀏覽全站的 Tweet 清單
2. 管理者可以瀏覽站內所有的使用者清單及使用者基本資料
3. 管理者可以刪除 任一則 Tweet 貼文

## 使用技術與套件：

1. Vue.js 2.0, Vuex, Javascript, Node.js, Express.js, SASS, Socket.io-client
2. 使用元件分別為頁面元件以及共用元件

## Project setup

### Prerequisites

Make sure you have installed the following prerequisites:

- Node.js
- Dependencies - Make sure you've installed Node.js and npm first, then install depencies using npm:

$ npm install

## Initializing project

Make sure you've got all prerequisites, then initializing project by node using npm scripts:

$ git clone https://github.com/learnpytest/Front_End_Vue_Simple_Twitter.git

$ cd Front_End_Vue_Simple_Twitter

$ npm run install

$ npm run serve

```
### Compiles and hot-reloads for development
```

npm run serve

```
### Compiles and minifies for production
```

npm run build

```
### Lints and fixes files
```

npm run lint

```
### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
```
