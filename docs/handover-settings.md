# 引き継ぎ・設定一覧

## 仕組み(3行で)
1. `index.html` がカメラを開き、`ar/all.mind` でマーカーを探す。
2. マーカーが見つかると、その番号(targetIndex)に対応する `spots/…html` をカメラの上に重ねて表示する。
3. 問題を解くと、クリア記録とまちがい数がスマホの localStorage に保存され、`goal.html`(スタンプ帳)に出る。

## 設定は js/config.js に集約
- `STAFF_PIN` : 係の人用の暗証番号。**GitHubで誰でも見える**ので、本番前に必ず変更する。
- `PRIZE` : 景品の個数(参加賞1・完走賞2・ノーミス賞3)。お菓子の在庫に合わせて変更。
- `SPOTS` : 9スポットの名前・アイコン・ページ。
- `MARKER_ORDER` : **マーカーの順番**。`all.mind` を作ったときの画像の並び順と一致させる。

## 保存される記録(スマホ内)
`ivyArStampMistakes`(まちがい数)/`ivyArStampCleared`(クリア済み)/`ivyArStampStart`(開始時刻)/`ivyArStampReceived`(景品受取)。
URLのドメインごとに別保存。問題ページに `?reset=1` を付けて開くと記録を消せる(テスト用)。

## 過去にハマった点
- LINE等のアプリ内ブラウザではカメラが使えない → SafariまたはChromeで開く。
- マーカー順が違うと別の問題が出る → `docs/marker-replacement.md` の順番確認を行う。
- GitHub Pages は反映まで約10分かかり、古いファイルが残ることがある(`index.html` の `?v=` を変えて対処)。
