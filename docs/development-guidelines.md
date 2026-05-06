# 開発ガイドライン (Development Guidelines)

## 前提

本プロジェクトはバニラ HTML/CSS/JavaScript（ES2020+）のみで構成され、
TypeScript・npmビルドツールは使用しない。
ブラウザで `index.html` を直接開けば動作することが大前提。

**対応ブラウザ方針**:

- 初期スコープは Chromium系ブラウザ（Chrome / Edge）最新版
- Firefox / Safari は初期スコープ外（`cytoscape-elk` のWeb Worker動作が未検証）

---

## コーディング規約

### JavaScript 命名規則

#### 変数・関数

```javascript
// ✅ 良い例
const parsedOntology = xmlParser.parse(text);
function buildCytoscapeNodes(ontology) { }
const isWConceptsView = activeView === VIEW_W_CONCEPTS;

// ❌ 悪い例
const data = parse(t);
function build(x) { }
```

**原則**:

- 変数: camelCase、名詞または名詞句
- 関数: camelCase、動詞で始める
- Boolean変数: `is`, `has`, `should`, `can` で始める

#### クラス

```javascript
// PascalCase、名詞
class XMLParser { }
class WConceptsView { }
class AppState { }
```

#### 定数

```javascript
// UPPER_SNAKE_CASE
const VIEW_W_CONCEPTS = 'W_CONCEPTS';
const VIEW_R_CONCEPTS = 'R_CONCEPTS';
const MAX_FILE_SIZE_MB = 100;
```

#### ファイル名


| 種別       | 規則                 | 例                                  |
| -------- | ------------------ | ---------------------------------- |
| クラスファイル  | PascalCase + 役割接尾辞 | `XMLParser.js`, `WConceptsView.js` |
| エントリポイント | 小文字                | `app.js`, `index.html`             |
| スタイルシート  | kebab-case         | `style.css`                        |


---

### CSS 規則

#### BEM風 kebab-case

```css
/* ブロック */
.graph-area { }
.side-panel { }
.view-toggle { }

/* エレメント（__ で区切る） */
.side-panel__title { }
.side-panel__slot-list { }

/* モディファイア（-- で区切る） */
.view-toggle__btn--active { }
.graph-area--loading { }
```

#### CSS Variables の使用

本プロジェクトはCRTレトロ・コンソール風のデザインシステムを採用し、セマンティックな命名体系でCSS Variablesを管理する。

**変数体系**:

```css
:root {
  /* 背景レイヤー（void = 宇宙の暗黒）*/
  --void-000: #05080a;    /* 最暗 */
  --void-100: #0a0f12;
  --void-200: #0f1518;
  --void-300: #141c20;
  --void-400: #1c262b;
  --hull-line: #2a3a40;   /* パネル境界線 */

  /* ホスファー（メインカラー / CRT緑）*/
  --phos-500: #7dffb0;    /* 基本テキスト・強調 */
  --phos-glow: rgba(125, 255, 176, 0.55);

  /* アンバー（サブカラー / 警告・補助）*/
  --amber-500: #ffb547;
  --amber-glow: rgba(255, 181, 71, 0.45);

  /* アラート（赤・エラーのみ）*/
  --alert-500: #ff5d5d;

  /* テキスト */
  --txt-primary: #c8f7d9;
  --txt-secondary: #6e9285;
  --txt-mute: #44615a;

  /* フォント */
  --font-mono: 'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace;
  --font-pixel: 'VT323', 'JetBrains Mono', monospace;
  --font-display: 'Major Mono Display', 'JetBrains Mono', monospace;
}
```

**テーマ切り替えの仕組み**:

`<html>` 要素の `data-theme` 属性でテーマを切り替える。デフォルト（nostromo）は属性なし。

```css
/* デフォルト: nostromo（属性なし） */
:root { --phos-500: #7dffb0; }

/* amberテーマ */
[data-theme="amber"] { --phos-500: #ffb547; }

/* folio / void テーマ も同様に上書き */
```

**原則**:

- 色・フォントはCSS Variablesで一元管理し、生の値を直接書かない
- インラインスタイルはJavaScriptから動的に適用する場合のみ許可（Cytoscapeノードスタイル等）
- マジックカラー（`#7dffb0` 等）を直接書かず、必ず変数を参照する

---

### コードフォーマット

- **インデント**: スペース2つ
- **行の長さ**: 100文字以内を目安
- **セミコロン**: あり（省略禁止）
- **クォート**: シングルクォート優先（HTML属性はダブルクォート）

```javascript
// ✅ 良い例
const label = concept.label ?? concept.name;
const nodes = concepts.map(c => ({ data: { id: c.id, label: c.label ?? c.name } }));

// ❌ 悪い例
const label=concept.label??concept.name
const nodes=concepts.map(c=>{return{data:{id:c.id,label:c.label??c.name}}})
```

---

### ESLint 運用ルール

#### 設定ファイル

- ルートに `.eslintrc.json` を配置し、JavaScript実装時は必ず参照する
- 本プロジェクトはビルドレス運用のため、`sourceType` は `script` を基本とする

#### 主要ルール

- `indent: ["error", 2]`: インデントはスペース2つ
- `quotes: ["error", "single"]`: 文字列はシングルクォートを優先
- `semi: ["error", "always"]`: セミコロン省略禁止
- `max-len: ["warn", { "code": 100 }]`: 1行100文字を目安
- `no-var: "error"` / `prefer-const: "warn"`: `var` 禁止、再代入不要は `const`
- `no-unused-vars: "warn"`: 未使用変数の放置を防ぐ
- `no-console: "warn"`: デバッグ出力の残置を検知する

#### ルール違反時の対応

1. **error** は必ず修正してからコミット・PR作成する
2. **warn** は原則修正し、意図的に残す場合はコメントで理由を明示する
3. `console.log` はローカル調査中のみ許可し、PR前チェックで必ず削除する
4. ESLint警告を恒久的に抑制する `eslint-disable` は最小限とし、利用時は理由を記述する

---

### コメント規約

コメントは「なぜ（WHY）」を説明する場合にのみ記述する。
コードを読めば分かる「何（WHAT）」の説明は不要。

```javascript
// ✅ 良い例: なぜそうするか
// ELKはWeb Worker上で動作するため、layout完了はPromise解決で検知する
cy.layout(elkOptions).run();

// ✅ 良い例: 非自明なアルゴリズムの説明
// DFS でISAの循環参照を検出（経路上の訪問済みノードを追跡）
function detectCycle(nodeId, visited, path) { }

// ❌ 悪い例: コードの内容を繰り返すだけ
// conceptsMapを初期化する
const conceptsMap = new Map();
```

**JSDocは公開APIに限定**（クラスのpublicメソッドのみ）:

```javascript
/**
 * OE形式XMLテキストをパースしてParsedOntologyを返す。
 * @param {string} xmlText - XMLテキスト
 * @returns {ParsedOntology}
 * @throws {ParseError} XMLが不正な場合
 */
parse(xmlText) { }
```

---

### エラーハンドリング

#### カスタムエラークラス

```javascript
class ParseError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'ParseError';
    this.cause = cause;
  }
}
```

#### エラーハンドリングパターン

```javascript
// ✅ 良い例: エラーを適切に処理し、ユーザーに通知
try {
  const ontology = xmlParser.parse(text);
  appState.setOntology(ontology);
} catch (error) {
  if (error instanceof ParseError) {
    showErrorMessage(`XMLの読み込みに失敗しました: ${error.message}`);
  } else {
    console.error('予期しないエラー:', error);
    showErrorMessage('予期しないエラーが発生しました。コンソールを確認してください。');
  }
}

// ❌ 悪い例: エラーを無視する
try {
  const ontology = xmlParser.parse(text);
} catch (e) {
  // 何もしない
}
```

#### エラーメッセージ

- ユーザー向けメッセージは日本語・具体的・解決策を示す
- 「エラーが発生しました」のような曖昧なメッセージは禁止

```javascript
// ✅ 良い例
throw new ParseError('W_CONCEPTSまたはR_CONCEPTS要素が見つかりません。OE形式のXMLか確認してください。');

// ❌ 悪い例
throw new Error('Invalid XML');
```

---

### XSS対策（必須）

オントロジーファイルから取得したテキストをDOMに挿入する際は、
必ず `textContent` / `createTextNode` を使用し、`innerHTML` への直接代入を禁止する。

```javascript
// ✅ 安全: textContent を使用
const titleEl = document.createElement('h3');
titleEl.textContent = concept.label ?? concept.name;  // XSS安全

// ❌ 危険: innerHTML は禁止
titleEl.innerHTML = concept.label;  // XSSの危険
```

---

### 関数設計

- **目標**: 1関数20行以内
- **推奨**: 1関数50行以内
- **50行超**: 責務ごとに分割を検討

**パラメータが3つ以上になる場合はオブジェクトにまとめる**:

```javascript
// ✅ 良い例
function renderSidePanel({ concept, relations, panelEl }) { }

// ❌ 悪い例
function renderSidePanel(concept, relations, panelEl, isVisible, mode) { }
```

---

## Git 運用ルール

### ブランチ戦略

```
main
  ├── feature/xml-parser        # 新機能開発
  ├── feature/w-concepts-view
  ├── fix/isa-cycle-detection   # バグ修正
  └── refactor/app-state        # リファクタリング
```


| ブランチ種別   | 命名規則                       | 例                      |
| -------- | -------------------------- | ---------------------- |
| 新機能      | `feature/[機能名-kebab-case]` | `feature/side-panel`   |
| バグ修正     | `fix/[内容-kebab-case]`      | `fix/elk-layout-crash` |
| リファクタリング | `refactor/[対象-kebab-case]` | `refactor/xml-parser`  |
| ドキュメント   | `docs/[内容-kebab-case]`     | `docs/update-readme`   |


`**main` への直接プッシュ禁止**（個人開発の場合でもPR推奨）

---

### コミットメッセージ規約

**フォーマット（Conventional Commits）**:

```
<type>(<scope>): <subject>

<body（任意）>
```

**type**:

- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `style`: コードフォーマット（動作変更なし）
- `refactor`: リファクタリング（機能変更なし）
- `test`: テストの追加・修正
- `chore`: ビルド・依存関係等の変更

**例**:

```
feat(xml-parser): OE形式XMLのW_CONCEPTSパース機能を追加

- XMLParser クラスを実装
- W_CONCEPTS内のconcept要素からISA関係を抽出
- 日本語ラベル(lang="ja")を優先して取得

Closes #12
```

**subject の書き方**:

- 50文字以内
- 日本語可
- 命令形（「追加」「修正」「削除」）
- 末尾にピリオドなし

---

### プルリクエストプロセス

**作成前チェックリスト**:

- 対象ブランチが最新の `main` に追従している
- ブラウザで動作確認済み（正常系・異常系）
- `console.log` のデバッグ出力を削除済み
- XSSリスクのある `innerHTML` 直接代入がないことを確認

**PRテンプレート**:

```markdown
## 概要
[変更内容の簡潔な説明]

## 変更理由
[なぜこの変更が必要か]

## 変更内容
- [変更点1]
- [変更点2]

## テスト
- [ ] ブラウザ手動テスト実施
- [ ] サンプルXMLで動作確認（sample/janken.xml）
- [ ] エラーケースの確認

## スクリーンショット（UI変更がある場合）
[画像]

## 関連Issue
Closes #[Issue番号]
```

---

## テスト戦略

### 手動テスト（初期フェーズ）

ブラウザ手動テストを中心とする。テスト時は `sample/janken.xml` を使用。

**基本テストシナリオ**:


| #   | テスト項目             | 操作                             | 期待結果                     |
| --- | ----------------- | ------------------------------ | ------------------------ |
| 1   | XMLアップロード（DnD）    | `janken.xml` をドロップ             | グラフが10秒以内に表示される          |
| 2   | XMLアップロード（ファイル選択） | ファイル選択ダイアログから `janken.xml` を選択 | グラフが表示される                |
| 3   | W_CONCEPTSビュー表示   | アップロード後                        | 階層ツリーがLAYEREDレイアウトで表示される |
| 4   | ビュー切り替え           | R_CONCEPTSタブをクリック              | 制約関係グラフに切り替わる            |
| 5   | ビュー切り替え（戻る）       | W_CONCEPTSタブをクリック              | 階層ツリーに戻る                 |
| 6   | ノードクリック（詳細表示）     | グラフ上のノードをクリック                  | サイドパネルに概念詳細が表示される        |
| 7   | フィット表示            | 「全体表示」ボタンをクリック                 | グラフ全体が画面にフィットする          |
| 8   | 非XMLファイル          | `.txt` ファイルをドロップ               | エラーメッセージが表示される           |
| 9   | 不正XMLファイル         | 中身が壊れたXMLをドロップ                 | エラーメッセージが表示される           |
| 10  | 空XMLファイル          | W_CONCEPTSなしのXMLをドロップ          | 警告メッセージが表示される            |


### ユニットテスト（XMLParser 品質保証 / P1）

XMLParser は純粋なロジックであり、ブラウザ標準APIのみ使用するため単体テスト可能。
軽量テストランナー（Jasmine CDN版等）をテスト専用HTMLファイルで実行する。

**テストファイル配置**:

```
tests/
└── unit/
    └── XMLParser.test.html   # ブラウザで開いて実行
```

**テスト命名規則**: `[対象]_[条件]_[期待結果]`

```javascript
// 例
it('parse_validWConceptsXml_returnsConceptMap', () => { });
it('parse_missingWConcepts_throwsParseError', () => { });
it('parse_circularIsa_setsWarningFlag', () => { });
```

---

## 開発環境セットアップ

### 必要なツール


| ツール           | バージョン | 用途             |
| ------------- | ----- | -------------- |
| VS Code       | 最新版   | コードエディタ        |
| Chrome / Edge | 最新版   | 対応ブラウザ（初期スコープ） |


### セットアップ手順

```bash
# 1. リポジトリのクローン
git clone <URL>
cd ontology_viewer

# 2. index.html をブラウザで直接開く
# macOS
open index.html

# Windows
start index.html
```

**npm install 不要・ビルドステップ不要**

### ローカルHTTPサーバー（任意）

`file://` プロトコルでモジュール分割（`import/export`）を使いたい場合や
CORS制約が発生した場合は軽量HTTPサーバーを利用する:

```bash
# Python 3 が使える場合
python3 -m http.server 8080
# → http://localhost:8080 でアクセス
```

---

## コードレビュー基準

### レビューポイント

**機能性**:

- PRDの受け入れ条件を満たしているか
- エラーケースが適切に処理されているか
- 日本語ラベルが優先的に表示されているか

**セキュリティ**:

- `innerHTML` への直接代入がないか（XSS対策）
- XMLファイルの内容がサーバーに送信されていないか

**パフォーマンス**:

- 不要な再レンダリングが発生していないか
- Cytoscapeインスタンスの破棄・再生成が最小化されているか

**可読性**:

- 命名規則が一貫しているか
- 関数が50行以内か（超える場合は分割を検討）
- レイヤー間の依存関係が正しいか（`logic/` → DOM操作なし等）

**保守性**:

- マジックナンバーが定数化されているか
- 重複コードがないか

### レビューコメントの書き方

優先度を明示する:

- `[必須]`: マージ前に修正必須
- `[推奨]`: 修正推奨だが任意
- `[提案]`: アイデア提案
- `[質問]`: 意図確認

```markdown
[必須] ここで innerHTML を使用するとXSSの危険があります。textContent に変更してください。

[推奨] この処理は XMLParser.js で行う方がレイヤー設計上適切です。

[提案] Map ではなく配列の方がここでは読みやすいかもしれません。

[質問] この条件分岐の意図は何でしょうか？
```

---

## 実装チェックリスト

実装完了前に確認:

### コード品質

- 命名規則に従っている（変数: camelCase、クラス: PascalCase、定数: UPPER_SNAKE_CASE）
- 関数が50行以内
- マジックナンバーが定数化されている
- エラーハンドリングが実装されている（エラーを無視していない）

### セキュリティ

- `innerHTML` への直接代入がない（`textContent` / `createTextNode` を使用）
- ファイル形式・サイズのバリデーションが実装されている

### パフォーマンス

- ビュー切り替えで毎回Cytoscapeインスタンスを再生成していない
- 不要な再描画がない

### テスト

- `sample/janken.xml` で基本シナリオの手動テスト実施
- 異常系（不正XML・非XMLファイル）の動作確認

### デバッグ

- `console.log` のデバッグ出力を削除済み

