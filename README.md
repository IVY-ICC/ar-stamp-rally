# print/ : 印刷物(C TEC FES 2026 の本番で使ったもの)

| ファイル | 中身 | 備考 |
|---|---|---|
| `markers-a4.pdf` | マーカー9枚(A4・1枚1スポット)。「受付でQRコードを読み込んでからしかARマーカーは読み取れません」の赤字入り | マット紙で印刷。マーカーの絵は `../markers/` の画像と同じ(`ar/all.mind` の元) |
| `poster-reception-a4.pdf` | 受付に貼るスタート用QRのポスター | |
| `participant-handout.pdf` | 参加者用 景品受取手順書(受付に掲示) | 暗証番号が載っている。使うたびに変えること |
| `qr/qr-sheets-a4.pdf` | スポット用QRの案内シート(9枚。QRで問題を開く手順つき) | マーカーの余白に貼る |
| `qr/qr-list-a4.pdf` | スポット用QR一覧(9個を1枚に) | 係員用の控え |
| `qr/qr-start.png` | スタート用QR(`https://ivy-icc.github.io/ar-stamp-rally/`) | |
| `qr/qr-reset.png` | 記録リセット用QR(`.../reset.html`)。係の人用 | |
| `qr/qr-start-slide.pdf` | スタート用QRを大きく表示するスライド | |
| `stickers/` | 「QRを読む」ボタンの案内シール(A4に10枚×2ページ)と、その画像 | スポットのQRの余白に貼る |

## 注意
- 暗証番号は `js/config.js` の `STAFF_PIN` です。ここに載せた手順書・手順書の画像の番号は、**本番(2026年11月)のもの**です。次回は必ず変えてください。
- スポット用QR(`.../q/1/` 〜 `.../q/9/`)は `qr/qr-sheets-a4.pdf` と `qr/qr-list-a4.pdf` にあります。受付チェック(README の「注意事項」)で、受付のQRを読んでいない端末は、このQRから入れません。
- 問題の答えの一覧は、公開リポジトリのため、ここには入れていません。
