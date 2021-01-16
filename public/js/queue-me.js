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

    // change visible forms
    infoForm.style.display = 'flex';
    loginForm.style.display = 'none';

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

    let p = document.createElement('p');
    
    p.textContent += allInputInfo.join(' ');
    document.querySelector("#info-form").appendChild(p);

    submitFormBtn.disabled = 'disabled';
}


