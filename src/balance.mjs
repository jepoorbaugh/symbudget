import { Charge, ChargeData } from "./charge.mjs";

export const Balance = {
    _value: 0, // We need to define it, but the initial value is overwritten in init!

    get value() {
        return this._value;
    },

    set value(v) {
        this._value = v;
        this._dispatchOnChangeEvent();
    },

    init() {
        document.addEventListener("onChargeDataChanged", () => {
            this.value = ChargeData.get().reduce(
                (acc, charge) => acc - charge.amount,
                0,
            );
        });
    },

    _dispatchOnChangeEvent() {
        document.dispatchEvent(new CustomEvent("onBalanceChanged"));
    },
};
