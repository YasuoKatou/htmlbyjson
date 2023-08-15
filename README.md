## 作成中

## 画面定義ファイルの変換（yaml to JSON）
yamlで作成した画面定義ファイルをJSON形式に変換する必要がある。
```
$ cd 画面定義ファイルのディレクトリ
$ yq -o json ./config.yaml > config.json
```

## TODO
* configファイルの分割
* jsファイルの読込
* 画面定義のロード完了イベントの検討
* サーバとの通信
