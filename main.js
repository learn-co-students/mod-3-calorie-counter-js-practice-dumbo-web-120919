// your code here, it may be worth it to ensure this file only runs AFTER the dom has loaded.

// global variable for calorie counter
let currCalValue = 0

/*** DOM Elements ***/
const calorieUl = document.querySelector("#calories-list")
const calorieForm = document.querySelector("#new-calorie-form")
const progressTag = document.querySelector(".uk-progress")

/*** Initial Fetch ***/
// render li.calories-list-item elements with fetch response from backend API
fetch("http://localhost:3000/api/v1/calorie_entries")
.then(r => r.json())
.then(calData => {
    renderAllIntakes(calData)
})

// A user can record a new calorie intake which will be prepended to the list with pessimistic rendering
function renderAllIntakes(calData) {
    calData.forEach(intake => renderOneIntake(intake))
}

function renderOneIntake(intake) {    
    const intakeLi = document.createElement("li")
    const intakeId = intake.id
    intakeLi.className = "calories-list-item"
    intakeLi.innerHTML = `
    <div class="uk-grid"> <div class="uk-width-1-6"> <strong>${ intake.calorie }</strong> <span>kcal</span> </div> <div class="uk-width-4-5"> <em class="uk-text-meta">${ intake.note }</em> </div> </div> <div class="list-item-menu"> <a class="edit-button" uk-toggle="target: #edit-form-container" uk-icon="icon: pencil"></a> <a class="delete-button" uk-icon="icon: trash"></a> </div>
    `
    calorieUl.prepend(intakeLi)

    renderCalProgress(intake)

    // delete an intake
    const deleteBtn = document.querySelector(".delete-button")
    deleteBtn.addEventListener("click", (e) => {
    
        fetch(`http://localhost:3000/api/v1/calorie_entries/${intakeId}`, {
            method: "DELETE"
        }).then(() => intakeLi.remove())
    
    })

    // edit an intake
    const editBtn = document.querySelector(".edit-button")
    editBtn.addEventListener("click", (e) => {
        // modal pops up
        const preCal = document.querySelector("#pre-calorie")
        const preNote = document.querySelector("#pre-note")
        
        // modal should contain a form pre-populated with the information from the respective calorie-entry
        preCal.placeholder = intake.calorie
        preNote.placeholder = intake.note

        const editForm = document.querySelector("#edit-calorie-form")
        editForm.addEventListener("submit", (e) => {

            const editedIntake = {
                "calorie": e.target.editedc.value,
                "note": e.target.editedn.value
            }

            fetch(`http://localhost:3000/api/v1/calorie_entries/${intakeId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(editedIntake)
            })
            .then(r => r.json())
            // .then(newData => {
            //     console.log(newData)
            // })
        })

    })
}


// Each time an entry is made in the list, calculate the sum of all the calories and set this as the value attribute of the #progress-bar element
function renderCalProgress(intake) {

    // keep adding value with user's calorie amount
    currCalValue += intake.calorie
    progressTag.value = currCalValue

}


// when calorie form is submitted
// grab (1) cal <input> (2) notes <textarea>
// prepend it to calories-list-item via renderOneIntake
calorieForm.addEventListener("submit", handleIntake)

function handleIntake(e) {
    e.preventDefault()

    const calInput = document.querySelector("#cal-input")
    const calNote = document.querySelector("#cal-note")

    const newIntake = {
        "calorie": calInput.value,
        "note": calNote.value
    }

    fetch("http://localhost:3000/api/v1/calorie_entries", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(newIntake)
    })
    .then(r => r.json())
    .then(newData => {
        renderOneIntake(newData)
    })

    e.target.reset()

}

// Clicking the "Calculate BMR" button should update the span#lower-bmr-range and span#higher-bmr-range with the appropriate values
// forumla for lower-range: BMR = 655 + (4.35 x weight in pounds) + (4.7 x height in inches) - (4.7 x age in years)
// formula for upper-range: BMR = 66 + (6.23 x weight in pounds) + (12.7 x height in inches) - (6.8 x age in years)

const bmrForm = document.querySelector("#bmr-calulator")
bmrForm.addEventListener("submit", handleBMR)

function handleBMR(e) {
    e.preventDefault()
    // grab user input
    const userWeight = e.target.weight.value
    const userHeight = e.target.height.value
    const userAge = e.target.age.value

    // grab lower & upper ranges
    const lowRange = document.querySelector("#lower-bmr-range")
    const upRange = document.querySelector("#higher-bmr-range")

    // calculate
    const lowRangeResult = Math.round(655 + (4.35 * userWeight) + (4.7 * userHeight) - (4.7 * userAge))
    const upRangeResult = Math.round(66 + (6.23 * userWeight) + (12.7 * userHeight) - (6.8 * userAge))

    lowRange.innerText = lowRangeResult
    upRange.innerText = upRangeResult

    // Clicking the calculate BMR button should also set the #progress-bar's max attribute to the average of the two numbers above.
    progressTag.max = Math.round((lowRangeResult + upRangeResult) / 2)

    e.target.reset()
}
