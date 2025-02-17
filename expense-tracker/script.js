document.addEventListener("DOMContentLoaded", () => {
    console.log("Page Loaded!");

    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const totalAmountElement = document.getElementById("total-amount");
    let totalAmount = 0;
    let editMode = false;
    let editId = null;

    // Loading "expenses" from local storage when the page loads
    loadExpenses();

    // Form Submission
    expenseForm.addEventListener("submit", (e) => {
        // e.preventDefault() prevents the default form submission behavior, which would normally reload the page.
        e.preventDefault();
        const expenseName = document.getElementById("expense-name").value;
        const expenseAmount = parseFloat(document.getElementById("expense-amount").value);
        const expenseDate = document.getElementById("expense-date").value;

        // Check if ex. (Mina true 2025-02-09) output
        if (expenseName && !isNaN(expenseAmount) && expenseDate) {
            console.log(expenseName, expenseAmount, expenseDate);
            const expense = {
                // Use existing ID if in edit mode
                id: editMode ? editId : new Date().getTime(),
                name: expenseName,
                amount: expenseAmount,
                date: expenseDate,
            };

            if (editMode) {
                updateExpense(expense);
            } else {
                addExpense(expense);
                saveExpenseToLocalStorage(expense);
                updateTotalAmount(expenseAmount);
            }

            expenseForm.reset();
            editMode = false;
            editId = null;

            expenseForm.querySelector("button").textContent = "Add Expense";
        } else {
            alert("Please fill out all fields correctly.")
        }
    });

    // Adding Expenses
    function addExpense(expense) {
        const expenseItem = document.createElement("div");
        expenseItem.classList.add("expense-item");
        expenseItem.setAttribute("data-id", expense.id)
        expenseItem.innerHTML = `<span>${expense.name} - $${expense.amount.toFixed(2)} (${expense.date})</span> <div>
        <button type="button" class="edit-btn">Edit</button>
        <button type="button" class="delete-btn">❌</button>
        </div>`;

        expenseList.appendChild(expenseItem);

        const deleteBtn = expenseItem.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", () => {
            expenseItem.remove();
            updateTotalAmount(-expense.amount);
            removeExpenseFromLocalStorage(expense.id);
        });

        const editBtn = expenseItem.querySelector(".edit-btn");
        editBtn.addEventListener("click", () => {
            // setEditMode() function is called, when Edit button is clicked
            setEditMode(expense);
        });
    }

    function updateExpense(updatedExpense) {
        const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
        const index = expenses.findIndex((expense) => expense.id === updatedExpense.id);

        if (index !== -1) {
            // Update the expense in the DOM
            const expenseItem = document.querySelector(`.expense-item[data-id="${updatedExpense.id}"]`);
            console.log(expenseItem);

            expenseItem.querySelector("span").textContent = `${updatedExpense.name} - $${updatedExpense.amount.toFixed(2)} (${updatedExpense.date})`;

            // Update the expense in local storage
            expenses[index] = updatedExpense;
            localStorage.setItem("expenses", JSON.stringify(expenses));

            // Recalculate the total amount
            totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
            totalAmountElement.textContent = `$${totalAmount.toFixed(2)}`;
        }
    }

    // Editing Expenses
    function setEditMode(expense) {
        editMode = true;
        editId = expense.id; // Specific expense id when edit button clicked
        //console.log(editId); // Ex. id  - 1739190937386

        // Populate the form with the expense data
        document.getElementById("expense-name").value = expense.name;
        document.getElementById("expense-amount").value = expense.amount;
        document.getElementById("expense-date").value = expense.date;

        // Change the button text to "Update Expense"
        expenseForm.querySelector("button").textContent = "Update Expense";
    }

    function updateTotalAmount(amount) {
        totalAmount += amount;
        totalAmountElement.textContent = `$${totalAmount.toFixed(2)}`
    }

    // Save expense to local storage
    function saveExpenseToLocalStorage(expense) {
        const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
        expenses.push(expense);
        localStorage.setItem("expenses", JSON.stringify(expenses));
    }

    // LoadExpenses() called as soon as the page loads to retrieve any
    // previously saved expenses from the browser's localStorage and display them.
    function loadExpenses() {
        const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
        expenses.map((expense) => {
            addExpense(expense);
            updateTotalAmount(expense.amount)
        });
    }

    // Remove expense from local storage
    function removeExpenseFromLocalStorage(id) {
        let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
        expenses = expenses.filter((expense) => expense.id !== id);
        localStorage.setItem("expenses", JSON.stringify(expenses));
    }
});