## 作成中

## コンセプト
htmlタグを部品化することでweb画面の開発効率を向上させる。

webアプリケーションは、複数のページで構成することが多く、複数あるページを開くたびにhtmlのタグを作成することは、クライアントのリソースを多く使用することになる。
従って、アプリケーション利用開始時にhtmlタグを１回作成し、ページの切替えのためのサーバ呼び出しを行わないようにする。

## サポートするタグの一覧
|json|html|css|memo|
|:---|:---|:--:|:---|
|block-label|p|○||
|button|button|||
|checkbox|input type=checkbox|○||
|div|div|||
|flow-layout|div|||
|groupbox|fieldset, legend|||
|link|a||実装予定|
|textbox|input type=text|○||
|password|input type=password|○||

### block-label
TODO サンプルを作成
JSON
```
block-label:
  text: hello HTML By JSON !!
  css: block-label-style
```
html
```
<p class="block-label-style">hello HTML By JSON !!</p>
```
### button
TODO サンプルを作成

### checkbox
JSON
```
checkbox:
  label:
    css: label-style
    text: 同意する
  css: checkbox-style
```
html
```
<label class="label-style" for="ID-00000">
    <input type="checkbox" class="checkbox-style" id="ID-00000">
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
  css: textbox-style
```
html
```
<label class="gp-title">お名前</label>
<input type="text" class="textbox-style" placeholder="姓 名">
```
### password
JSON
```
password:
  label:
    text: パスワード
    css: loginPasswdLabel
  css: password-style
```
html
```
<label class="loginPasswdLabel">パスワード</label>
<input type="password" class="password-style">
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
