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
    userCheck(document.querySelector('#login-input').value).then(res => {
        if (res) {           // using truthy/falsey
            // ... do stuff  if the user exists
            const loginSuccess = document.createElement('p');
            loginSuccess.textContent = res.priority_queue;
            loginForm.appendChild(loginSuccess);
        } else {
            // change visible forms
            loginForm.style.display = 'none';
            infoForm.style.display = 'flex';
        }    
    });

    const userFromLoginInput = null;
    if (userFromLoginInput) {           // using truthy/falsy
        // ... do stuff  if the user exists
        const loginSuccess = document.createElement('p');
        loginSuccess.textContent = getPriorityString(userFromLoginInput);
        loginForm.appendChild(loginSuccess);
    } else {
        // change visible forms
        loginForm.style.display = 'none';
        infoForm.style.display = 'flex';
    } 

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

    p.textContent = getPriorityStringFromArray(allInputInfo);
    document.querySelector("#info-form").appendChild(p);

    submitFormBtn.disabled = 'disabled';
}

// getPriorityStringFromArray(allInputInfo) computes a message, indicating a person's priority
//     queue number.
// Pre: allInputInfo is an array containing the inputted information
// array element types: string, string, string, number, bool, bool, bool, bool

function getPriorityStringFromArray(allInputInfo) {

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
    if (typeof age === 'number' && age >= 0) {
        priorityNumber += 10 / age;
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

    return "Your priority rating (lower is better): " + priorityNumber;
}


// getPriorityString(user) given a JSON object user, produce a message indicating the user's
//    priority rating
function getPriorityString(user) {

    // IF a null user is passed
    if (user === null) {
        return 'Error! This user does not exist';
    }

    let priorityNumber = 0;

    // compute priority number
    if (parseInt(user.age) >= 0) {
        priorityNumber += 10 / user.age;
    } else {
        return `Error: Person with Health card #${user.health_card_number} has an invalid age.`;
    }

    if (!user.is_essential) {
        priorityNumber += 10;
    }

    if (!user.in_group_setting) {
        priorityNumber += 5;
    }

    if (!user.is_nurse) {
        priorityNumber += 15;
    }

    if (!user.is_pregnant) {
        priorityNumber += 12;
    }

    return "Your priority rating (lower is better): " + priorityNumber;
}