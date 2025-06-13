"use strict";
class UserInterfaceStateModel {
    constructor(theme = "dark", language = "en") {
        this.allowedThemes = new Set(["light", "dark"]);
        this.allowedLanguages = new Set(["en", "zh-TW"]);
        this.fallbackLanguage = "en";
        this.i18n = {
            "en": {
                "page-title": "AP (Stamina) Calculator",
                "theme-selector-label": "Theme:",
                "language-selector-label": "Language:",
                "input-header": "Input",
                "quantity-table-header": "Quantity",
                "price-table-header": "Price",
                "current-tokens-label": "Current Tokens:",
                "tokens-per-mission-label": "Tokens Per Mission:",
                "stamina-per-mission-label": "Stamina Per Mission:",
                "results-header": "Results",
                "completion-progress-label": "Completion Progress",
                "total-tokens-label": "Total tokens",
                "remaining-tokens-label": "Remaining Tokens",
                "remaining-missions-label": "Remaining Missions",
                "remaining-stamina-unit": "times",
                "remaining-stamina-label": "Remaining Stamina",
                "export-header": "Import / Export",
                "disclaimer": "<del>Schale and Yuuka<br />may not endorse the calculation results.</del>",
                "reset-data-button-label": "Reset Data",
                "reset-all-button-label": "Reset All",
            },
            "zh-TW": {
                "page-title": "體力計算器",
                "theme-selector-label": "主題：",
                "language-selector-label": "語言：",
                "input-header": "輸入",
                "quantity-table-header": "數量",
                "price-table-header": "價格",
                "current-tokens-label": "當前代幣：",
                "tokens-per-mission-label": "每次任務代幣：",
                "stamina-per-mission-label": "每次任務體力：",
                "results-header": "計算結果",
                "completion-progress-label": "完成進度",
                "total-tokens-label": "所需代幣",
                "remaining-tokens-label": "剩餘代幣",
                "remaining-missions-label": "剩餘任務",
                "remaining-stamina-unit": "次",
                "remaining-stamina-label": "所需體力",
                "export-header": "匯入＼匯出",
                "disclaimer": "<del>夏萊和優香可能不會對計算結果背書。</del>",
                "reset-data-button-label": "重設資料",
                "reset-all-button-label": "重設全部",
            }
        };
        this._theme = "dark";
        this._language = "en";
        this.theme = theme;
        this.language = language;
    }
    get theme() {
        return this._theme;
    }
    set theme(value) {
        if (this.allowedThemes.has(value)) {
            this._theme = value;
        }
        else {
            console.warn(`Invalid theme: ${value}`);
        }
    }
    get language() {
        return this._language;
    }
    set language(value) {
        if (this.allowedLanguages.has(value)) {
            this._language = value;
        }
        else {
            console.warn(`Invalid language: ${value}`);
        }
    }
    toJSON() {
        return {
            theme: this._theme,
            language: this._language,
        };
    }
    static fromJSON(json) {
        var _a, _b;
        return new UserInterfaceStateModel((_a = json.theme) !== null && _a !== void 0 ? _a : "light", (_b = json.language) !== null && _b !== void 0 ? _b : "en");
    }
}
class ShopItem {
    constructor(quantity = 0, price = 0, enable = true) {
        this._quantity = 0;
        this._price = 0;
        this._enable = true;
        this.quantity = quantity;
        this.price = price;
        this.enable = enable;
    }
    get quantity() {
        return this._quantity;
    }
    set quantity(value) {
        this._quantity = Math.max(0, Math.floor(value));
    }
    get price() {
        return this._price;
    }
    set price(value) {
        this._price = Math.max(0, Math.floor(value));
    }
    get enable() {
        return this._enable;
    }
    set enable(value) {
        this._enable = value;
    }
    toJSON() {
        return {
            quantity: this.quantity,
            price: this.price,
            enable: this.enable
        };
    }
    static fromJSON(obj) {
        return new ShopItem(Number(obj.quantity), Number(obj.price), obj.enable !== false);
    }
}
class APCalculatorDataModel {
    constructor() {
        this._shop = [
            new ShopItem(70, 5, false),
            new ShopItem(35, 15, true),
            new ShopItem(20, 50, true),
            new ShopItem(10, 200, true)
        ];
        this._currentTokens = 3472;
        this._tokensPerMission = 72;
        this._staminaPerMission = 20;
    }
    get shop() {
        return this._shop;
    }
    set shop(rows) {
        this._shop = rows;
    }
    updateShopItem(index, updates) {
        const item = this._shop[index];
        if (!item)
            return;
        if (updates.quantity !== undefined)
            item.quantity = updates.quantity;
        if (updates.price !== undefined)
            item.price = updates.price;
        if (updates.enable !== undefined)
            item.enable = updates.enable;
    }
    get currentTokens() {
        return this._currentTokens;
    }
    set currentTokens(value) {
        this._currentTokens = Math.max(0, Math.floor(value)); // 防負數與小數
    }
    get tokensPerMission() {
        return this._tokensPerMission;
    }
    set tokensPerMission(value) {
        this._tokensPerMission = Math.max(0, value);
    }
    get staminaPerMission() {
        return this._staminaPerMission;
    }
    set staminaPerMission(value) {
        this._staminaPerMission = Math.max(0, value);
    }
    /** 所有啟用項目的總代幣消耗 */
    get totalTokens() {
        let total = 0;
        for (const item of this._shop) {
            if (!item.enable)
                continue;
            total += item.quantity * item.price;
        }
        return total;
    }
    /** 還需要的代幣數 */
    get remainingTokens() {
        return Math.max(this.totalTokens - this._currentTokens, 0);
    }
    /** 任務完成度（百分比） */
    get completionProgress() {
        if (this.totalTokens === 0)
            return 100;
        const ratio = this._currentTokens / this.totalTokens;
        return Math.min(Math.floor(ratio * 100), 100);
    }
    /** 還需要幾場任務（可為小數） */
    get remainingMissions() {
        if (this._tokensPerMission === 0)
            return 0;
        return this.remainingTokens / this._tokensPerMission;
    }
    /** 還需要多少體力 */
    get remainingStamina() {
        return Math.ceil(this.remainingMissions) * this._staminaPerMission;
    }
    toJSON() {
        return {
            shop: this.shop,
            currentTokens: this.currentTokens,
            tokensPerMission: this.tokensPerMission,
            staminaPerMission: this.staminaPerMission,
        };
    }
    static fromJSON(data) {
        var _a;
        const model = new APCalculatorDataModel();
        model.shop = ((_a = data.shop) !== null && _a !== void 0 ? _a : []).map(ShopItem.fromJSON);
        model.currentTokens = data.currentTokens;
        model.tokensPerMission = data.tokensPerMission;
        model.staminaPerMission = data.staminaPerMission;
        return model;
    }
}
class Model {
    constructor() {
        this.ui = new UserInterfaceStateModel();
        this.data = new APCalculatorDataModel();
    }
}
class View {
    constructor(controller) {
        this.controller = controller;
    }
    bindEvents() {
        const themeSelector = document.getElementById("theme-selector");
        themeSelector.addEventListener("change", (event) => this.controller.onThemeToggle(event));
        const languageSelector = document.getElementById("language-selector");
        languageSelector.addEventListener("change", (event) => this.controller.onLanguageChange(event));
        const dataExportTextarea = document.getElementById("data-export-textarea");
        dataExportTextarea.addEventListener("input", (event) => this.controller.onDataExportTextareaChange(event));
        const addRowButton = document.getElementById("add-row-button");
        addRowButton.addEventListener("click", (event) => this.controller.onAddRowButtonClick(event));
        const copyExportButton = document.getElementById("copy-export-button");
        copyExportButton.addEventListener("click", (event) => this.controller.onCopyExportButtonClick(event));
        const resetDataButton = document.getElementById("reset-data-button");
        resetDataButton.addEventListener("click", (event) => this.controller.onResetDataClick(event));
        const resetAllButton = document.getElementById("reset-all-button");
        resetAllButton.addEventListener("click", (event) => this.controller.onResetAllClick(event));
        const currentTokensInput = document.getElementById("current-tokens-value");
        currentTokensInput.addEventListener("input", (event) => this.controller.onCurrentTokensChange(event));
        const tokensPerMissionInput = document.getElementById("tokens-per-mission-value");
        tokensPerMissionInput.addEventListener("input", (event) => this.controller.onTokensPerMissionChange(event));
        const staminaPerMissionInput = document.getElementById("stamina-per-mission-value");
        staminaPerMissionInput.addEventListener("input", (event) => this.controller.onStaminaPerMissionChange(event));
    }
    updateTheme(theme) {
        switch (theme) {
            case 'dark':
                document.documentElement.classList.remove('is-light');
                document.documentElement.classList.add('is-dark');
                document.getElementById("theme-selector-light").checked = false;
                document.getElementById("theme-selector-dark").checked = true;
                break;
            case 'light':
                document.documentElement.classList.remove('is-dark');
                document.documentElement.classList.add('is-light');
                document.getElementById("theme-selector-light").checked = true;
                document.getElementById("theme-selector-dark").checked = false;
                break;
            default:
                console.warn(`Unknown theme: ${theme}`);
                return;
        }
    }
    updateLanguage(language, i18n, fallbackLang = "en") {
        document.getElementById("language-selector").value = language;
        const elements = document.querySelectorAll("[data-i18n]");
        elements.forEach(el => {
            var _a, _b, _c;
            const key = el.dataset.i18n;
            const text = key && ((_b = (_a = i18n[language]) === null || _a === void 0 ? void 0 : _a[key]) !== null && _b !== void 0 ? _b : (_c = i18n[fallbackLang]) === null || _c === void 0 ? void 0 : _c[key]);
            if (key && text) {
                el.innerHTML = text;
            }
        });
    }
    renderTable(data) {
        var _a;
        const table = document.getElementById("shop-table");
        const tbody = (_a = table.tBodies[0]) !== null && _a !== void 0 ? _a : table.createTBody();
        const rowTemplate = document.getElementById("shop-row-template");
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
        data.shop.forEach((item, index) => {
            const rowElement = rowTemplate.content.firstElementChild.cloneNode(true);
            rowElement.dataset.index = index.toString();
            const checkbox = rowElement.querySelector('[data-role="enable"]');
            checkbox.checked = item.enable;
            checkbox.dataset.index = index.toString();
            const quantityInput = rowElement.querySelector('[data-role="quantity"]');
            quantityInput.value = item.quantity.toString();
            quantityInput.dataset.index = index.toString();
            quantityInput.parentElement.classList.toggle("is-solid", !item.enable);
            const priceInput = rowElement.querySelector('[data-role="price"]');
            priceInput.value = item.price.toString();
            priceInput.dataset.index = index.toString();
            priceInput.parentElement.classList.toggle("is-solid", !item.enable);
            const deleteButton = rowElement.querySelector('[data-role="delete"]');
            deleteButton.dataset.index = index.toString();
            checkbox.addEventListener("change", (event) => {
                this.controller.onEnableCheck(event);
            });
            quantityInput.addEventListener("input", (event) => {
                this.controller.onQuantityChange(event);
            });
            priceInput.addEventListener("input", (event) => {
                this.controller.onPriceChange(event);
            });
            deleteButton.addEventListener("click", (event) => {
                this.controller.onDeleteButtonClick(event);
            });
            tbody.appendChild(rowElement);
        });
    }
    renderInputs(data) {
        document.getElementById("current-tokens-value").value = data.currentTokens.toString();
        document.getElementById("tokens-per-mission-value").value = data.tokensPerMission.toString();
        document.getElementById("stamina-per-mission-value").value = data.staminaPerMission.toString();
    }
    renderResults(data) {
        document.getElementById("completion-progress-value").textContent = data.completionProgress.toString() + "%";
        document.getElementById("completion-progress-bar").style.setProperty("--value", data.completionProgress.toString());
        document.getElementById("total-tokens-value").textContent = data.totalTokens.toString();
        document.getElementById("remaining-tokens-value").textContent = data.remainingTokens.toString();
        document.getElementById("remaining-missions-value").textContent = data.remainingMissions.toFixed(2).toString();
        document.getElementById("remaining-stamina-value").textContent = data.remainingStamina.toString();
    }
    renderExport(data) {
        document.getElementById("data-export-textarea").value = JSON.stringify(data);
        this.displayError();
    }
    displayError(message) {
        const errorMessageNotice = document.getElementById("error-message-notice");
        const errorMessageContent = document.getElementById("error-message-content");
        if (!message) {
            errorMessageNotice.classList.toggle("has-hidden", true);
        }
        else {
            errorMessageNotice.classList.toggle("has-hidden", false);
            errorMessageContent.textContent = message;
        }
    }
}
class Controller {
    constructor(model) {
        this.model = model;
        this.view = new View(this);
    }
    init() {
        this.view.bindEvents();
        this.getLocalStorage();
        this.setLocalStorage();
        this.view.updateTheme(this.model.ui.theme);
        this.view.updateLanguage(this.model.ui.language, this.model.ui.i18n, this.model.ui.fallbackLanguage);
        this.view.renderTable(this.model.data);
        this.view.renderInputs(this.model.data);
        this.view.renderResults(this.model.data);
        this.view.renderExport(this.model.data);
    }
    getLocalStorage() {
        const ui_raw = localStorage.getItem("ui-state");
        const ui_parsed = ui_raw ? JSON.parse(ui_raw) : {};
        this.model.ui = UserInterfaceStateModel.fromJSON(ui_parsed);
        const localStorageData = localStorage.getItem("calc-data");
        let parsedData = null;
        try {
            parsedData = localStorageData ? JSON.parse(localStorageData) : null;
        }
        catch (e) {
            console.warn("解析 calc-data 時失敗，使用預設資料", e);
        }
        this.model.data = parsedData ? APCalculatorDataModel.fromJSON(parsedData) : new APCalculatorDataModel();
    }
    setLocalStorage() {
        localStorage.setItem("ui-state", JSON.stringify(this.model.ui.toJSON()));
        localStorage.setItem("calc-data", JSON.stringify(this.model.data.toJSON()));
    }
    onThemeToggle(event) {
        var _a;
        const themeSelector = event.currentTarget;
        const checkedInput = themeSelector.querySelector("input[name='theme-selector']:checked");
        const theme = (_a = checkedInput === null || checkedInput === void 0 ? void 0 : checkedInput.value) !== null && _a !== void 0 ? _a : "light";
        this.model.ui.theme = theme;
        this.view.updateTheme(this.model.ui.theme);
        this.setLocalStorage();
    }
    onLanguageChange(event) {
        const languageSelector = event.currentTarget;
        this.model.ui.language = languageSelector.value;
        this.view.updateLanguage(this.model.ui.language, this.model.ui.i18n, this.model.ui.fallbackLanguage);
        this.setLocalStorage();
    }
    onEnableCheck(event) {
        const element = event.currentTarget;
        const index = Number(element.dataset.index);
        this.model.data.updateShopItem(index, { enable: element.checked });
        this.view.renderTable(this.model.data);
        this.view.renderResults(this.model.data);
        this.view.renderExport(this.model.data);
        this.setLocalStorage();
    }
    onQuantityChange(event) {
        const element = event.currentTarget;
        const index = Number(element.dataset.index);
        this.model.data.updateShopItem(index, { quantity: Number(element.value) });
        element.value = this.model.data.shop[index].quantity.toString();
        this.view.renderResults(this.model.data);
        this.view.renderExport(this.model.data);
        this.setLocalStorage();
    }
    onPriceChange(event) {
        const element = event.currentTarget;
        const index = Number(element.dataset.index);
        this.model.data.updateShopItem(index, { price: Number(element.value) });
        element.value = this.model.data.shop[index].price.toString();
        this.view.renderResults(this.model.data);
        this.view.renderExport(this.model.data);
        this.setLocalStorage();
    }
    onDeleteButtonClick(event) {
        const element = event.currentTarget;
        const index = Number(element.dataset.index);
        const shop = this.model.data.shop;
        shop.splice(index, 1);
        this.model.data.shop = shop;
        this.view.renderTable(this.model.data);
        this.view.renderResults(this.model.data);
        this.view.renderExport(this.model.data);
        this.setLocalStorage();
    }
    onAddRowButtonClick(event) {
        const shop = this.model.data.shop;
        shop.push(new ShopItem(0, 0, true));
        this.model.data.shop = shop;
        this.view.renderTable(this.model.data);
        this.view.renderResults(this.model.data);
        this.view.renderExport(this.model.data);
        this.setLocalStorage();
    }
    onCurrentTokensChange(event) {
        const element = event.currentTarget;
        this.model.data.currentTokens = Number(element.value);
        this.view.renderResults(this.model.data);
        this.view.renderExport(this.model.data);
        this.setLocalStorage();
    }
    onTokensPerMissionChange(event) {
        const element = event.currentTarget;
        this.model.data.tokensPerMission = Number(element.value);
        this.view.renderResults(this.model.data);
        this.view.renderExport(this.model.data);
        this.setLocalStorage();
    }
    onStaminaPerMissionChange(event) {
        const element = event.currentTarget;
        this.model.data.staminaPerMission = Number(element.value);
        this.view.renderResults(this.model.data);
        this.view.renderExport(this.model.data);
        this.setLocalStorage();
    }
    onDataExportTextareaChange(event) {
        const element = event.currentTarget;
        try {
            this.model.data = APCalculatorDataModel.fromJSON(JSON.parse(element.value));
            this.view.renderTable(this.model.data);
            this.view.renderInputs(this.model.data);
            this.view.renderResults(this.model.data);
            this.view.renderExport(this.model.data);
            this.setLocalStorage();
        }
        catch (e) {
            this.view.displayError(e instanceof Error ? e.message : String(e));
            return;
        }
    }
    onCopyExportButtonClick(event) {
        navigator.clipboard.writeText(JSON.stringify(this.model.data));
    }
    onResetDataClick(event) {
        localStorage.removeItem("calc-data");
        this.model.data = new APCalculatorDataModel();
        this.view.renderTable(this.model.data);
        this.view.renderInputs(this.model.data);
        this.view.renderResults(this.model.data);
        this.view.renderExport(this.model.data);
        this.setLocalStorage();
    }
    onResetAllClick(event) {
        localStorage.removeItem("ui-state");
        localStorage.removeItem("calc-data");
        this.model.ui = new UserInterfaceStateModel();
        this.model.data = new APCalculatorDataModel();
        this.view.updateTheme(this.model.ui.theme);
        this.view.updateLanguage(this.model.ui.language, this.model.ui.i18n, this.model.ui.fallbackLanguage);
        this.view.renderTable(this.model.data);
        this.view.renderInputs(this.model.data);
        this.view.renderResults(this.model.data);
        this.view.renderExport(this.model.data);
        this.setLocalStorage();
    }
}
const model = new Model();
const control = new Controller(model);
control.init();
