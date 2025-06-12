![Stamina Calculator](/assets/images/logo.png)

# AP / Stamina Calculator

這是一個為 BlueArchive 活動設計的 AP (Stamina) 計算器。

~~可能也適用其他遊戲。~~

[English](/readme.md) | [正體中文](/docs/readme_zh-TW.md)

## 使用方法

0. 打開 [AP計算器](https://undecv.github.io/APCalculator/)。
1. 輸入數值；
2. 看結果。

### 訣竅

若只需進行簡單計算，換句話說，已經知道「所需代幣總數」（Total Tokens Needed），可以將商店商品設定數量為「1」，設定價格為「所需代幣總數」。例如：

```json
{"shop":[{"quantity":1,"price":1000}],"currentTokens":250,"tokensPerMission":50,"staminaPerMission":20}
```

## 功能

- 支援語言：英語、正體中文。
- 🆕 支援主題：明亮、暗黑。
- 即時交互、輸入驗證。
- 🆕 啟用＼禁用、新增＼刪除資料列。
- 支援 JSON 導入、導出。
- 🆕 會記得你的輸入資料和界面設定。
- 🆕 重設資料和設定。
- 完全離線。
- 伊吹友善。

## 注意事項

- 所有計算在本地瀏覽器完成，必須啟用 JavaScript。
- 如果你會 JSON，直接修改「導入／導出」的內容可能比較快。
- ~~如果怕數值不對可以丟到 `/docs/stamina.ipynb` 驗證。~~
- ~~夏萊和優香可能不會對計算結果背書。~~

## 參考

- Theme: [Tocas UI](https://github.com/teacat/tocas) (MIT)
- Logo:
    - nulla2011/Bluearchive-logo: [GitHub](https://github.com/nulla2011/Bluearchive-logo), [Page](https://lab.nulla.top/ba-logo)
    - appleneko2001/bluearchive-logo: [GitHub](https://github.com/appleneko2001/bluearchive-logo), [Page](https://appleneko2001-bluearchive-logo.vercel.app/)
    - [Blue Archive Logo Generator](https://symbolon.pages.dev/)
