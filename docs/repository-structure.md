# リポジトリ構造定義書 (Repository Structure Document)

## プロジェクト構造

本プロジェクトはビルドステップなしでブラウザから直接開けるバニラHTML/CSS/JSアプリケーション。
`index.html` を起点に、`src/` 配下のCSS・JSファイルを直接参照する。

```
ontology_viewer/
├── index.html                  # エントリポイント・UIレイアウト
├── src/                        # ソースコード
│   ├── css/
│   │   └── style.css           # 全体レイアウト・コンポーネントスタイル
│   └── js/
│       ├── app.js              # 初期化・各コンポーネントのワイヤリング
│       ├── state/
│       │   └── AppState.js     # 状態管理（オブザーバーパターン）
│       ├── logic/
│       │   ├── XMLParser.js    # OE形式XMLパース
│       │   └── GraphBuilder.js # Cytoscape用グラフデータ変換
│       ├── components/
│       │   ├── FileUploader.js  # ドラッグ&ドロップ / ファイル選択
│       │   ├── ThemeSwitcher.js # カラーテーマ切り替えUI（localStorage永続化）
│       │   ├── ViewToggle.js    # ビュー切り替えUI
│       │   └── SidePanel.js     # 概念詳細パネル
│       └── views/
│           ├── WConceptsView.js  # W_CONCEPTSビュー（ELK LAYERED）
│           └── RConceptsView.js  # R_CONCEPTSビュー
├── sample/                     # テスト用サンプルXMLファイル
│   └── janken.xml              # サンプルオントロジー（じゃんけん）
├── docs/                       # プロジェクトドキュメント
│   ├── ideas/                  # ブレスト・アイデアメモ（参照専用）
│   │   └── initial-requirements.md
│   ├── product-requirements.md
│   ├── functional-design.md
│   ├── architecture.md
│   ├── repository-structure.md （本ドキュメント）
│   ├── development-guidelines.md
│   └── glossary.md
├── .steering/                  # 作業単位のステアリングドキュメント
│   └── [YYYYMMDD]-[task-name]/ # 作業ごとのサブディレクトリ
│       ├── requirements.md
│       ├── design.md
│       └── tasklist.md
├── .claude/                    # Claude Code設定・スキル定義
├── .devcontainer/              # Dev Container設定
├── .gitignore
├── .gitattributes
├── .mcp.json
├── CLAUDE.md                   # Claude Code向けプロジェクトメモ
├── LICENSE
└── README.md
```

---

## ディレクトリ詳細

### index.html（プロジェクトルート）

**役割**: アプリケーションのエントリポイント。UIの骨格レイアウトを定義し、CSS/JSをリンクする。

**配置ルール**:
- HTML構造のみを記述し、ビジネスロジックをインラインで書かない
- `src/css/style.css` と `src/js/app.js` をリンクする
- CDNライブラリ（Cytoscape.js, cytoscape-elk）はこのファイルの `<head>` でロードする

---

### src/css/

**役割**: スタイルシートの配置場所。

**配置ファイル**:
- `style.css`: アプリ全体のレイアウト・コンポーネントスタイル

**命名規則**:
- ファイル名: kebab-case（例: `style.css`, `graph-view.css`）
- CSS変数: `--変数名` 形式でプレフィックスなし

**依存関係**:
- 依存可能: なし（CSSは他のCSSファイルに依存しない設計）

---

### src/js/app.js

**役割**: アプリケーション初期化ファイル。全コンポーネントをインスタンス化し、イベントのワイヤリングを行う。

**責務**:
- DOMContentLoaded 後に各コンポーネントを初期化
- AppState のインスタンスを生成し、各コンポーネントに渡す
- コンポーネント間のイベントバインドを行う（FileUploader → XMLParser → AppState → Views）

---

### src/js/state/

**役割**: アプリケーション状態管理レイヤー。

**配置ファイル**:
- `AppState.js`: 全状態の一元管理。オブザーバーパターンで状態変化を通知する

**命名規則**:
- ファイル名: PascalCase（例: `AppState.js`）

**依存関係**:
- 依存可能: なし（純粋な状態管理のみ）
- 依存禁止: DOM操作、Cytoscape API、XMLParser

---

### src/js/logic/

**役割**: ビジネスロジックレイヤー。UIに依存しない純粋な処理を配置する。

**配置ファイル**:
- `XMLParser.js`: OE形式XMLをパースし `ParsedOntology` オブジェクトを生成する
- `GraphBuilder.js`: `ParsedOntology` をCytoscape.js用のノード・エッジデータに変換する

**命名規則**:
- ファイル名: PascalCase + 役割接尾辞（例: `XMLParser.js`, `GraphBuilder.js`）

**依存関係**:
- 依存可能: ブラウザ標準API（DOMParser）のみ
- 依存禁止: DOM操作、Cytoscape API、コンポーネントクラス

---

### src/js/components/

**役割**: プレゼンテーションレイヤー。UIコンポーネントの実装を配置する。

**配置ファイル**:
- `FileUploader.js`: ドラッグ&ドロップ・ファイル選択ダイアログの制御
- `ThemeSwitcher.js`: カラーテーマ切り替えUIの制御（localStorage永続化・AppState非依存）
- `ViewToggle.js`: W_CONCEPTS / R_CONCEPTSビュー切り替えUIの制御
- `SidePanel.js`: 選択概念の詳細情報パネルの表示制御

**命名規則**:
- ファイル名: PascalCase（例: `FileUploader.js`）

**依存関係**:
- 依存可能: `state/AppState.js`, ブラウザDOM API
- 依存禁止: `views/` への直接依存（ViewsはAppState経由で制御）
- 例外: `ThemeSwitcher.js` はAppStateに依存せず、localStorageで独立した状態管理を行う

---

### src/js/views/

**役割**: グラフ描画レイヤー。Cytoscape.js を使ったグラフビューの実装を配置する。

**配置ファイル**:
- `WConceptsView.js`: ISA継承ツリービュー（ELK LAYEREDレイアウト）
- `RConceptsView.js`: 制約関係グラフビュー

**命名規則**:
- ファイル名: PascalCase + `View` 接尾辞（例: `WConceptsView.js`）

**依存関係**:
- 依存可能: `state/AppState.js`, Cytoscape.js グローバル変数（CDNで提供）
- 依存禁止: `logic/` への直接依存（データはAppState経由で受け取る）

---

### sample/

**役割**: 動作確認・テスト用のサンプルXMLファイルを配置する。

**配置ファイル**:
- `janken.xml`: じゃんけんオントロジー（開発・デモ用）
- 今後追加するサンプルもここに配置

**命名規則**:
- ファイル名: kebab-case（例: `janken.xml`, `medical-ontology.xml`）

---

### docs/

**役割**: プロジェクトの永続的ドキュメントを管理する。

**配置ドキュメント**:
- `product-requirements.md`: プロダクト要求定義書（PRD）
- `functional-design.md`: 機能設計書
- `architecture.md`: アーキテクチャ設計書
- `repository-structure.md`: 本ドキュメント
- `development-guidelines.md`: 開発ガイドライン
- `glossary.md`: ユビキタス言語定義（用語集）

**サブディレクトリ**:
- `ideas/`: ブレスト・壁打ちのアイデアメモ。参照専用で更新しない

---

### .steering/

**役割**: 特定の開発作業における「今回何をするか」を定義する一時的なドキュメント。

**構造**:
```
.steering/
└── [YYYYMMDD]-[task-name]/
    ├── requirements.md  # 今回の作業要求
    ├── design.md        # 変更内容の設計
    └── tasklist.md      # タスクリスト
```

**命名規則**: `20250506-initial-implementation` 形式（日付 + kebab-case タイトル）

---

## ファイル配置規則

### ソースファイル

| ファイル種別 | 配置先 | 命名規則 | 例 |
|------------|--------|---------|-----|
| HTMLエントリポイント | プロジェクトルート | `index.html` 固定 | `index.html` |
| グローバルスタイル | `src/css/` | kebab-case | `style.css` |
| 初期化スクリプト | `src/js/` | `app.js` 固定 | `app.js` |
| 状態管理クラス | `src/js/state/` | PascalCase | `AppState.js` |
| ロジッククラス | `src/js/logic/` | PascalCase + 役割接尾辞 | `XMLParser.js` |
| UIコンポーネント | `src/js/components/` | PascalCase | `FileUploader.js`, `ThemeSwitcher.js` |
| グラフビュー | `src/js/views/` | PascalCase + `View` 接尾辞 | `WConceptsView.js` |
| サンプルXML | `sample/` | kebab-case | `janken.xml` |

---

## 命名規則

### ディレクトリ名

- **機能グループディレクトリ**: 複数形・kebab-case
  - 例: `components/`, `views/`, `state/`, `logic/`

### ファイル名

- **クラスファイル（JS）**: PascalCase + 役割接尾辞
  - 例: `XMLParser.js`, `AppState.js`, `WConceptsView.js`, `FileUploader.js`
- **エントリポイント**: 小文字（慣習）
  - 例: `index.html`, `app.js`, `style.css`

### CSS クラス名

- **BEM風 kebab-case**を採用
  - 例: `.graph-area`, `.side-panel`, `.side-panel__title`, `.view-toggle--active`

### JavaScript

- **クラス名**: PascalCase（例: `XMLParser`, `AppState`）
- **変数・関数名**: camelCase（例: `parsedOntology`, `buildCytoscapeData`）
- **定数**: UPPER_SNAKE_CASE（例: `VIEW_W_CONCEPTS`, `MAX_FILE_SIZE_MB`）

---

## 依存関係のルール

```
index.html
    ↓ (script タグで読み込み)
src/js/app.js
    ↓
┌──────────────────────────────────────────┐
│  components/  →  state/AppState  ←  views/  │
│  logic/       →  state/AppState           │
└──────────────────────────────────────────┘
```

**許可される依存方向**:
- `components/` → `state/AppState.js`（状態の読み書き）
- `logic/` → `state/AppState.js`（パース結果の書き込み）
- `views/` → `state/AppState.js`（状態の読み取り）
- `app.js` → 全モジュール（ワイヤリング役）

**禁止される依存**:
- `logic/` → `components/` または `views/`（ロジックがUIに依存しない）
- `state/` → 他のすべてのモジュール（状態管理は純粋に保つ）
- `views/` → `components/`（相互依存禁止）

---

## 除外設定 (.gitignore)

```
# macOS
.DS_Store

# エディタ設定
.vscode/
*.swp

# ログ
*.log

# その他
node_modules/
```

---

## スケーリング戦略

### 新しいビューを追加する場合

1. `src/js/views/` に新しい `[Name]View.js` を追加
2. `AppState.js` に新しいビュー識別子を追加
3. `ViewToggle.js` に切り替えオプションを追加
4. `app.js` でインスタンス化してワイヤリング

### ファイル分割の目安

- 1ファイル 300行以下を推奨
- 300〜500行でリファクタリングを検討
- 500行以上は責務ごとに分割（例: `XMLParser.js` → `WConceptsParser.js` + `RConceptsParser.js`）
