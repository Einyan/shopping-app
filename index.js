/*
Challenge:
Make it so that when you click the 'Add to cart' button, 
whatever is written in the input field should be console logged.
*/

const btn = document.getElementById('add-button')
const inputFieldEl = document.getElementById('input-field')

btn.addEventListener('click', function () {
    let inputValue = inputFieldEl.value
    console.log(inputValue)
})