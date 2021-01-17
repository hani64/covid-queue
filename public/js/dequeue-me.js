const dequeueBtn = document.querySelector('#dequeue-btn');

dequeueBtn.addEventListener('click', dequeue);

function dequeue(e) {
    e.preventDefault();
    
    const healthCardNumber = document.querySelector('#dequeue-input').value;
    const p = document.createElement('p');

    if (parseInt(healthCardNumber) >= 0) {
        p.textContent = `Successfully remove health card #${healthCardNumber} from the vaccine queue`;
        dequeueBtn.disabled = 'disabled';
        const deQueue = firebase.functions().httpsCallable('deQueue');
        deQueue(healthCardNumber);
    } else {
        p.textContent = 'Invalid health card number!'
    }
    
    document.querySelector('#dequeue-form').appendChild(p);
}