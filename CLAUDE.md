# CLAUDE.md — shandixme.com

藝術家 Shandi YC Hsin 的個人作品網站，用 GitHub Pages 發布。這份文件是給接手修改網站的 Claude Code 工作階段看的技術說明：架構、實作細節、設計規則與常見工作。

## 工作方式

- 回覆一律用繁體中文（台灣用語）。網站本身的文案是英文（作品頁可有中文段落）；不要自行把網站內容改成中文。
- 說明避免術語，改檔案的步驟寫到「打開哪個檔、找哪句話」的程度。
- 改視覺前先確認方向，改完說清楚動了什麼、沒動什麼。
- 不要編造事實。缺的資料用 `[方括號]` 佔位並說明，不要用看似合理的內容填空。
- 網站作者可能另外提供一份私人筆記（合作方式、決策紀錄、待辦）。有提供的話先讀。

## 架構

純靜態網站：HTML、CSS、兩支小 script。**沒有建置步驟、沒有框架、沒有套件管理。** 這是刻意的：作者要能直接在 GitHub 網頁上改字。不要引入 build tool、框架或 CSS 預處理器，除非作者明確要求。

```
index.html              首頁：主視覺天空、practice 視窗、作品道具欄（project inventory）、聯絡區
about.html              自介、status 視窗、經歷列表、聯絡列
work-*.html             8 件作品的內頁；work-unfed-time.html 同時是新增作品頁的範本
css/style.css           共用樣式：游標、閃爍、拖尾、道具格、手機斷點、照片像素化圖層、開場動畫
js/main.js              道具欄點選、星星閃爍節奏、照片滑過像素化、游標星星拖尾
js/intro.js             首頁開場動畫（像素桌上型電腦開機、衝進螢幕）
img/                    游標圖、網站圖示 favicon.svg／favicon-32.png／apple-touch-icon.png、portrait.jpg、各作品照片（作品代稱-cover.jpg、作品代稱-01.jpg…）
CNAME                   內容為 shandixme.com（GitHub Pages 自訂網域；在 Pages 設定填自訂網域時由 GitHub 建立）
.nojekyll               讓 GitHub Pages 不經 Jekyll 處理
README.md               英文編輯說明
docs/design-system.md   色票、字體、元件、動態規格
```

### 重要的實作細節

- **樣式大多寫在 HTML 的 inline `style` 裡。** 這些頁面是從設計稿轉出來的。`css/style.css` 只放共用行為。把重複的 inline 樣式整理成 class 是合理的後續工作，但要先問作者，而且整理後畫面必須完全一致。
- **視窗的標題列、愛心、三顆控制鈕是重複貼上的 inline SVG**，沒有元件化。改視窗樣式時每個 HTML 檔都要改。
- **主視覺的天空是 inline SVG**：用三種密度的 `<pattern>` 做網點抖色，雲是對齊格線的階梯狀 `<polygon>`，`shape-rendering="crispEdges"`。星星是 `<use>` 重複同一個路徑，加上 6×6 的小方塊亮點。不是圖片檔。
- **道具欄**：`index.html` 裡每件作品是一個 `<button class="slot">`，資料放在 `data-no`、`data-title`、`data-meta`、`data-href`、`data-img`、`data-alt`。`data-href` 留空時「Open project」按鈕會隱藏；`data-img` 是說明框顯示的照片，照片本身也連到作品頁；`data-img` 留空時顯示 `[project photo]` 佔位。
- **作品內頁版面**：最上面是滿寬主圖（照原比例）；下面是「About the work」說明（readme.txt）與 project info 並排；再下面是依內容分組的照片視窗（例如 lightboxes、dishes、visitors）。兩張以上的照片視窗滿寬、一排兩張（奇數張時第一張橫跨兩欄）；只有一張的視窗最寬 560px。Tourist Factory 與 State Banquet 沒有說明視窗，project info 與照片視窗並排。
- **閃爍**：帶 `.tw` class 的元素由 `main.js` 各自給隨機的 `animation-delay` 和 `animation-duration`。
- **首頁照片像素化**：`main.js` 第 3 段在照片上疊一張 canvas。預設顯示清晰照片；滑鼠移上或鍵盤 focus 時依 清晰→2→4→8→16px 方塊、每 70ms 一步變像素化，移開反向。只在 `(hover: hover) and (pointer: fine)` 啟用，觸控裝置直接顯示清晰照片；`prefers-reduced-motion` 時直接切換不跑動畫。
- **網站圖示（favicon）**：視窗標題列同款 7×6 像素愛心，薄荷綠 `#4FAE8E` 加深藍 `#1F2552` 外框。每個頁面的 `<head>` 都有三行 `<link rel="icon"…>`。
- **開場動畫**：只在首頁，每個瀏覽器分頁只播一次（sessionStorage `shandixme-intro`）。`index.html` 的 `<head>` 有一行 inline script 決定要不要播（reduced motion、網址帶 `#works` 等錨點時不播），會在 `<html>` 加 class `intro` 先藏起內容；`js/intro.js` 畫出 96×72 格的像素場景 SVG：書桌、小盆栽、CRT 螢幕、鍵盤滑鼠、主機。時間軸寫在 `style.css` 的 opening animation 區塊：0–0.5s 出現、0.7s 電源燈亮、0.9–1.6s 螢幕像老電視一樣先出現白線再撐開、1.55s 畫面閃爍出現、1.9–3.1s 讀取條（主機燈閃）、3.2–4.3s 衝進螢幕、4.3–4.8s 淡出。點擊、任何按鍵或 Skip 按鈕可跳過。script 失敗時 CSS 會在 8 秒後自動顯示內容。改時間時 `intro.js` 的 `END` 要和 CSS 的淡出時間一致。
- **游標拖尾**：`mousemove` 時產生 `.trail` 元素，約 0.75 秒淡出後移除。只在 `(pointer: fine)` 且沒有 `prefers-reduced-motion` 時啟用。
- **游標圖**是 24×38 的 PNG（12×19 像素箭頭放大兩倍）。白色是一般游標，薄荷綠（`#94D6BF`）用在連結與按鈕。
- **字體**從 Google Fonts 載入。
- **Google Analytics（GA4）**：評估 ID `G-8T6GRHKDJ5`。每個頁面 `<head>` 的網站圖示後面有三行（一行註解、兩行 script）。新增頁面時要一起複製；拿掉時把這三行刪掉即可。目前沒有 cookie 同意視窗。
- 外部相依只有 Google Fonts 和 Google Analytics。

## 設計規則

完整色票與元件規格在 `docs/design-system.md`。

**概念：夢裡的桌面。** 內容裝在復古作業系統視窗裡，浮在像素抖色的天空上。作品是 RPG 的道具欄，身份是 practice 列表，聯絡是系統訊息。

- 色系：灰藍紫為主，薄荷綠是點綴色（標題列、按鈕、選中的道具格、幾顆星星），面積要小；聯絡區是一塊深藍星空。**不要用粉紅**，也不要用偏綠的灰當大面積底色。
- 硬邊：2px 邊框、無圓角、無模糊的位移陰影。
- 不要加 emoji、不要加柔和的漸層卡片、不要加圓角。這些會破壞像素感。
- 參考圖只取氛圍。**不要照搬任何遊戲或作業系統的介面、圖示、商標。** 所有圖示都是原創的簡單像素圖形。
- 色系與版面經過多輪調整才定案，改動前先和作者確認。

## 技術限制與需遵守的事

- **無障礙**：可點擊的東西用真的 `<a>` 或 `<button>`；點擊範圍至少 44px；文字對比至少 4.5:1；裝飾用的 SVG 加 `aria-hidden="true"`；照片要有 `alt`。
- **動態效果**一律尊重 `prefers-reduced-motion`。
- **手機**：版面用 flex-wrap 自然堆疊。斷點：900px 道具欄由一排 8 格變 4 格；720px 桌面圖示轉橫排；560px 道具欄變兩欄矮格（編號在左、名稱在右，高 56px，讓下方照片留在畫面內）、作品內頁照片變一欄；同一斷點下點道具格後，若照片不在畫面內會自動捲到看得見。改版面後要用 390px 寬度檢查。
- **GitHub Pages**：所有路徑用相對路徑；`CNAME` 和 `.nojekyll` 不要刪。
- **照片**：放進 `img/` 前壓縮到適合網頁的大小（長邊約 1400–1800px）。作品照片用 `image-rendering: auto`（`style.css` 對 `img` 預設是 `pixelated`，那是給像素圖用的）。
- **`mailto:` 連結旁邊要同時顯示信箱文字**，目前已經是這樣。

## 尚未驗證的地方

- 只用 Chrome 檢查過 1280px 和 390px。Safari、Firefox 和平板寬度還沒看。
- 自訂游標與開場動畫在 Safari 上的表現沒測過。

## 常見工作怎麼做

**改文字**：在對應的 `.html` 裡搜尋那句話，直接改。

**放照片**：檔案放 `img/`，照片用
`<img src="img/檔名.jpg" alt="描述" loading="lazy" style="display: block; width: 100%; height: auto; image-rendering: auto">`，放進作品內頁對應的照片視窗（複製同一個視窗裡現有的一格照片再改檔名和 alt 最簡單）。

**新增作品頁**：複製 `work-unfed-time.html`，改檔名與內容，再到 `index.html` 把該作品按鈕的 `data-href` 填上新檔名。每頁底部「Next project」區塊的作品名稱與連結也要跟著改，讓順序接得起來（最後一件接回 01）。

**新增一件作品到道具欄**：複製一個 `<button class="slot">` 區塊，改 `data-*` 屬性和兩個 `<span>`。目前八件、一排八格；第九件起會排到第二排。

**新增經歷**：`about.html` 的 experience.log 裡，每筆是一個三欄的 flex 列（日期、類型、內容），複製一列貼在最上面。
