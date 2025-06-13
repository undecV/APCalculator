![Stamina Calculator](/assets/images/open_graph.png)

# AP (Stamina) Calculator

This is an AP (Stamina) calculator designed for BlueArchive events.

~~May also be applicable to other games.~~

[English](./readme.md) | [正體中文](./docs/readme_zh-TW.md)

## How to Use

1. Open [AP Calculator](https://undecv.github.io/APCalculator/).
2. Enter the values.
3. View the results.

## Features

- Supported languages: English, Traditional Chinese.
- 🆕 Supported themes: Light, Dark.
- 🆕 PWA.
- Real-time interaction, input validation.
- Support JSON import and export.
- 🆕 Enable \ disable, add \ delete data rows.
- 🆕 Will remember your input data and interface settings.
- 🆕 Reset data and settings.
- Ibuki-friendly design.

## Notes

- All calculations are performed locally in the browser; JavaScript must be enabled.
- ~~If you're worried about incorrect values, you can verify them using `/docs/stamina.ipynb`.~~
- ~~Schale and Yuuka may not endorse the calculation results.~~

### Tips

If only simple calculations are required, in other words, if the "Total Tokens Needed" is already known, you can set the store item to have a Quantity of "1" and a Price equal to the "Total Tokens Needed". For example:

```json
{"shop":[{"quantity":1,"price":1000}],"currentTokens":250,"tokensPerMission":50,"staminaPerMission":20}
```

If you're familiar with JSON, directly editing the import / export content may be faster.

## Reference

- Theme: [Tocas UI](https://github.com/teacat/tocas) (MIT)
- Logo:
    - nulla2011/Bluearchive-logo: [GitHub](https://github.com/nulla2011/Bluearchive-logo), [Page](https://lab.nulla.top/ba-logo)
    - appleneko2001/bluearchive-logo: [GitHub](https://github.com/appleneko2001/bluearchive-logo), [Page](https://appleneko2001-bluearchive-logo.vercel.app/)
    - [Blue Archive Logo Generator](https://symbolon.pages.dev/)
