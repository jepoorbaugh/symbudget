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
function createChargeTableRow(charge) {
    const row = document.createElement("tr");
    row.classList.add("charge-row-" + charge.id);
    row.appendChild(
        createChargeTableCell(charge.date.toLocaleDateString(), "date"),
    );
    row.appendChild(createChargeTableCell(charge.name, "name"));
    row.appendChild(createChargeTableCell(charge.amount, "amnt"));
    row.appendChild(
        createChargeTableCell(charge.endingBalance, "current-balance"),
    );
    return row;
}

const pastChargesTableBody = document.querySelector("#past-charges-tbody");
document.addEventListener("onChargeDataChanged", (event) => {
    pastChargesTableBody.innerHTML = "";
    const charges = ChargeData.get();
    charges.forEach((charge) => {
        pastChargesTableBody.appendChild(createChargeTableRow(charge));
    });
    Balance.value = charges[0].endingBalance;
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
        new Charge(
            new Date(),
            name.value,
            amnt.value,
            Balance.value - amnt.value,
        ),
    );
    name.value = "";
    amnt.value = "";
});

ChargeData.init();
Balance.init();
