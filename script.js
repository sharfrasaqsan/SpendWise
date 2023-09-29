document.addEventListener("DOMContentLoaded", function () {
  const expenseForm = document.getElementById("expense-form");
  const expenseList = document.getElementById("expenseList");
  const totalAmountSpan = document.getElementById("totalAmount");
  const categoryTotalsDiv = document.getElementById("categoryTotals");
  const newCategoryInput = document.getElementById("newCategory");
  const expenses = [];
  let categories = {};

  expenseForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const expenseName = document.getElementById("expenseName").value;
    const expenseAmount = parseFloat(
      document.getElementById("expenseAmount").value
    );
    const expenseCategory = getSelectedCategory();

    if (expenseName === "" || isNaN(expenseAmount) || !expenseCategory) {
      alert("Please fill in all fields and select a category.");
      return;
    }

    const expense = {
      name: expenseName,
      amount: expenseAmount,
      category: expenseCategory,
      date: new Date().toLocaleString(), // Add the current date and time
    };

    expenses.push(expense);

    updateCategoryTotals();
    renderExpenseList();
    expenseForm.reset();
  });

  function getSelectedCategory() {
    const selectedCategory = document.getElementById("expenseCategory").value;
    const newCategory = newCategoryInput.value.trim();

    if (newCategory !== "") {
      return newCategory;
    }

    if (selectedCategory !== "") {
      return selectedCategory;
    }

    return null;
  }

  function updateCategoryTotals() {
    categories = {};

    for (const expense of expenses) {
      if (categories[expense.category]) {
        categories[expense.category] += expense.amount;
      } else {
        categories[expense.category] = expense.amount;
      }
    }

    // Remove categories with a total of 0
    for (const category in categories) {
      if (categories[category] === 0) {
        delete categories[category];
      }
    }

    categoryTotalsDiv.innerHTML = "";
    for (const category in categories) {
      const categoryTotal = categories[category];
      const categoryTotalDiv = document.createElement("div");
      categoryTotalDiv.innerHTML = `<p>${category}: $${categoryTotal.toFixed(
        2
      )}</p>`;
      categoryTotalDiv.classList.add("category-total");
      categoryTotalsDiv.appendChild(categoryTotalDiv);
    }
  }

  function renderExpenseList() {
    expenseList.innerHTML = "";

    for (let i = 0; i < expenses.length; i++) {
      const expense = expenses[i];

      const newRow = document.createElement("tr");
      newRow.innerHTML = `
          <td>${expense.name}</td>
          <td>$${expense.amount.toFixed(2)}</td>
          <td>${expense.category}</td>
          <td>${new Date().toLocaleString()}</td>
          <td>
              <i class="fas fa-edit edit-icon"></i>
              <i class="fas fa-trash-alt delete-icon"></i>
          </td>
      `;

      expenseList.appendChild(newRow);
    }

    updateTotalAmount();
  }

  function updateTotalAmount() {
    const totalAmount = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    totalAmountSpan.textContent = `$${totalAmount.toFixed(2)}`;
  }

  expenseList.addEventListener("click", function (e) {
    if (e.target.classList.contains("edit-icon")) {
      const editIcon = e.target;
      const rowIndex = getIndex(editIcon);

      if (rowIndex !== -1) {
        editExpense(rowIndex);
      }
    } else if (e.target.classList.contains("delete-icon")) {
      const deleteIcon = e.target;
      const rowIndex = getIndex(deleteIcon);

      if (rowIndex !== -1) {
        deleteExpense(rowIndex);
      }
    }
  });

  function getIndex(element) {
    let index = -1;
    let currentElement = element.parentElement;

    while (currentElement !== null) {
      if (currentElement.tagName === "TR") {
        index = Array.from(currentElement.parentElement.children).indexOf(
          currentElement
        );
        break;
      }
      currentElement = currentElement.parentElement;
    }

    return index;
  }

  function editExpense(index) {
    const editedExpense = expenses[index];

    document.getElementById("expenseName").value = editedExpense.name;
    document.getElementById("expenseAmount").value = editedExpense.amount;

    const categorySelect = document.getElementById("expenseCategory");
    categorySelect.value = editedExpense.category;

    // Remove the edited expense from the expenses array
    expenses.splice(index, 1);

    // Re-render the expense list
    renderExpenseList();
  }

  function deleteExpense(index) {
    const confirmation = confirm(
      "Are you sure you want to delete this expense?"
    );

    if (confirmation) {
      const deletedExpense = expenses[index];

      // Update the sub-total amount for the deleted category
      categories[deletedExpense.category] -= deletedExpense.amount;

      // Remove the deleted expense from the expenses array
      expenses.splice(index, 1);

      // Re-render the expense list
      renderExpenseList();

      // Update the subtotals display
      updateCategoryTotals();

      // Update the total amount display
      updateTotalAmount();
    }
  }

  renderExpenseList();
});
