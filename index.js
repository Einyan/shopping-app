import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://my-shopping-app-af3ca-default-rtdb.europe-west1.firebasedatabase.app/"
}
// Connect to DB
const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

// Javascript handles 
const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

let localCache = [];
inputFieldEl.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        addButtonEl.click();
    }
});


addButtonEl.addEventListener("click", function () {
    let inputValueRaw = inputFieldEl.value;

    // console.log('button clicked!')
    if (inputValueRaw[0] === " ") {
        return
    }
    let inputValue = inputValueRaw.trim();
    if (inputValue === "") {
        return
    }

    //iterate over local cache to see if it already exists
    // for (let i = 0; i < localCache.length; i++) {
    //     let currentItem = localCache[i]
    //     if (inputValue === currentItem) {
    //         return;
    //     }
    // }

    if (localCache.includes(inputValue)) {
        return;
    }
    push(shoppingListInDB, inputValue)
    clearInputFieldEl()
    // appendItemToShoppingListEl(inputValue)
})

onValue(shoppingListInDB, function (snapshot) {

    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        clearShoppingListEl()
        localCache = []
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            localCache.push(currentItemValue);
            appendItemToShoppingListEl(currentItem)
        }
        console.log(localCache)
    } else {
        shoppingListEl.innerHTML = "Need anything?"
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
    newEl.classList = ["listItem"]

    newEl.addEventListener('click', () => {
        let locationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        remove(locationOfItemInDB)
    })

    shoppingListEl.append(newEl)
}

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ''
}