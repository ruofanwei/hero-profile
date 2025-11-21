## Getting Started

請使用 Node 20.18+ 與 `pnpm`。

### Installation & Running

1. Clone the repository
2. Install packages:

```
pnpm install
```

3. Run the development server:

```
pnpm dev
```

The application will be available at `http://localhost:5173` (or another port if `5173` is in use).

### Available Scripts

```bash
pnpm lint      # run ESLint
pnpm vitest run  # run tests
pnpm format # run Prettier
```

## 架構與資料流

```
src/
  api/
  components/
  context/
  hooks/
  layouts/
  pages/
  pages/__tests__/
```

- 資料來源 HeroDataProvider
  - 進入應用時呼叫一次 /heroes 並存進 Context，所有需要列表資料的元件都從這裡讀，只有儲存成功才 refetch。
    因此路由切換時 Hero List 會保持在同一份資料上，也方便統一處理 loading/error。
- HeroProfilePanel 的 state - API 讀取與使用者編輯分開管理，讓規則容易維護
  - useHeroProfile 只負責 API 讀取與錯誤處理，元件內另有 draft 來暫存使用者輸入，baseTotal 則記錄原始總點數，把兩者相減即可得剩餘點數。
    這樣就能清楚區分 API 原始值 vs. 正在編輯的值，驗證規則（剩餘點數=0才能儲存）也好實作，需要時還可以把 draft 重置回最新 API 結果。

## 第三方 Library 與選用原因

| Library                                                     | 用途                                    | 選擇理由                                                                                 |
| ----------------------------------------------------------- | --------------------------------------- | ---------------------------------------------------------------------------------------- |
| React Router DOM                                            | 支援 `<Routes>`、`<Outlet>` 與 URL 參數 | 確保 `/heroes/:heroId` 直接輸入可正常 render                                             |
| Axios                                                       | HTTP client                             | 需要 timeout、JSON header 與錯誤攔截，封裝 API 更直覺                                    |
| Ant Design                                                  | UI 元件 (Card/Button/Alert/Result 等)   | 加速開發                                                                                 |
| styled-components                                           | CSS-in-JS                               | 可使用 `css` prop 讓樣式與元件邏輯共存，易於客製與維護                                   |
| ts-pattern                                                  | 判斷 狀態切換                           | 以 declarative pattern matching 寫法讓 Hero Profile loading/error 分支更可讀、更容易擴充 |
| Vitest + React Testing Library + Testing Library user-event | unit test                               | 與 Vite 整合、支援 JSDOM，容易撰寫使用者情境測試                                         |

## 註解原則

1. 程式本身已說明行為；註解只補充商業邏輯、特殊原因或上下文。
2. 若目前做不到或知道寫得不完美，需要留下 TODO 紀錄。
3. 團隊共用的 utility 函式需要說明適用情境。
4. 技術限制、hack、workaround 這類長期存在的 edge case 需說清楚。

## 困難與解法

- **單一 Hero API 不穩**：`GET /heroes/1` 會回 `Backend error`，因此列表資料只依賴 `/heroes`，Profile 失敗時顯示錯誤狀態並保留列表。

## 加分

- **CSS-in-JS**：styled-components + `css` prop。
- **UX**：儲存按鈕加上剩餘點數提示、圖片錯誤時顯示 placeholder。
- **ts-pattern**：以 pattern matching 集中處理 loading / error / invalid hero guard view。
- **測試**：使用 Vitest + RTL (HeroList、HeroProfilePanel) 覆蓋主要互動流程。

## 測試

| 測試                                                                        | 測什麼                                                                                       | 為什麼需要                                                                           |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `HeroList.test.tsx`                                                         | 依不同 URL 參數渲染 Hero List，檢查對應卡片是否呈現選取狀態                                  | 確保使用者直接輸入 `/heroes/:id` 或重新整理時，列表仍能正常顯示並依 URL 標示選取狀態 |
| `HeroProfilePanel.test.tsx` `updates remaining points when stats change`    | 模擬減少能力值，檢查剩餘點數文字是否更新                                                     | 驗證 `baseTotal + draft` 的計算邏輯、避免剩餘點數顯示錯誤                            |
| `HeroProfilePanel.test.tsx` `saves profile after redistributing all points` | 調整能力值讓剩餘點數回到 0，按儲存後檢查 `patchHeroProfile` / `setProfile` / `refetchHeroes` | 確保只要等和且剩餘點數為 0 才能儲存，並驗證儲存後的列表/ Profile 會重新同步          |

## AI 輔助紀錄

- 主要透過 ChatGPT (OpenAI Codex) 協助整理規格疑慮、規劃實作步驟與部份程式碼草擬，再由本人調整與驗證。
