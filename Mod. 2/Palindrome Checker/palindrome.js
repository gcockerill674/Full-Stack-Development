function checkPalindrome(string, method) {
    switch (method) {
        case "method_one":
            displayResults(string, method, checkCaseSensitive(string));
            break;
        case "method_two":
            displayResults(string, method, checkNonCaseSensitive(string));
            break;
        case "method_three":
            displayResults(string, method, checkPointer(string));
            break;
        case "method_four":
            displayResults(string, method, checkOneLiner(string));
            break;
    }
}

function checkCaseSensitive(string) {

    for (let i = 0; i < string.length / 2; i++) {
        if (string[i] !== string[string.length - 1 - i]) {
            return false;
        }
    }
    return true;
}

function checkNonCaseSensitive(string) {
    string = string.toLowerCase();

    for (let i = 0; i < string.length / 2; i++) {
        if (string[i] !== string[string.length - 1 - i]) {
            return false;
        }
    }
    return true;
}

function checkPointer(string) {
    let left = 0;
    let right = string.length - 1;

    while (left < right) {
        if (string[left] !== string[right]) {
            return false;
        }

        left++;
        right--;
    }

    return true;
}

function checkOneLiner(string) {
    return string === string.split('').reverse().join('');
}

function displayResults(string, method, check) {
    const resultLists = {
        method_one: "caseSensitive",
        method_two: "nonCaseSensitive",
        method_three: "stringReverse",
        method_four: "oneLiner"
    };
    let list = document.getElementById(resultLists[method]);
    let listItem = document.createElement('li');
    listItem.textContent = string + ", " + check;
    list.appendChild(listItem);
}

function clearInputs() {
    document.getElementById("string").value = "";
    document.getElementById("caseSensitive").innerHTML = "";
    document.getElementById("nonCaseSensitive").innerHTML = "";
    document.getElementById("stringReverse").innerHTML = "";
    document.getElementById("oneLiner").innerHTML = "";
}