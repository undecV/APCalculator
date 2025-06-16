type I18nDict = {
    [key: string]: {
        [key: string]: string;
    };
};

class UserInterfaceStateModel {
    allowedThemes: Set<string> = new Set(["light", "dark"]);
    allowedLanguages: Set<string> = new Set(["en", "zh-TW"]);
    fallbackLanguage: string = "en";

    i18n: I18nDict = {
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
            "save-data-button": "Save",
            "saved-data-item-name-input-placeholder": "Name this save...",
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
            "save-data-button": "存檔",
            "saved-data-item-name-input-placeholder": "命名此存檔...",
        }
    };

    private _theme: string = "dark";
    private _language: string = "en";

    constructor(theme: string = "dark", language: string = "en") {
        this.theme = theme;
        this.language = language;
    }

    get theme(): string {
        return this._theme;
    }

    set theme(value: string) {
        if (this.allowedThemes.has(value)) {
            this._theme = value;
        } else {
            console.warn(`Invalid theme: ${value}`);
        }
    }

    get language(): string {
        return this._language;
    }

    set language(value: string) {
        if (this.allowedLanguages.has(value)) {
            this._language = value;
        } else {
            console.warn(`Invalid language: ${value}`);
        }
    }

    toJSON(): object {
        return {
            theme: this._theme,
            language: this._language,
        };
    }

    static fromJSON(json: Partial<{ theme: string; language: string }>): UserInterfaceStateModel {
        return new UserInterfaceStateModel(json.theme ?? "dark", json.language ?? "en");
    }
}

class ShopItem {
    private _quantity: number = 0;
    private _price: number = 0;
    private _enable: boolean = true;

    constructor(quantity: number = 0, price: number = 0, enable: boolean = true) {
        this.quantity = quantity;
        this.price = price;
        this.enable = enable;
    }

    get quantity(): number {
        return this._quantity;
    }

    set quantity(value: number) {
        this._quantity = Math.max(0, Math.floor(value));
    }

    get price(): number {
        return this._price;
    }

    set price(value: number) {
        this._price = Math.max(0, Math.floor(value));
    }

    get enable(): boolean {
        return this._enable;
    }

    set enable(value: boolean) {
        this._enable = value;
    }

    toJSON(): object {
        return {
            quantity: this.quantity,
            price: this.price,
            enable: this.enable
        };

    }

    static fromJSON(obj: { quantity: any; price: any; enable?: any }): ShopItem {
        return new ShopItem(
            Number(obj.quantity),
            Number(obj.price),
            obj.enable !== false
        );
    }
}

class APCalculatorDataModel {
    private _shop: Array<ShopItem> = [
        new ShopItem(70, 5, false),
        new ShopItem(35, 15, true),
        new ShopItem(20, 50, true),
        new ShopItem(10, 200, true),
    ]
    private _currentTokens = 3067
    private _tokensPerMission = 60
    private _staminaPerMission = 20


    get shop() {
        return this._shop;
    }

    set shop(rows: Array<ShopItem>) {
        this._shop = rows;
    }

    updateShopItem(index: number, updates: Partial<{ quantity: number; price: number; enable: boolean }>): void {
        const item = this._shop[index];
        if (!item) return;

        if (updates.quantity !== undefined) item.quantity = updates.quantity;
        if (updates.price !== undefined) item.price = updates.price;
        if (updates.enable !== undefined) item.enable = updates.enable;
    }

    get currentTokens(): number {
        return this._currentTokens;
    }

    set currentTokens(value: number) {
        this._currentTokens = Math.max(0, Math.floor(value)); // 防負數與小數
    }

    get tokensPerMission(): number {
        return this._tokensPerMission;
    }

    set tokensPerMission(value: number) {
        this._tokensPerMission = Math.max(0, value);
    }

    get staminaPerMission(): number {
        return this._staminaPerMission;
    }

    set staminaPerMission(value: number) {
        this._staminaPerMission = Math.max(0, value);
    }

    get totalTokens(): number {
        let total = 0;
        for (const item of this._shop) {
            if (!item.enable) continue;
            total += item.quantity * item.price;
        }
        return total;
    }

    get remainingTokens(): number {
        return Math.max(this.totalTokens - this._currentTokens, 0);
    }

    get completionProgress(): number {
        if (this.totalTokens === 0) return 100;
        const ratio = this._currentTokens / this.totalTokens;
        return Math.min(Math.floor(ratio * 100), 100);
    }

    get remainingMissions(): number {
        if (this._tokensPerMission === 0) return 0;
        return this.remainingTokens / this._tokensPerMission;
    }

    get remainingStamina(): number {
        return Math.ceil(this.remainingMissions) * this._staminaPerMission;
    }

    toJSON(): object {
        return {
            shop: this.shop,
            currentTokens: this.currentTokens,
            tokensPerMission: this.tokensPerMission,
            staminaPerMission: this.staminaPerMission,
        };
    }

    static fromJSON(data: any): APCalculatorDataModel {
        const model = new APCalculatorDataModel();
        model.shop = (data.shop ?? []).map(ShopItem.fromJSON);
        model.currentTokens = data.currentTokens;
        model.tokensPerMission = data.tokensPerMission;
        model.staminaPerMission = data.staminaPerMission;
        return model;
    }
}

class Model {
    public ui: UserInterfaceStateModel = new UserInterfaceStateModel();
    public data: APCalculatorDataModel = new APCalculatorDataModel();
    public dataset: Record<string, APCalculatorDataModel> = {};
}

class View {
    private controller: Controller;

    constructor(controller: Controller) {
        this.controller = controller;
    }

    bindEvents(): void {
        const themeSelector = document.getElementById("theme-selector") as HTMLFormElement;
        themeSelector.addEventListener(
            "change", (event) => this.controller.onThemeToggle(event)
        );
        const languageSelector = document.getElementById("language-selector") as HTMLSelectElement;
        languageSelector.addEventListener(
            "change", (event) => this.controller.onLanguageChange(event)
        );
        const dataExportTextarea = document.getElementById("data-export-textarea") as HTMLTextAreaElement;
        dataExportTextarea.addEventListener(
            "input", (event) => this.controller.onDataExportTextareaChange(event)
        );
        const addRowButton = document.getElementById("add-row-button") as HTMLButtonElement;
        addRowButton.addEventListener(
            "click", (event) => this.controller.onAddRowButtonClick(event)
        );
        const copyExportButton = document.getElementById("copy-export-button") as HTMLButtonElement;
        copyExportButton.addEventListener(
            "click", (event) => this.controller.onCopyExportButtonClick(event)
        );
        const currentTokensInput = document.getElementById("current-tokens-value") as HTMLInputElement;
        currentTokensInput.addEventListener(
            "input", (event) => this.controller.onCurrentTokensChange(event)
        );
        const tokensPerMissionInput = document.getElementById("tokens-per-mission-value") as HTMLInputElement;
        tokensPerMissionInput.addEventListener(
            "input", (event) => this.controller.onTokensPerMissionChange(event)
        );
        const staminaPerMissionInput = document.getElementById("stamina-per-mission-value") as HTMLInputElement;
        staminaPerMissionInput.addEventListener(
            "input", (event) => this.controller.onStaminaPerMissionChange(event)
        );
        const resetDataButton = document.getElementById("reset-data-button") as HTMLButtonElement;
        resetDataButton.addEventListener(
            "click", (event) => this.controller.onResetDataClick(event)
        );
        const resetAllButton = document.getElementById("reset-all-button") as HTMLButtonElement;
        resetAllButton.addEventListener(
            "click", (event) => this.controller.onResetAllClick(event)
        );
        const saveDataButton = document.getElementById("save-data-button") as HTMLButtonElement;
        saveDataButton.addEventListener(
            "click", (event) => this.controller.onSaveDataButtonClick(event)
        );
    }

    updateTheme(theme: string): void {
        switch (theme) {
            case 'dark':
                document.documentElement.classList.remove('is-light');
                document.documentElement.classList.add('is-dark');
                (document.getElementById("theme-selector-light") as HTMLInputElement).checked = false;
                (document.getElementById("theme-selector-dark") as HTMLInputElement).checked = true;
                break;
            case 'light':
                document.documentElement.classList.remove('is-dark');
                document.documentElement.classList.add('is-light');
                (document.getElementById("theme-selector-light") as HTMLInputElement).checked = true;
                (document.getElementById("theme-selector-dark") as HTMLInputElement).checked = false;
                break;
            default:
                console.warn(`Unknown theme: ${theme}`);
                return;
        }
    }

    updateLanguage(language: string, i18n: I18nDict, fallbackLang: string = "en"): void {
        (document.getElementById("language-selector") as HTMLSelectElement).value = language;

        const elements = document.querySelectorAll<HTMLElement>("[data-i18n]");
        const suffixes: Array<[string, (el: HTMLElement, value: string) => void]> = [
            ["-placeholder", (el, value) => {
                if ("placeholder" in el) (el as HTMLInputElement | HTMLTextAreaElement).placeholder = value;
            }],
        ];

        elements.forEach(el => {
            const key = el.dataset.i18n;
            if (!key) return;

            const langDict = i18n[language] ?? {};
            const fallbackDict = i18n[fallbackLang] ?? {};

            let matched = false;
            for (const [suffix, apply] of suffixes) {
                const dictKey = key + suffix;
                const value = langDict[dictKey] ?? fallbackDict[dictKey];
                if (value !== undefined) {
                    apply(el, value);
                    matched = true;
                }
            }

            if (!matched) {
                const text = langDict[key] ?? fallbackDict[key];
                if (text !== undefined) {
                    el.innerHTML = text;
                }
            }
        });
    }

    renderTable(data: APCalculatorDataModel): void {
        const table = document.getElementById("shop-table") as HTMLTableElement;
        const tbody = table.tBodies[0] ?? table.createTBody();
        const rowTemplate = document.getElementById("shop-row-template") as HTMLTemplateElement;

        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }

        data.shop.forEach((item, index) => {
            const rowElement = rowTemplate.content.firstElementChild!.cloneNode(true) as HTMLTableRowElement;
            rowElement.dataset.index = index.toString();

            const checkbox = rowElement.querySelector<HTMLInputElement>('[data-role="enable"]')!;
            checkbox.checked = item.enable;
            checkbox.dataset.index = index.toString();

            const quantityInput = rowElement.querySelector<HTMLInputElement>('[data-role="quantity"]')!;
            quantityInput.value = item.quantity.toString();
            quantityInput.dataset.index = index.toString();
            quantityInput.parentElement!.classList.toggle("is-solid", !item.enable);

            const priceInput = rowElement.querySelector<HTMLInputElement>('[data-role="price"]')!;
            priceInput.value = item.price.toString();
            priceInput.dataset.index = index.toString();
            priceInput.parentElement!.classList.toggle("is-solid", !item.enable);

            const deleteButton = rowElement.querySelector<HTMLButtonElement>('[data-role="delete"]')!;
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

    renderInputs(data: APCalculatorDataModel): void {
        (document.getElementById("current-tokens-value") as HTMLInputElement).value = data.currentTokens.toString();
        (document.getElementById("tokens-per-mission-value") as HTMLInputElement).value = data.tokensPerMission.toString();
        (document.getElementById("stamina-per-mission-value") as HTMLInputElement).value = data.staminaPerMission.toString();
    }

    renderResults(data: APCalculatorDataModel): void {
        (document.getElementById("completion-progress-value") as HTMLElement).textContent = data.completionProgress.toString() + "%";
        (document.getElementById("completion-progress-bar") as HTMLElement).style.setProperty("--value", data.completionProgress.toString());
        (document.getElementById("total-tokens-value") as HTMLElement).textContent = data.totalTokens.toString();
        (document.getElementById("remaining-tokens-value") as HTMLElement).textContent = data.remainingTokens.toString();
        (document.getElementById("remaining-missions-value") as HTMLElement).textContent = data.remainingMissions.toFixed(2).toString();
        (document.getElementById("remaining-stamina-value") as HTMLElement).textContent = data.remainingStamina.toString();
    }

    renderExport(data: APCalculatorDataModel): void {
        (document.getElementById("data-export-textarea") as HTMLInputElement).value = JSON.stringify(data);
        this.displayNotice();
    }

    displayNotice(title?: string, message?: string, negative?: boolean): void {
        const noticeMessageContainer = document.getElementById("notice-message-container") as HTMLElement;
        const noticeMessageBody = document.getElementById("notice-message-body") as HTMLElement;
        const noticeMessageTitle = document.getElementById("notice-message-title") as HTMLElement;
        const noticeMessageContent = document.getElementById("notice-message-content") as HTMLElement;

        if (title === undefined || message === undefined || negative === undefined) {
            noticeMessageContainer.classList.toggle("has-hidden", true)
            return;
        }

        noticeMessageContainer.classList.toggle("has-hidden", false);
        noticeMessageTitle.textContent = title;
        noticeMessageContent.textContent = message;
        noticeMessageBody.classList.toggle("is-negative", negative);
    }

    renderDataset(calcDataset: Record<string, APCalculatorDataModel>): void {
        const container = document.getElementById("saved-data-items-container") as HTMLElement;
        const template = document.getElementById("saved-data-item-template") as HTMLTemplateElement;

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        Object.keys(calcDataset).forEach(key => {
            const node = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
            const loadBtn = node.querySelector('[data-role="load"]') as HTMLButtonElement;
            loadBtn.textContent = decodeURIComponent(key);
            loadBtn.dataset.key = key;
            const deleteBtn = node.querySelector('[data-role="delete"]') as HTMLButtonElement;
            deleteBtn.dataset.key = key;

            loadBtn.addEventListener("click", (event) => {
                this.controller.onLoadSavedDataItem(event);
            });
            deleteBtn.addEventListener("click", (event) => {
                this.controller.onDeleteSavedDataItem(event);
            });
            container.appendChild(node);
        });
    }
}

class Controller {
    private model: Model;
    private view: View;

    constructor(model: Model) {
        this.model = model;
        this.view = new View(this);
    }

    init(): void {
        this.view.bindEvents();
        this.getLocalStorage();
        this.setLocalStorage();
        this.view.updateTheme(this.model.ui.theme);
        this.view.updateLanguage(this.model.ui.language, this.model.ui.i18n, this.model.ui.fallbackLanguage);
        this.view.renderTable(this.model.data);
        this.view.renderInputs(this.model.data);
        this.view.renderResults(this.model.data);
        this.view.renderExport(this.model.data);
        this.view.renderDataset(this.model.dataset);
    }

    private _defaultDatasetString: string = `
        {
            "1": {
                "shop": [
                { "quantity": 90, "price": 1, "enable": true },
                { "quantity": 95, "price": 3, "enable": true },
                { "quantity": 30, "price": 12, "enable": true },
                { "quantity": 12, "price": 60, "enable": true },
                { "quantity": 30, "price": 10, "enable": true },
                { "quantity": 18, "price": 30, "enable": true },
                { "quantity": 12, "price": 100, "enable": true },
                { "quantity": 2, "price": 300, "enable": true },
                { "quantity": 60, "price": 5, "enable": false },
                { "quantity": 30, "price": 15, "enable": false },
                { "quantity": 12, "price": 50, "enable": false },
                { "quantity": 6, "price": 200, "enable": false },
                { "quantity": 10, "price": 200, "enable": true },
                { "quantity": 10, "price": 200, "enable": true },
                { "quantity": 1, "price": 300, "enable": true },
                { "quantity": 1, "price": 2000, "enable": true }
                ],
                "currentTokens": 10000,
                "tokensPerMission": 66,
                "staminaPerMission": 20
            },
            "2": {
                "shop": [
                { "quantity": 180, "price": 1, "enable": true },
                { "quantity": 95, "price": 4, "enable": true },
                { "quantity": 30, "price": 15, "enable": true },
                { "quantity": 12, "price": 60, "enable": true },
                { "quantity": 50, "price": 5, "enable": true },
                { "quantity": 38, "price": 15, "enable": true },
                { "quantity": 25, "price": 50, "enable": true },
                { "quantity": 15, "price": 200, "enable": true },
                { "quantity": 60, "price": 5, "enable": false },
                { "quantity": 30, "price": 15, "enable": false },
                { "quantity": 12, "price": 50, "enable": false },
                { "quantity": 6, "price": 200, "enable": false },
                { "quantity": 10, "price": 200, "enable": true },
                { "quantity": 10, "price": 200, "enable": true },
                { "quantity": 1, "price": 300, "enable": true },
                { "quantity": 1, "price": 2000, "enable": true }
                ],
                "currentTokens": 10000,
                "tokensPerMission": 66,
                "staminaPerMission": 20
            }
        }
        `;

    getLocalStorage(): void {
        const ui_raw = localStorage.getItem("ui-state");
        const ui_parsed = ui_raw ? JSON.parse(ui_raw) : {};
        this.model.ui = UserInterfaceStateModel.fromJSON(ui_parsed);

        const localStorageData = localStorage.getItem("calc-data");
        let parsedData = null;
        try {
            parsedData = localStorageData ? JSON.parse(localStorageData) : null;
        } catch (e) {
            console.warn("Failed to parse calc-data, using default data", e);
        }
        this.model.data = parsedData ? APCalculatorDataModel.fromJSON(parsedData) : new APCalculatorDataModel();

        const datasetRaw = localStorage.getItem("calc-dataset");
        let datasetParsed: Record<string, any> = {};
        try {
            datasetParsed = datasetRaw ? JSON.parse(datasetRaw) : {};
        } catch (e) {
            console.warn("Failed to parse calc-dataset, using empty dataset", e);
        }
        // If dataset is empty, try to load from _defaultDatasetString
        if (!datasetRaw || Object.keys(datasetParsed).length === 0) {
            try {
                datasetParsed = JSON.parse(this._defaultDatasetString);
            } catch (e) {
                console.warn("Failed to parse _defaultDatasetString", e);
            }
        }
        this.model.dataset = {};
        for (const key in datasetParsed) {
            this.model.dataset[key] = APCalculatorDataModel.fromJSON(datasetParsed[key]);
        }
    }

    setLocalStorage(): void {
        localStorage.setItem("ui-state", JSON.stringify(this.model.ui.toJSON()));
        localStorage.setItem("calc-data", JSON.stringify(this.model.data.toJSON()));
        const datasetObj: Record<string, object> = {};
        for (const key in this.model.dataset) {
            datasetObj[key] = this.model.dataset[key].toJSON();
        }
        localStorage.setItem("calc-dataset", JSON.stringify(datasetObj));
    }

    onThemeToggle(event: Event): void {
        const themeSelector = event.currentTarget as HTMLFormElement;
        const checkedInput = themeSelector.querySelector("input[name='theme-selector']:checked") as HTMLInputElement;
        const theme = checkedInput?.value ?? "light";
        this.model.ui.theme = theme;
        this.view.updateTheme(this.model.ui.theme);
        this.setLocalStorage();
    }

    onLanguageChange(event: Event): void {
        const languageSelector = event.currentTarget as HTMLFormElement;
        this.model.ui.language = languageSelector.value;
        this.view.updateLanguage(this.model.ui.language, this.model.ui.i18n, this.model.ui.fallbackLanguage);
        this.setLocalStorage();
    }

    onEnableCheck(event: Event) {
        const element = event.currentTarget as HTMLInputElement;
        const index = Number(element.dataset.index);
        this.model.data.updateShopItem(index, { enable: element.checked });
        this.view.renderTable(this.model.data);
        this.view.renderResults(this.model.data);
        this.view.renderExport(this.model.data);
        this.setLocalStorage();
    }

    onQuantityChange(event: Event) {
        const element = event.currentTarget as HTMLInputElement;
        const index = Number(element.dataset.index);
        this.model.data.updateShopItem(index, { quantity: Number(element.value) });
        element.value = this.model.data.shop[index].quantity.toString();
        this.view.renderResults(this.model.data);
        this.view.renderExport(this.model.data);
        this.setLocalStorage();
    }

    onPriceChange(event: Event) {
        const element = event.currentTarget as HTMLInputElement;
        const index = Number(element.dataset.index);
        this.model.data.updateShopItem(index, { price: Number(element.value) });
        element.value = this.model.data.shop[index].price.toString();
        this.view.renderResults(this.model.data);
        this.view.renderExport(this.model.data);
        this.setLocalStorage();
    }

    onDeleteButtonClick(event: Event) {
        const element = event.currentTarget as HTMLButtonElement;
        const index = Number(element.dataset.index);

        const shop = this.model.data.shop;
        shop.splice(index, 1);
        this.model.data.shop = shop;

        this.view.renderTable(this.model.data);
        this.view.renderResults(this.model.data);
        this.view.renderExport(this.model.data);
        this.setLocalStorage();
    }

    onAddRowButtonClick(event: Event) {
        const shop = this.model.data.shop;
        shop.push(new ShopItem(0, 0, true));
        this.model.data.shop = shop;
        this.view.renderTable(this.model.data);
        this.view.renderResults(this.model.data);
        this.view.renderExport(this.model.data);
        this.setLocalStorage();
    }

    onCurrentTokensChange(event: Event) {
        const element = event.currentTarget as HTMLInputElement;
        this.model.data.currentTokens = Number(element.value);
        this.view.renderResults(this.model.data);
        this.view.renderExport(this.model.data);
        this.setLocalStorage();
    }

    onTokensPerMissionChange(event: Event) {
        const element = event.currentTarget as HTMLInputElement;
        this.model.data.tokensPerMission = Number(element.value);
        this.view.renderResults(this.model.data);
        this.view.renderExport(this.model.data);
        this.setLocalStorage();
    }

    onStaminaPerMissionChange(event: Event) {
        const element = event.currentTarget as HTMLInputElement;
        this.model.data.staminaPerMission = Number(element.value);
        this.view.renderResults(this.model.data);
        this.view.renderExport(this.model.data);
        this.setLocalStorage();
    }

    onDataExportTextareaChange(event: Event) {
        const element = event.currentTarget as HTMLInputElement;
        try {
            this.model.data = APCalculatorDataModel.fromJSON(JSON.parse(element.value));
            this.view.renderTable(this.model.data);
            this.view.renderInputs(this.model.data);
            this.view.renderResults(this.model.data);
            this.view.renderExport(this.model.data);
            this.setLocalStorage();
        } catch (e: any) {
            const message = e instanceof Error ? e.message : String(e);
            this.view.displayNotice("ERROR", message, true);
            return;
        }
    }

    onSaveDataButtonClick(event: Event): void {
        const name_input = document.getElementById("saved-data-item-name-input") as HTMLInputElement;
        let key = name_input.value.trim();
        key = encodeURIComponent(key.replace(/["\\]/g, '\\$&'));
        if (!key) return;
        this.model.dataset[key] = APCalculatorDataModel.fromJSON(this.model.data.toJSON());
        this.setLocalStorage();
        this.view.renderDataset(this.model.dataset);
        name_input.value = "";
    }

    onLoadSavedDataItem(event: Event): void {
        const name_input = document.getElementById("saved-data-item-name-input") as HTMLInputElement;
        const element = event.currentTarget as HTMLButtonElement;
        const key = element.dataset.key;
        if (!key) return;
        const savedData = this.model.dataset[key];
        if (!savedData) return;
        this.model.data = APCalculatorDataModel.fromJSON(savedData.toJSON());
        name_input.value = decodeURIComponent(key);
        this.view.renderTable(this.model.data);
        this.view.renderInputs(this.model.data);
        this.view.renderResults(this.model.data);
        this.view.renderExport(this.model.data);
        this.setLocalStorage();
    }

    onDeleteSavedDataItem(event: Event): void {
        const element = event.currentTarget as HTMLButtonElement;
        const key = element.dataset.key;
        if (!key) return;
        delete this.model.dataset[key];
        this.setLocalStorage();
        this.view.renderDataset(this.model.dataset);
    }

    onCopyExportButtonClick(event: Event): void {
        navigator.clipboard.writeText(JSON.stringify(this.model.data));
    }

    onResetDataClick(event: Event): void {
        localStorage.removeItem("calc-data");
        localStorage.removeItem("calc-dataset");
        this.getLocalStorage();
        this.view.renderTable(this.model.data);
        this.view.renderInputs(this.model.data);
        this.view.renderResults(this.model.data);
        this.view.renderExport(this.model.data);
        this.view.renderDataset(this.model.dataset);
        this.setLocalStorage();
    }

    onResetAllClick(event: Event): void {
        localStorage.removeItem("ui-state");
        this.getLocalStorage();
        this.view.updateTheme(this.model.ui.theme);
        this.view.updateLanguage(this.model.ui.language, this.model.ui.i18n, this.model.ui.fallbackLanguage);
        this.onResetDataClick(event);
    }
}

const model = new Model();
const control = new Controller(model);
control.init();
