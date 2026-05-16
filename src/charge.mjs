export class Charge {
    /**
     * @param {Date} date
     * @param {string} name
     * @param {number} amount
     */
    constructor(date, name, amount) {
        this.date = date;
        this.name = name;
        this.amount = amount;
        this.id = -1;
    }
}

export const ChargeData = {
    _CHARGE_DATA_KEY: "ChargeData",
    _DAILY_ALLOWANCE: 26.0,
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
        /**
         * @type Array<Charge>
         */
        let nextData =
            JSON.parse(localStorage.getItem(this._CHARGE_DATA_KEY)) ?? [];

        for (const charge of nextData) {
            charge.date = new Date(charge.date);
            charge.amount = Number.parseFloat(charge.amount);
        }
        nextData = [this._addDailyAllowance(), ...nextData];
        const addedItems = nextData.filter(
            (charge) => !this._currentData.includes(charge),
        );
        const removedItems = this._currentData.filter(
            (charge) => !nextData.includes(charge),
        );
        this._currentData = nextData;
        this._dispatchOnChangeEvent(addedItems, removedItems);
    },

    _addDailyAllowance() {
        const lastDate = this._currentData[0].date;
        const addedItems = [];
        for (let i = lastDate.getTime(); i < Date.now(); i += 86400000) {
            // i is in milliseconds so we can get the date at each missing day
            addedItems = [
                new Charge(
                    new Date(i),
                    "Daily allowance",
                    this._DAILY_ALLOWANCE,
                ),
                ,
                ...addedItems,
            ];
        }
    },

    get() {
        return this._currentData;
    },

    /**
     *
     * @param {Charge} charge
     */
    add(charge) {
        charge.id = this._currentData.length;
        this._currentData = [charge, ...this._currentData];
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
