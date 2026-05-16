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
            console.log("Updating balance");
            this.value = ChargeData.get().reduce(
                (acc, charge) => (acc ?? 0) - charge.amount,
                0,
            );
            console.log(this.value);
        });
    },

    _dispatchOnChangeEvent() {
        document.dispatchEvent(new CustomEvent("onBalanceChanged"));
    },
};
