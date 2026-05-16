export const Balance = {
    _value: 0, // We need to define it, but the initial value is overwritten in init!
    _BALANCE_LOCALSTORAGE_KEY: "balance.value",

    get value() {
        return this._value;
    },

    set value(v) {
        this._value = v;
        this._dispatchOnChangeEvent();
    },

    _setLocalStorage(val) {
        localStorage.setItem(this._BALANCE_LOCALSTORAGE_KEY, val);
    },

    init() {
        document.addEventListener("onBalanceChanged", () => {
            this._setLocalStorage(this._value);
        });

        this.value = Number.parseFloat(
            localStorage.getItem(this._BALANCE_LOCALSTORAGE_KEY) ?? 0,
        );
        this._setLocalStorage(this.value);
    },

    _dispatchOnChangeEvent() {
        document.dispatchEvent(new CustomEvent("onBalanceChanged"));
    },
};
