document.addEventListener("DOMContentLoaded", function () {
  const expenseForm = document.getElementById("expense-form");
  const expenseList = document.getElementById("expenseList");
  const expenseCategorySelect = document.getElementById("expenseCategory");
  const totalAmountSpan = document.getElementById("totalAmount");
  const categoryTotalsDiv = document.getElementById("categoryTotals");
  const newCategoryInput = document.getElementById("newCategory");

  const expenses = [];

  expenseForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const expenseName = document.getElementById("expenseName").value;
    const expenseAmount = parseFloat(
      document.getElementById("expenseAmount").value
    );
    const selectedCategory = expenseCategorySelect.value;
    const newCategory = newCategoryInput.value;

    if (
      expenseName === "" ||
      isNaN(expenseAmount) ||
      (selectedCategory === "" && newCategory === "")
    ) {
      alert("Please fill in all fields and select a category.");
      return;
    }

    const expenseCategory = newCategory || selectedCategory;

    const expense = {
      name: expenseName,
      amount: expenseAmount,
      category: expenseCategory,
    };

    expenses.push(expense);

    const totalAmount = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    totalAmountSpan.textContent = `$${totalAmount.toFixed(2)}`;

    updateCategoryTotals(expenses);

    expenseForm.reset();

    const newRow = document.createElement("tr");
    newRow.innerHTML = `
          <td>${expense.name}</td>
          <td>$${expense.amount.toFixed(2)}</td>
          <td>${expense.category}</td>
          <td>
              <i class="fas fa-edit edit-icon"></i>
              <i class="fas fa-trash-alt delete-icon"></i>
          </td>
      `;
    expenseList.appendChild(newRow);
  });

  expenseList.addEventListener("click", function (e) {
    if (e.target.classList.contains("edit-icon")) {
      editExpense(e.target);
    } else if (e.target.classList.contains("delete-icon")) {
      deleteExpense(e.target);
    }
  });

  function editExpense(icon) {
    const row = icon.closest("tr");
    const cells = row.getElementsByTagName("td");
    const expenseName = cells[0].textContent;

    // Find the index of the original expense in the expenses array
    const expenseIndex = expenses.findIndex(
      (expense) => expense.name === expenseName
    );

    if (expenseIndex !== -1) {
      // Get the original expense
      const originalExpense = expenses[expenseIndex];

      // Update the form fields with the original expense details
      document.getElementById("expenseName").value = originalExpense.name;
      document.getElementById("expenseAmount").value = originalExpense.amount;
      document.getElementById("expenseCategory").value =
        originalExpense.category;

      // Remove the row from the table
      row.remove();
    }
  }

  function deleteExpense(icon) {
    const confirmation = confirm(
      "Are you sure you want to delete this expense?"
    );

    if (confirmation) {
      const row = icon.closest("tr");
      const cells = row.getElementsByTagName("td");
      const expenseName = cells[0].textContent;
      const expenseAmount = parseFloat(cells[1].textContent.replace("$", ""));
      const expenseCategory = cells[2].textContent;

      const expenseIndex = expenses.findIndex(
        (expense) => expense.name === expenseName
      );
      if (expenseIndex !== -1) {
        expenses.splice(expenseIndex, 1);
      }

      const totalAmount = expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );
      totalAmountSpan.textContent = `$${totalAmount.toFixed(2)}`;

      updateCategoryTotals(expenses);

      row.remove();
    }
  }

  function updateCategoryTotals(expenses) {
    const categories = {};

    for (const expense of expenses) {
      if (categories[expense.category]) {
        categories[expense.category] += expense.amount;
      } else {
        categories[expense.category] = expense.amount;
      }
    }

    categoryTotalsDiv.innerHTML = "";
    for (const category in categories) {
      const categoryTotal = categories[category];
      const categoryTotalDiv = document.createElement("div");
      categoryTotalDiv.innerHTML = `<p>${category}: $${categoryTotal.toFixed(
        2
      )}</p>`;
      categoryTotalsDiv.appendChild(categoryTotalDiv);
    }
  }
});
