import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://my-shopping-app-af3ca-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

// inputField.addEventListener('keypress', function (e) {
//     if (e.key === 'Enter') {
//         addButtonEl.click();
//     }
// });


addButtonEl.addEventListener("click", function () {
    let inputValue = inputFieldEl.value
    // console.log('button clicked!')
    push(shoppingListInDB, inputValue)
    clearInputFieldEl()
    // appendItemToShoppingListEl(inputValue)
})

onValue(shoppingListInDB, function (snapshot) {

    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        clearShoppingListEl()
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            appendItemToShoppingListEl(currentItem)
        }
    } else {
        shoppingListEl.innerHTML = "Co chcesz dostać?"
    }
})

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    let newEl = document.createElement('li')
    newEl.textContent = itemValue

    newEl.addEventListener('click', function () {
        let locationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        remove(locationOfItemInDB)
    })

    shoppingListEl.append(newEl)
}

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ''
}