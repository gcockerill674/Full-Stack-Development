// Dog List API client-side JavaScript
const list = document.querySelector('#dog-list');
const form = document.querySelector('#add-dog-form');
const message = document.querySelector('#message');
const apiUrl = 'http://localhost:5000/api/population';

// Displays a message in the message area. 
// The variant parameter can be used to specify the type of message 
// (e.g., 'danger', 'success', etc.) for styling purposes.
function showMessage(text, variant = 'danger') {
  message.className = `alert alert-${variant} py-2 mb-3`;
  message.textContent = text;
}

// Fetch wrapper that throws an error if the response is not ok.
async function request(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const details = await response.text();
    throw new Error(details || `Request failed (${response.status})`);
  }
  return response.json();
}

function renderDogs(dogs) {
  // Empties the list and populates it with the provided dog data. 
  // Each dog is displayed in a row with its name, breed, and age, 
  // along with a delete button for removing the dog from the list.
  list.replaceChildren();
  dogs.forEach((dog) => {
    const row = list.insertRow();
    [dog.name, dog.breed, dog.age].forEach((value) => {
      row.insertCell().textContent = value;
    });
    
    // adds a delete button to each row
    const actionCell = row.insertCell();
    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-danger btn-sm';
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('aria-label', `Delete ${dog.name}`);
    deleteButton.addEventListener('click', () => deleteDog(dog.id));
    actionCell.append(deleteButton);
  });
}

// Loads the list of dogs from the API and renders them in the table.
async function loadDogs() {
  try {
    renderDogs(await request(apiUrl));
    message.classList.add('d-none');
  } catch (error) {
    showMessage(`Could not load dogs: ${error.message}. Start dogserver.js and open the page from localhost or 127.0.0.1.`);
  }
}

// Deletes a dog by ID and reloads the list of dogs.
async function deleteDog(id) {
  try {
    await request(`${apiUrl}/${id}`, { method: 'DELETE' });
    await loadDogs();
  } catch (error) {
    showMessage(`Could not delete dog: ${error.message}`);
  }
}

// Handles the form submission for adding a new dog.
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const values = new FormData(form);

  // Sends a POST request to the API to add a new dog with the provided name, breed, and age.
  try {
    await request(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: values.get('name'),
        breed: values.get('breed'),
        age: Number(values.get('age'))
      })
    });
    form.reset();
    await loadDogs();
    showMessage('Dog added.', 'success');
  } catch (error) {
    showMessage(`Could not add dog: ${error.message}`);
  }
});

// Initial load of the dog list when the page is first opened.
loadDogs();
