const formInputInfo = document.querySelectorAll('.info-input');
const infoForm = document.querySelector('#info-form');
const loginForm = document.querySelector('#login-form');
const submitFormBtn = document.querySelector('#info-submit-btn');
const loginBtn = document.querySelector('#login-btn');
const allCheckboxes = document.querySelectorAll('.predicate-check');

loginBtn.addEventListener('click', login);

// login(e) collects a user's health card number and checks if they are in the system already
// * if so, print their information
// * else, allow them to register
function login(e) {
    e.preventDefault();

    const userCheck = firebase.functions().httpsCallable('userCheck');
    userCheck("1111").then(res =>{
        console.log(res);
    });

    // change visible forms
    infoForm.style.display = 'flex';
    loginForm.style.display = 'none';

    // if a person with the health card number exists in the database redirect
    loginBtn.disabled = 'disabled';
}

submitFormBtn.addEventListener('click', submitForm);

// submitForm(e) collects all information from input elements in the form, storing it in
//    an array. Order of information is determined by input element order in HTML file.
function submitForm(e) {
    e.preventDefault();

    let allInputInfo = [];

    // add all user input to the array first
    for (const input of formInputInfo) {
        const inputValue = input.value;
        if (inputValue != "") {
            allInputInfo.push(input.value);
        } else {
            allInputInfo.push("null");
        }    
    }

    // now all booleans for checkboxes
    // * in order: essential?, group setting?, nurse?, pregnant?
    for (const choice of allCheckboxes) {
        allInputInfo.push(choice.checked);
    }

    // Show user's priority number (lower is better) 
    let p = document.createElement('p');
    
    p.textContent = getPriorityString(allInputInfo);
    document.querySelector("#info-form").appendChild(p);

    submitFormBtn.disabled = 'disabled';
}

// getPriorityString(allInputInfo) computes a message, indicating a person's priority
//     queue number.
// Pre: allInputInfo is an array
// array element types: string, string, string, number, bool, bool, bool, bool

function getPriorityString(allInputInfo) {

    // first two array elements are first and last name (unneeded for calculations)
    // NOTE: this method of grabbing data is NOT suited well for changes in the form. 
    //       That is, it is VERY easily broken if new input elements are added. 
    //       Perhaps an object with fields may be better.
    const fName = allInputInfo.shift();
    const lName = allInputInfo.shift();
    const age = parseInt(allInputInfo.shift());
    const healthCardNumber = allInputInfo.shift();
    const isEssential = allInputInfo.shift();
    const livesInGroupSetting = allInputInfo.shift();
    const isNurse = allInputInfo.shift();
    const isPregnant = allInputInfo.shift();

    let priorityNumber = 0;
    // compute priority number
    console.log(age);
    if (typeof age === 'number' && age >= 0) {
        priorityNumber += 10/age;
    } else {
        return `Error: Person with Health card #${healthCardNumber} has an invalid age.`;
    }
    
    if (!isEssential) {
        priorityNumber += 10;
    } 

    if (!livesInGroupSetting) {
        priorityNumber += 5;
    }

    if (!isNurse) {
        priorityNumber += 15;
    }

    if (!isPregnant) {
        priorityNumber += 12;
    }
    const addUser = firebase.functions().httpsCallable('addUser');
    addUser({
        "first_name": fName,
        "last_name": lName,
        "age": age.toString(),
        "is_essential": isEssential.toString(),
        "in_group_setting": livesInGroupSetting.toString(),
        "is_nurse": isNurse.toString(),
        "is_pregnant": isPregnant.toString(),
        "health_card_number": healthCardNumber,
        "priority_number": priorityNumber 
      }).then(res =>{
          console.log("added a user");
      });

    return "Your priority number is (lower is better): " + priorityNumber;
}
