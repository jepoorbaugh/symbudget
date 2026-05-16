export class Charge {
    /**
     * @param {Date} date
     * @param {string} name
     * @param {number} amount
     */
    constructor(date, name, amount, endingBalance) {
        this.date = date;
        this.name = name;
        this.amount = amount;
        this.endingBalance = endingBalance;
        this.id = -1;
    }
}

export const ChargeData = {
    _CHARGE_DATA_KEY: "ChargeData",
    /**
     * @type Array<Charge>
     */
    _currentData: [],

    init() {
        ChargeData.refresh();
        document.addEventListener("onChargeDataChanged", () => {
            console.log("Saving Current Data");
            localStorage.setItem(
                this._CHARGE_DATA_KEY,
                JSON.stringify(this._currentData),
            );
        });
    },

    /**
     *
     * @param {Array<Charge>} newCharges
     * @param {Array<Charge>} removedCharges
     */
    _dispatchOnChangeEvent(newCharges, removedCharges) {
        const event = new CustomEvent("onChargeDataChanged", {
            detail: {
                added: newCharges,
                removed: removedCharges,
            },
        });
        document.dispatchEvent(event);
    },

    refresh() {
        let nextData = [];
        try {
            nextData =
                JSON.parse(localStorage.getItem(this._CHARGE_DATA_KEY)) ?? [];
            for (const charge of nextData) {
                charge.date = new Date(charge.date);
            }
        } catch (e) {
            console.log("Error refreshing!", e);
        }
        const addedItems = nextData.filter(
            (charge) => !this._currentData.includes(charge),
        );
        const removedItems = this._currentData.filter(
            (charge) => !nextData.includes(charge),
        );
        this._currentData = nextData;
        this._dispatchOnChangeEvent(addedItems, removedItems);
    },

    get() {
        return this._currentData;
    },

    add(charge) {
        charge.id = this._currentData.length;
        this._currentData = [charge, ...this._currentData];
        console.log(this._currentData, charge);
        this._dispatchOnChangeEvent([charge], []);
    },

    /**
     *
     * @param {Charge} charge
     */
    remove(charge) {
        this._currentData = this._currentData.filter((c) => c.id != charge.id);
        this._dispatchOnChangeEvent([], [charge]);
    },
};
