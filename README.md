# IVY大分 ARスタンプラリー(C TEC FES)

マーカー(ポスター)をスマホのカメラで読み取ると、問題が出るスタンプラリーです。
MindAR + A-Frame を使い、GitHub Pages で動かします(サーバー不要・インストール不要)。

## フォルダの見方
| 場所 | 中身 | 触る場面 |
|---|---|---|
| `index.html` | カメラ画面(ここから開始) | ふだん触らない |
| `goal.html` | スタンプ帳・景品の確認画面 | 文言を変えたいとき |
| `debug.html` | マーカーの診断ページ | 読み取れないとき・順番確認 |
| `reset.html` | 記録リセット用ページ(係の人用QRの行き先) | ふだん触らない |
| `spots/` | 9つの問題ページ(HTML) | 問題の文章を変える |
| `css/` | 見た目(`common.css`=共通、`spots/`=問題ごと) | 色・大きさを変える |
| `js/config.js` | **設定(暗証番号・景品数・マーカー順)** | まずここを見る |
| `js/common.js` | 全問題で共通の動き(まちがい数・クリア記録) | ふだん触らない |
| `js/spots/` | 問題ごとのゲームの動き・答え | 答えや数字を変える |
| `ar/all.mind` | マーカーの読み取りデータ | マーカーを変えたとき作り直す |
| `markers/` | 印刷用マーカー画像9枚(白ベース) | 印刷する |
| `docs/` | 引き継ぎ資料 | 困ったとき |

## まず読む
1. `docs/handover-settings.md`
2. `docs/marker-replacement.md`
3. `docs/editing-questions.md`
4. `docs/troubleshooting.md`

## 自分のパソコンで試す
フォルダで `python -m http.server 8000` を実行し、ブラウザで http://localhost:8000/ を開く
(または VS Code の Live Server)。カメラはスマホ実機・https でないと動かないので、
画面の確認は PC、読み取りの確認は公開後にスマホで行います。

## 公開
GitHub の Settings → Pages で `main` ブランチ / `(root)` を指定。公開URLは
`https://<組織名>.github.io/<リポジトリ名>/` になります(無料プランではリポジトリを Public に)。
