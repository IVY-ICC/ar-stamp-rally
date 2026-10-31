/* ============================================================
 * config.js : このアプリの「設定」を1か所に集めたファイル
 * 本番前・引き継ぎのときは、まずここを確認してください。
 * ============================================================ */
window.APP_CONFIG = {

  // ---- 係の人用の暗証番号(スタンプ帳の「係の人用」で使う) ----
  // ※ GitHubで公開されるので、本番前に必ず変更してください。
  STAFF_PIN: '4455',

  // ---- 景品の個数(スタンプ帳の表示に使う。お菓子の個数) ----
  PRIZE: {
    partial: 1,   // 参加賞(1スポット以上クリア)
    complete: 2,  // 完走賞(9スポットすべてクリア)
    perfect: 3    // ノーミス賞(9スポットすべて、まちがい0回)
  },

  // ---- 9つのスポット(スタンプ帳の表示順) ----
  //  key  : スポット番号の識別子(各問題ページの body data-spot と同じ)
  //  page : 問題ページのファイル(index.html からの相対パス)
  SPOTS: [
    { key: 'spot1', no: '①', name: 'サーバーラック', icon: '🗄️', page: 'spots/spot1-rack.html' },
    { key: 'spot2', no: '②', name: '平均',           icon: '📊', page: 'spots/spot2-heikin.html' },
    { key: 'spot3', no: '③', name: '迷路暗号',       icon: '🧩', page: 'spots/spot3-meiro.html' },
    { key: 'spot4', no: '④', name: '数列',           icon: '🔢', page: 'spots/spot4-suuretsu.html' },
    { key: 'spot5', no: '⑤', name: 'ベン図',         icon: '🧮', page: 'spots/spot5-venn.html' },
    { key: 'spot6', no: '⑥', name: '2進数',          icon: '💾', page: 'spots/spot6-binary.html' },
    { key: 'spot7', no: '⑦', name: '五大装置',       icon: '🖥️', page: 'spots/spot7-godai.html' },
    { key: 'spot8', no: '⑧', name: '増加率',         icon: '📈', page: 'spots/spot8-zouka.html' },
    { key: 'spot9', no: '⑨', name: '間違い探し',     icon: '🔍', page: 'spots/spot9-sagasu.html' }
  ],

  // ---- マーカーの順番(いちばん大事な設定) ----
  // ar/all.mind を作ったときに、MindARのコンパイラが画像を並べた順番です。
  // 左から targetIndex 0, 1, 2 … に対応します。
  // 画像を入れ替えて all.mind を作り直したら、ここも必ず合わせてください。
  // 調べ方は docs/marker-replacement.md を見てください(debug.html で確認できます)。
  MARKER_ORDER: ['spot7', 'spot8', 'spot9', 'spot1', 'spot2', 'spot3', 'spot4', 'spot5', 'spot6']
};
