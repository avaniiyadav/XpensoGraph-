// Retrieve stored expenses from localStorage or initialize an empty array
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
renderExpenses(); // Initial rendering of expenses

// Function to add a new expense
function addExpense() {
    let desc = document.getElementById('desc').value; // Get description input
    let amount = document.getElementById('amount').value; // Get amount input
    let category = document.getElementById('category').value; // Get category input
    let date = new Date().toLocaleDateString(); // Get current date

    if (desc && amount) { // Ensure description and amount are not empty
        let expense = { desc, amount: Number(amount), category, date }; // Create expense object
        expenses.push(expense); // Add expense to the array
        localStorage.setItem('expenses', JSON.stringify(expenses)); // Store updated expenses in localStorage
        renderExpenses(); // Update the expense list UI
    }
}

// Function to render expenses in the UI
function renderExpenses() {
    let expenseList = document.getElementById('expense-list'); // Get the expense list table body
    expenseList.innerHTML = ''; // Clear previous entries
    let total = 0; // Initialize total amount
    
    expenses.forEach((exp, index) => {
        total += exp.amount; // Calculate total expenses
        expenseList.innerHTML += `
            <tr>
                <td>${exp.desc}</td>
                <td>₹${exp.amount}</td>
                <td>${exp.category}</td>
                <td>${exp.date}</td>
                <td><button onclick="deleteExpense(${index})">Delete</button></td>
            </tr>
        `; // Append expense details to table
    });

    document.getElementById('total').innerText = total; // Display total expenses
    updateCharts(); // Update charts based on expenses
}

// Function to delete an expense
function deleteExpense(index) {
    expenses.splice(index, 1); // Remove expense at the specified index
    localStorage.setItem('expenses', JSON.stringify(expenses)); // Update localStorage
    renderExpenses(); // Refresh UI
}

function updateCharts() {
    let categories = {}; // Object to store category-wise expenses
    let historicalData = {}; // Object to store daily expenses
    
    expenses.forEach(exp => {
        categories[exp.category] = (categories[exp.category] || 0) + exp.amount; // Group by category
        historicalData[exp.date] = (historicalData[exp.date] || 0) + exp.amount; // Group by date
    });

    let barCtx = document.getElementById('barChart').getContext('2d'); // Get bar chart context
    let lineCtx = document.getElementById('lineChart').getContext('2d'); // Get line chart context

    // Destroy existing charts before creating new ones to avoid duplication
    if (window.barChartInstance) window.barChartInstance.destroy();
    if (window.lineChartInstance) window.lineChartInstance.destroy();

    // Bar Chart (Category-wise Expenses)
    window.barChartInstance = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: Object.keys(categories), // Category names
            datasets: [{
                label: 'Category-wise Expenses',
                data: Object.values(categories), // Expense amounts per category
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 2,
                borderRadius: 8, // Rounded corners for bars
                hoverBackgroundColor: 'rgba(0, 0, 0, 0.2)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 14,
                            family: 'Montserrat',
                            weight: 'bold'
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 14,
                            family: 'Montserrat'
                        },
                        color: '#333'
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 14,
                            family: 'Montserrat'
                        },
                        color: '#333'
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeInOutBounce'
            }
        }
    });

    // Line Chart (Daily Expenses Trend)
    window.lineChartInstance = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: Object.keys(historicalData), // Dates
            datasets: [{
                label: 'Daily Expenses',
                data: Object.values(historicalData), // Expense amounts per day
                borderColor: '#66bfbf',
                backgroundColor: 'rgba(0, 0, 255, 0.1)',
                fill: true, // Fill under the line
                tension: 0.4, // Smooth curve instead of sharp lines
                borderWidth: 3,
                pointBackgroundColor: 'white',
                pointBorderColor: '#66bfbf',
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 14,
                            family: 'Montserrat',
                            weight: 'bold'
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 14,
                            family: 'Montserrat'
                        },
                        color: '#333'
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 14,
                            family: 'Montserrat'
                        },
                        color: '#333'
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeInOutExpo'
            }
        }
    });
}

