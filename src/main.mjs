"use strict";

import { Charge, ChargeData } from "./charge.mjs";
import { Balance } from "./balance.mjs";

function createChargeTableCell(data, className) {
    const cell = document.createElement("td");
    cell.innerText = data;
    cell.classList.add("charge-table-" + className);
    return cell;
}

/**
 * @param {Charge} charge
 */
function createChargeTableRow(charge, currBalance) {
    const row = document.createElement("tr");
    row.classList.add("charge-row-" + charge.id);
    row.appendChild(
        createChargeTableCell(charge.date.toLocaleDateString(), "date"),
    );
    row.appendChild(createChargeTableCell(charge.name, "name"));
    row.appendChild(createChargeTableCell(charge.amount, "amnt"));
    row.appendChild(createChargeTableCell(currBalance, "current-balance"));
    return row;
}

const pastChargesTableBody = document.querySelector("#past-charges-tbody");
document.addEventListener("onBalanceChanged", (event) => {
    pastChargesTableBody.innerHTML = "";
    const charges = ChargeData.get();
    let balOverTime = Balance.value;
    console.log("Creating charge array: Starting balance = ", balOverTime);
    charges.forEach((charge) => {
        pastChargesTableBody.appendChild(
            createChargeTableRow(charge, balOverTime),
        );
        balOverTime += charge.amount;
        console.log(
            "Created row for ",
            charge,
            ", next balance = ",
            balOverTime,
        );
    });
});

const balanceSpan = document.querySelector("#balance");
document.addEventListener("onBalanceChanged", () => {
    balanceSpan.innerText = Balance.value.toString();
});

document.querySelector("#charge-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.querySelector("#charge-name");
    const amnt = document.querySelector("#charge-amt");
    ChargeData.add(
        new Charge(new Date(), name.value, Number.parseFloat(amnt.value)),
    );
    name.value = "";
    amnt.value = "";
});

Balance.init();
ChargeData.init();
