## 作成中

## 画面定義ファイルの変換（yaml to JSON）
yamlで作成した画面定義ファイルをJSON形式に変換する必要がある。
```
$ cd 画面定義ファイル(yaml)のディレクトリ
$ yq -o json ./config.yaml > ../json/config.json
```

## TODO
* configファイルの分割（処理の形ができたが、テストが行えていない）
* jsファイルの読込
* 画面定義のロード完了イベントの検討（ソース内のTODOを埋めること）
* サーバとの通信
