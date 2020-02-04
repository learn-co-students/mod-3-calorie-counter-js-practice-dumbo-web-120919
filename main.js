document.addEventListener("DOMContentLoaded", function() {
  // CODE STARTS HERE

    /***** DOM ELEMENTS *****/
const newcalorieInstanceForm = document.getElementById("new-calorie-form");
const calorieInstanceList = document.getElementById("calories-list");
const progressBar = document.querySelector(".uk-progress");
const editCalorieForm = document.getElementById("edit-calorie-form");
const editCalorieField = document.getElementById("edit-calories");
const editNotesField = document.getElementById("edit-notes");
const bmrCalculatorForm = document.getElementById("bmr-calculator")
const lowerBmrSpan = document.getElementById("lower-bmr-range");
const upperBmrSpam = document.getElementById("higher-bmr-range")

let calorieTotal = 0;
  
    /***** EVENT LISTENERS *****/
newcalorieInstanceForm.addEventListener("submit", handleCalorieFormSubmit);
// deleteButton listener is defined below in the renderOneCalorieInstance function
bmrCalculatorForm.addEventListener("submit", handleBmrCalculatorFormSubmit)

    /***** EVENT HANDLERS *****/
function handleCalorieFormSubmit(event) {
  event.preventDefault();

  let newCalorieAmount = event.target["calories"].value;
  let newCalorieNotes = event.target["notes"].value;
  let newCalorieObj = {
    calorie: newCalorieAmount,
    note: newCalorieNotes
  }
  postNewCalorieFetch(newCalorieObj);
} ; 

function handleDeleteButton(event) {
  targetCalorieLi = event.target.closest("li");
  deleteCalorieFetch(targetCalorieLi);
};

function handleCalorieEditFormSubmit(event) {
  event.preventDefault();
  
  let newCalories = event.target["edit-calories"].value;
  let newNotes = event.target["edit-notes"].value;

  calorieId = targetCalorieInstanceId;

  updateCalorieObj = {
    calorie: newCalories,
    note: newNotes
  };

  patchCalorieFetch(updateCalorieObj);
};

function handleBmrCalculatorFormSubmit(event) {
  event.preventDefault();

  bmrWeight = event.target.weight.value;
  bmrHeight = event.target.height.value;
  bmrAge = event.target.age.value;

  let lowerRangeBMR = Math.round(655 + (4.35 * bmrWeight) + (4.7 * bmrHeight) - (4.7 * bmrAge));
  let upperRangeBMR = Math.round(66 + (6.23 * bmrWeight) + (12.7 * bmrHeight) - (6.8 * bmrAge));

  lowerBmrSpan.textContent = lowerRangeBMR;
  upperBmrSpam.textContent = upperRangeBMR;
};

function handleEditButton(event) {
  targetCalorieLi = event.target.closest("li");
  targetCalorieInstanceId = targetCalorieLi.id;

  editCalorieField.placeholder = document.getElementById(`${targetCalorieInstanceId}-calories`).textContent;
  editNotesField.placeholder = document.getElementById(`${targetCalorieInstanceId}-notes`).textContent;

  editCalorieForm.addEventListener("submit", handleCalorieEditFormSubmit);

};
  
    /***** FETCHES *****/
  // GET fetch of all instances on page-load
const getCalorieInstancesFetch = function() {
  fetch('http://localhost:3000/api/v1/calorie_entries')
  .then( response => response.json() )
  .then( calorieInstances => renderAllCalorieInstances(calorieInstances) )
};

  // POST fetch to create and render new calorie instance
const postNewCalorieFetch = function(newCalorieObj) {
  fetch('http://localhost:3000/api/v1/calorie_entries', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(newCalorieObj)
  })
  .then( response => response.json() )
  .then( newCalorieInstance => renderOneCalorieInstance(newCalorieInstance) )
};

  // DELETE fetch to delete a calorie instance
const deleteCalorieFetch = function(calorieInstanceLi) {
  fetch(`http://localhost:3000/api/v1/calorie_entries/${calorieInstanceLi.id}`, {
    method: "DELETE"
  })
  .then( () => calorieInstanceLi.remove() )
};

// PATCH fetch to update a calorie object
const patchCalorieFetch = function(updateCalorieObj) {
  fetch(`http://localhost:3000/api/v1/calorie_entries/${calorieId}`, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(updateCalorieObj)
  })
  .then( response => response.json() )
  .then( calorieInstance => renderUpdatedCalorieInstance(calorieInstance) )
}
  
    /***** RENDER FUNCTIONS *****/
function renderOneCalorieInstance(newCalorieInstance) {
  calorieInstanceLi = document.createElement("li");
  calorieInstanceLi.id = newCalorieInstance.id;
  calorieInstanceLi.className = "calories-list-item";
  calorieInstanceLi.innerHTML = `
  <div class="uk-grid">
    <div class="uk-width-1-6">
      <strong id="${newCalorieInstance.id}-calories">${newCalorieInstance.calorie}</strong>
      <span>kcal</span>
    </div>
    <div class="uk-width-4-5">
      <em id="${newCalorieInstance.id}-notes" class="uk-text-meta">${newCalorieInstance.note}</em>
    </div>
  </div>
  <div class="list-item-menu">
    <a class="edit-button" uk-toggle="target: #edit-form-container" uk-icon="icon: pencil"></a>
    <a class="delete-button" uk-icon="icon: trash"></a>
  </div>`

  calorieTotal = calorieTotal + newCalorieInstance.calorie
  progressBar.value = calorieTotal;
  calorieInstanceList.prepend(calorieInstanceLi);

  let deleteButton = document.querySelector(".delete-button");
  deleteButton.addEventListener("click", handleDeleteButton);

  let editButton = document.querySelector(".edit-button")
  editButton.addEventListener("click", handleEditButton)
};
function renderAllCalorieInstances(calorieInstances) {
  calorieInstances.forEach( instance => renderOneCalorieInstance(instance) );
};

function renderUpdatedCalorieInstance(calorieInstance) {
  calorieInstanceLiToUpdate = document.getElementById(calorieInstance.id);
  calorieInstanceLiToUpdate.innerHTML = `
  <div class="uk-grid">
    <div class="uk-width-1-6">
      <strong id="${calorieInstance.id}-calories">${calorieInstance.calorie}</strong>
      <span>kcal</span>
    </div>
    <div class="uk-width-4-5">
      <em id="${calorieInstance.id}-notes" class="uk-text-meta">${calorieInstance.note}</em>
    </div>
  </div>
  <div class="list-item-menu">
    <a class="edit-button" uk-toggle="target: #edit-form-container" uk-icon="icon: pencil"></a>
    <a class="delete-button" uk-icon="icon: trash"></a>
  </div>`
}

    /***** MISC. FUNCTIONS *****/
  
  
    /***** INITIAL RUNNER FUNCTIONS *****/
getCalorieInstancesFetch();
  
  // CODE ENDS HERE
  });