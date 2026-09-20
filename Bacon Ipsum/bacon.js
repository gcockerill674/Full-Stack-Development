async function getBaconipsum() {
  // first build the API call string by starting with the URL
  let apiString = "https://baconipsum.com/api/";
  // next add the parameters to the string using the drop down lists
  let theNewParagraphs = document.getElementById("newParagraphs").value;
  // determine whether the user wants "meat" or "all-meat"
  let theType = document.getElementById("type").value;
  // creates the API string with parameters
  apiString = apiString + "?type=" + theType + "&paras=" + theNewParagraphs;
  alert(apiString);  // show the API string

  // now make the API call to the web service using the string and store what is returned in response
  let response = await fetch(apiString);

  // finally, print the response in the various formats
  document.getElementById("myRawData").innerHTML = "";   // clear what was previously shown
  document.getElementById("myFormattedData").innerHTML = "";   // clear what was previously shown
  document.getElementById("myCaesarData").innerHTML = "";   // clear what was previously shown

  let jsonData = await response.json();  // read the response as JSON
  
  // stringify and print out the JSON object in the RawData section
  document.getElementById("myRawData").innerHTML = JSON.stringify(jsonData);
 
  // loop through the JSON object one paragraph at a time and print each in the FormattedData section
  for (let para in jsonData) {   
      document.getElementById("myFormattedData").innerHTML += "<p>" + jsonData[para] + "</p>";
    }
  
  // iterates through every paragraph in jsonData
  for (let para in jsonData) {
    // creates a alterable variable for the new caesar text and clears it on loops
      let caesarText = "";
        // iterates through every letter in a paragraph
        for (let i = 0; i < jsonData[para].length; i++) {
          // finds the letter at that index
          let char = jsonData[para].charAt(i);
          // checks if the character is either lowercase, uppercase, or not a letter
          if (char >= 'a' && char <= 'z') {
            // since JS assigns a number value to each letter, we can access that using charCodeAt
            // and shift the number as far as we need too
            caesarText += String.fromCharCode(((char.charCodeAt(0) - 97 + parseInt(document.getElementById("caesar").value)) % 26) + 97);
          } else if (char >= 'A' && char <= 'Z') {
            caesarText += String.fromCharCode(((char.charCodeAt(0) - 65 + parseInt(document.getElementById("caesar").value)) % 26) + 65);
          } else {
            caesarText += char;
          }
        }
      document.getElementById("myCaesarData").innerHTML += "<p>" + caesarText + "</p>";
    }

  return true;
}