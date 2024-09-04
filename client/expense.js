let transactions = [];
filteredTransactionsAfter = { "table": [] }
let data = []
let transactionsToDisplay = []
const endpoint = "http://localhost:8600/";
// const endpoint = "http://192.168.0.123:8600/";


const balanceDisplay = document.getElementById("balance");
const incomeDisplay = document.getElementById("income");
const expenseDisplay = document.getElementById("expense");
const transactionTable = document.getElementById("transaction-table");
const resetDataForm = document.getElementById("reset-form")
const filterForm = document.getElementById("filter-form");

function temp(data) {
    resetDataForm.addEventListener("click", function (event) {
        console.log("test")
        filterForm.reset();
        console.log("table", data.table)
        updateTransactionTable(data);
    })
    filterForm.addEventListener("submit", function (event) {
        event.preventDefault();
        console.log("called filter")
        console.log("table", data.table)
        // Get the form values
        const category = filterForm.elements["category"].value;
        const startDate = filterForm.elements["start-date"].value;
        const endDate = filterForm.elements["end-date"].value;
        const type = filterForm.elements["type"].value;
        const minAmount = parseFloat(filterForm.elements["min-amount"].value);
        const maxAmount = parseFloat(filterForm.elements["max-amount"].value);

        //Filter the transactions array by the form values and update the transactions table
        filteredTransactionsAfter.table = data["table"].filter(function (transaction) {
            if (category && transaction.category !== category) {
                return false;
            }
            if (type && transaction.type !== type) {
                return false;
            }
            if (startDate && transaction.date < startDate) {
                return false;
            }
            if (endDate && transaction.date > endDate) {
                return false;
            }
            if (!isNaN(minAmount) && transaction.amount < minAmount) {
                return false;
            }
            if (!isNaN(maxAmount) && transaction.amount > maxAmount) {
                return false;
            }
            return true;
        });

        updateTransactionTable(filteredTransactionsAfter);
    });
}

function updateTransactionTable(filteredTransactions) {
    // Use the filtered transactions array if provided, otherwise use the global transactions array
    transactionsToDisplay = filteredTransactions;
    
    // Clear the current table rows
    while (transactionTable.rows.length > 1) {
        transactionTable.deleteRow(1);
    }

    // Loop through the transactions array and add rows to the table
    let balance = 0;
    let income=0;
    let expense=0;
    transactionsToDisplay.table.forEach(function (transaction, index) {
        // Add a row to the table
        const row = transactionTable.insertRow(-1);
        row.insertCell(0).textContent = transaction.date;
        row.insertCell(1).textContent = transaction.description;
        row.insertCell(2).textContent = transaction.category;
        row.insertCell(3).textContent = transaction.type;
        row.insertCell(4).textContent = transaction.amount;


        
            if (transaction.amount > 0 && transaction.type=="income") {
                balance += parseFloat(transaction.amount);
            } else {
                balance -= parseFloat(transaction.amount);
            }
            if(transaction.type=="income")
            {
                income+=parseFloat(transaction.amount);
            }
            if(transaction.type=="expense")
            {
                expense+=parseFloat(transaction.amount);
            }

            
    });



    // Display the balance
    balanceDisplay.textContent = parseFloat(balance);
    incomeDisplay.textContent = parseFloat(income);
    expenseDisplay.textContent = parseFloat(expense);
    


}
(async function () {
    await fetch(endpoint+"data")
    .then((response) => response.json())
    .then((data) => {
        console.log(data)
            updateTransactionTable(data)
            temp(data);
        }
        );

})();

document.getElementById("submit").addEventListener("click", async (e) => {
    e.preventDefault();
    let formData = new FormData(document.querySelector("form"));
    let tempData = {};
    formData.forEach((value, lable) => {
        if (value && value != undefined) {
            tempData[lable] = value;
        }

    });
    if (!tempData.date || !tempData.description || !tempData.category || !tempData.type || !tempData.amount) {
        alert("Please fill in all fields");
        return;
    }
    tempData.time = new Date().toTimeString().slice(0, 8)
    
    console.log(tempData)
    await fetch(endpoint + "add", {
        method: "POST",
        body: JSON.stringify({
            data: tempData
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    }).then(() => {
        window.location.reload();
    });

    document.getElementById("add-transaction-form").reset();
});



function show(event) {
    let menu = event.target.id;
    if (menu == "addtnx") {
        document.querySelector(".add-transaction").style.display = "block"
        document.querySelector(".filter-transactions").style.display = "none"
    }
    else {
        document.querySelector(".add-transaction").style.display = "none"
        document.querySelector(".filter-transactions").style.display = "block"
    }
}
function hideAll() {
    document.querySelectorAll(`.frm`).forEach(ele=>{
        ele.style.display ="none";
    })
}


