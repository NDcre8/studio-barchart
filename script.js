const ctx = document.getElementById('myChart').getContext('2d');
let myChart;

// Define the hourly rate for the designers
const hourlyRate = 40; // Updated hourly rate

// Initialize data variables to persist across updates
let currentDataPoints = [0, 0, 0, 0];

// Fetch data based on the current budget
function fetchData() {
    const budgetValue = parseInt(document.getElementById('budget').value);
    const totalHours = budgetValue / hourlyRate; // Calculate total hours based on budget
    const totalDays = Math.min(Math.ceil(totalHours / 8), 35); // Convert hours to days, max 35 days

    // Update the total days display
    document.getElementById('daysValue').textContent = totalDays; // Update the dynamic text

    // Calculate new data relative to the current state
    currentDataPoints[0] = totalDays * 0.30; // 30% for Concept
    currentDataPoints[1] = totalDays * 0.30; // 30% for Design
    currentDataPoints[2] = totalDays * 0.15; // 15% for Document Setup
    currentDataPoints[3] = totalDays * 0.25; // 25% for Print/Production

    return currentDataPoints;
}

// Create the chart using the provided data
function createChart(data) {
    const labels = ['Concept', 'Design', 'Document Setup', 'Print/Production'];

    // Destroy existing chart instance if present
    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Studio'], // Only Studio
            datasets: [
                {
                    label: labels[0], // Concept
                    data: [data[0]], // Data for Concept
                    backgroundColor: '#B4E2A5', // Color for Concept
                },
                {
                    label: labels[1], // Design
                    data: [data[1]], // Data for Design
                    backgroundColor: '#009159', // Color for Design
                },
                {
                    label: labels[2], // Document Setup
                    data: [data[2]], // Data for Document Setup
                    backgroundColor: '#004733', // Color for Document Setup
                },
                {
                    label: labels[3], // Print/Production
                    data: [data[3]], // Data for Print/Production
                    backgroundColor: '#92D400', // Color for Print/Production
                },
            ],
        },
        options: {
            indexAxis: 'y',
            layout: {
                padding: {
                    top: 0,
                    left: 10,
                    right: 10,
                    bottom: 10
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 35,
                    ticks: {
                        stepSize: 5
                    },
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Time (days)'
                    },
                },
                y: {
                    stacked: true,
                    title: {
                        display: true,
                        text: ''
                    },
                },
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: '#505050'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            const datasetLabel = tooltipItem.dataset.label || '';
                            const value = tooltipItem.parsed.x; // Get the value for the x-axis
                            return `${datasetLabel}: ${value.toFixed(2)} Days`; // Append "Days"
                        }
                    }
                }
            }
        }
    });
}

// Update the displayed budget value
function updateBudgetValue() {
    const budgetValue = document.getElementById('budget').value;
    document.getElementById('budgetValue').textContent = `£${budgetValue}`;
}

// Update the slider background color
function updateSliderBackground() {
    const rangeInput = document.getElementById('budget');
    const max = rangeInput.max;
    const min = rangeInput.min;
    const value = rangeInput.value;
    const percentage = (value - min) / (max - min) * 100; // Calculate percentage

    // Update background gradient
    rangeInput.style.background = `linear-gradient(to right, #287155 ${percentage}%, #505050 ${percentage}%)`; // Green for filled part, gray for unfilled part
}

// Update the chart when the slider value changes
function updateChart() {
    updateBudgetValue();
    const data = fetchData();
    createChart(data);
    updateSliderBackground(); // Call to update slider background
}

// Initialize the chart and budget value on page load
updateBudgetValue();
updateChart();
updateSliderBackground(); // Initial slider background update
