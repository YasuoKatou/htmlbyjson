## 作成中

## コンセプト
htmlタグを部品化することでweb画面の開発効率を向上させる。

webアプリケーションは、複数のページで構成することが多く、複数あるページを開くたびにhtmlのタグを作成することは、クライアントのリソースを多く使用することになる。
従って、アプリケーション利用開始時にhtmlタグを１回作成し、ページの切替えのためのサーバ呼び出しを行わないようにする。

## サポートするタグの一覧
|json|html|memo|
|:---|:---|:---|
|block-label|p||
|button|button||
|checkbox|input type=checkbox||
|div|div||
|flow-layout|div||
|groupbox|fieldset, legend||
|link|a|実装予定|
|textbox|input type=text||
|password|input type=password||

### block-label
TODO サンプルを作成

### button
TODO サンプルを作成

### checkbox
JSON
```
checkbox:
  label:
    text: 同意する
```
html
```
<label for="ID-00000">
    <input type="checkbox" id="ID-00000">
    同意する
</label>
```
### div
TODO サンプルを作成

### flow-layout
TODO サンプルを作成

### groupbox
TODO サンプルを作成

### link
TODO サンプルを作成

### textbox
JSON
```
textbox:
  label:
    text: お名前
    css: gp-title
  placeholder: 姓 名
```
html
```
<label class="gp-title">お名前</label>
<input type="text" placeholder="姓 名">
```
### password
JSON
```
password:
  label:
    text: パスワード
    css: loginPasswdLabel
```
html
```
<label class="loginPasswdLabel">パスワード</label>
<input type="password">
```

## 定義の再利用
```import```キーを使用することで、他で定義した画面定義アイルを取り込むことができる。

## 画面定義ファイルの変換（yaml to JSON）
yamlで作成した画面定義ファイルをJSON形式に変換する必要がある。

同梱の```app/yaml2json.py```で一括変換を行う

## TODO
* configファイルの分割（処理の形ができたが、テストが行えていない）
* jsファイルの読込
* 画面定義のロード完了イベントの検討（ソース内のTODOを埋めること）
* サーバとの通信
