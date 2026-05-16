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
    _DAILY_ALLOWANCE: -26.0,
    /**
     * @type Array<Charge>
     */
    _currentData: [],

    init() {
        document.addEventListener("onChargeDataChanged", () => {
            console.log("Saving Current Data");
            localStorage.setItem(
                this._CHARGE_DATA_KEY,
                JSON.stringify(this._currentData),
            );
        });
        ChargeData.refresh();
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
        nextData = [...this._addDailyAllowance(nextData), ...nextData];
        const addedItems = nextData.filter(
            (charge) => !this._currentData.includes(charge),
        );
        const removedItems = this._currentData.filter(
            (charge) => !nextData.includes(charge),
        );
        console.log(nextData);
        this._currentData = nextData;
        this._dispatchOnChangeEvent(addedItems, removedItems);
    },

    _addDailyAllowance(currentData) {
        console.log("Adding daily allowance");
        let addedItems = [];
        if (currentData[0]) {
            console.log("Current data has existing data (", currentData, ")");
            const lastDate = currentData[0].date;
            const daysSinceLast = Math.floor(
                (Date.now() - lastDate) / 86400000,
            );
            console.log(
                "Last date: ",
                lastDate,
                ", days since last: ",
                daysSinceLast,
            );
            for (let i = daysSinceLast - 1; i >= 0; i--) {
                console.log(i);
                addedItems = [
                    new Charge(
                        new Date(Date.now() - i * 86400000),
                        "Daily allowance",
                        this._DAILY_ALLOWANCE,
                    ),
                    ...addedItems,
                ];
            }
        } else {
            addedItems = [
                new Charge(
                    new Date(),
                    "Daily allowance",
                    this._DAILY_ALLOWANCE,
                ),
            ];
        }
        return addedItems;
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
