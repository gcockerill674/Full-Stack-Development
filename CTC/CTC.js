function addNumber() {
    // Retrieve the minimum, maximum, and input number
    const minimum = Number(document.getElementById('minimum').value);
    const maximum = Number(document.getElementById('maximum').value);
    const number = Number(document.getElementById('number').value);
    // Checks if the number array is valid and within the range and if number is, in fact, a number
    if (minimum >= maximum || isNaN(minimum) || isNaN(maximum) || isNaN(number)) {
        alert("Please enter valid numbers into the ranges.");
        return null;
    } else if (number < minimum || number > maximum) { // Checks if number is within the range
        alert("Please enter a number within the specified range.");
        return null;
    } else { // If the number is valid and within the range, it is 
            // added to the list and calls updateTendencies
        const list = document.getElementById('numberList');
        const listItem = document.createElement('li');
        listItem.textContent = number;
        list.appendChild(listItem);
        updateTendencies();
    }
}

function clearInputs() {
    // Clears all values on screen
    document.getElementById('minimum').value = '';
    document.getElementById('maximum').value = '';
    document.getElementById('number').value = '';
    document.getElementById('numberList').innerHTML = '';
    document.getElementById('mean').textContent = 'Mean: ';
    document.getElementById('median').textContent = 'Median: ';
    document.getElementById('mode').textContent = 'Mode: ';
}

function updateTendencies() {
    // Gets the list of numbers
    const listItems = document.getElementById('numberList').getElementsByTagName('li');
    // Converts the list of numbers into an array of numbers
    const numbers = Array.from(listItems).map(item => Number(item.textContent));
    // Calls the three functions to calculate
    const mean = calculateMean(numbers);
    const median = calculateMedian(numbers);
    const mode = calculateMode(numbers);
    // Updates Mean, Median, and Mode while also clearing the number input
    document.getElementById('mean').textContent = 'Mean: ' + mean;
    document.getElementById('median').textContent = 'Median: ' + median;
    document.getElementById('mode').textContent = 'Mode: ' + mode;
    document.getElementById('number').value = ''; // Clear the number input after adding

}

function calculateMean(numbers) {
    if (numbers.length === 0) return 0; // Returns zero if the array is empty
    // Reduce adds all the numbers together with an accumulator (acc) and the current 
    // Value (curr) starting from 0
    const sum = numbers.reduce((acc, curr) => acc + curr, 0); 
    // Returns the average of the numbers and rounds to the second decimal using toFixed(2)
    return (sum / numbers.length).toFixed(2);
}

function calculateMedian(numbers) {
    if (numbers.length === 0) return 0; // Returns zero if the array is empty
    // Sorts the number in ascending order and finds the middle index
    const sorted = numbers.slice().sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    // Returns the median value where if there is an odd number of values, 
    // it will return the middle value or else return the average of the two middle values
    return sorted.length % 2 === 0 ? ((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2) : sorted[mid].toFixed(2);
}

function calculateMode(numbers) {
    if (numbers.length === 0) return 0; // Returns zero if the array is empty
    // Creates a dictionary to store counts of each number
    const frequency = {};
    // Iterates through each number in the array
    numbers.forEach(n => {
        // Adds each number to the dictionary if it doesn't exist and 
        // increases the count by one
        frequency[n] = (frequency[n] || 0) + 1;
    });
    // uses Math.max to find the highest frequency and stores it in maxFreq 
    const maxFreq = Math.max(...Object.values(frequency));
    // Filters the dictionary to find all numbers that match the frequency and joins them with a comma
    return Object.keys(frequency)
        .filter(number => frequency[number] === maxFreq)
        .join(', ');
}