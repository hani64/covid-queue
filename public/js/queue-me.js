const formInputInfo = document.querySelectorAll('.info-input');
const submitFormBtn = document.querySelector('#info-submit-btn');
const loginBtn = document.querySelector('#login-btn');

loginBtn.addEventListener('click', login);

function login(e) {
    e.preventDefault();

    const helloWorld = firebase.functions().httpsCallable('helloWorld');
    helloWorld();
    loginBtn.disabled = 'disabled';
}

submitFormBtn.addEventListener('click', submitForm);

// submitForm(e) collects all information from input elements in the form, storing it in
//    an array. Order of information is determined by input element order in HTML file.
function submitForm(e) {
    e.preventDefault();

    let allInputInfo = [];
    for (const input of formInputInfo) {
        allInputInfo.push(input.value);
    }

    let p = document.createElement('p');
    
    p.textContent += allInputInfo.join(' ');
    document.querySelector(".info-form").appendChild(p);

    submitFormBtn.disabled = 'disabled';
}


