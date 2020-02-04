document.addEventListener("DOMContentLoaded", function() {
  // CODE STARTS HERE

    /***** DOM ELEMENTS *****/
const newcalorieInstanceForm = document.getElementById("new-calorie-form");
const calorieInstanceList = document.getElementById("calories-list");
const progressBar = document.querySelector(".uk-progress");
const editCalorieForm = document.getElementById("edit-calorie-form");
const bmrCalculatorForm = document.getElementById("bmr-calculator")
const lowerBmrSpan = document.getElementById("lower-bmr-range");
const upperBmrSpam = document.getElementById("higher-bmr-range")

let calorieTotal = 0;
  
    /***** EVENT LISTENERS *****/
newcalorieInstanceForm.addEventListener("submit", handleCalorieFormSubmit);
// deleteButton listener is defined below in the renderOneCalorieInstance function
editCalorieForm.addEventListener("submit", handleCalorieEditFormSubmit);
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
  
    /***** RENDER FUNCTIONS *****/
function renderOneCalorieInstance(newCalorieInstance) {
  calorieInstanceLi = document.createElement("li");
  calorieInstanceLi.id = newCalorieInstance.id;
  calorieInstanceLi.className = "calories-list-item";
  calorieInstanceLi.innerHTML = `
  <div class="uk-grid">
    <div class="uk-width-1-6">
      <strong>${newCalorieInstance.calorie}</strong>
      <span>kcal</span>
    </div>
    <div class="uk-width-4-5">
      <em class="uk-text-meta">${newCalorieInstance.note}</em>
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
};
function renderAllCalorieInstances(calorieInstances) {
  calorieInstances.forEach( instance => renderOneCalorieInstance(instance) );
};
  
    /***** MISC. FUNCTIONS *****/
  
  
    /***** INITIAL RUNNER FUNCTIONS *****/
getCalorieInstancesFetch();
  
  // CODE ENDS HERE
  });