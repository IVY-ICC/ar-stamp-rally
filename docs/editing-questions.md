# 問題の追加・修正

スポットNの問題は次の3ファイルで構成される(例:②平均)。
- 文章・画面の部品 … `spots/spot2-heikin.html`
- 見た目 … `css/spots/spot2-heikin.css`
- 答え・選択肢・動き … `js/spots/spot2-heikin.js`(先頭の `ANSWER` `CHOICES` などを書き換える)

## 注意
- 問題ページは `<body data-spot="spot2">` の値でクリア記録を管理する。変えない。
- まちがえたときは `addMistake()`、正解したときは `markCleared()` を呼ぶ(`js/common.js`)。
- 変更後は `spots/…html?embed=1` を直接開いて動作確認し、スマホでも表示を確認する。
- スポット名・順番を変えるときは `js/config.js` の `SPOTS` も直す。
