# Company Website

企業向けウェブサイト

## 機能

- **企業情報/プロフィール**: 会社概要、ミッション、基本情報の表示
- **サービス紹介**: 複数のサービスをカード形式で紹介
- **お問い合わせフォーム**: メールアドレス、電話番号、メッセージを含む問い合わせフォーム

## 技術スタック

- **言語**: TypeScript
- **マークアップ**: HTML5
- **スタイル**: CSS3
- **ビルドツール**: TypeScript Compiler

## セットアップ

### 必要な環境
- Node.js 16以上
- Python 3以上 (ローカルサーバー実行用)

### インストール

```bash
cd Company-Website
npm install
```

### ビルド

```bash
npm run build
```

### 開発モード (ウォッチ)

```bash
npm run watch
```

### ローカルサーバー実行

```bash
npm start
```

ブラウザで `http://localhost:8000` にアクセスしてください。

## プロジェクト構造

```
Company-Website/
├── src/
│   └── main.ts           # メインアプリケーション
├── css/
│   └── style.css         # スタイルシート
├── dist/                 # コンパイル後のJavaScript (自動生成)
├── index.html            # メインページ
├── package.json          # 依存関係管理
├── tsconfig.json         # TypeScript設定
└── README.md             # このファイル
```

## カスタマイズ

### 企業情報の更新
`index.html`の以下の部分を編集してください：
- `<div class="nav-logo">` - 企業名
- Profile Sectionの会社情報
- ミッション・ビジョン

### サービスの追加
`index.html`の`services-grid`内に`service-card`を追加してください。

### スタイルの変更
`css/style.css`を編集してください。

## License

MIT
