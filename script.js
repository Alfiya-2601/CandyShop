const candyForm = document.getElementById("candy-form");
const candyList = document.getElementById("candy-list");
let candies = [];

axios.get('https://crudcrud.com/api/ce6e5884540c488a98e9d7d788da14d8/candies')
.then(function (response){
    candies = response.data;
    renderCandyList();
})
.catch(function (error){
    console.log(error);
});

candyForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const price = parseFloat(document.getElementById("price").value);
    const quantity = parseInt(document.getElementById("quantity").value);
    
    if (name && !isNaN(price) && price >= 0 && !isNaN(quantity) && quantity >= 0) {
        const candy = {
            name,
            description,
            price,
            quantity
        };
        axios.post('https://crudcrud.com/api/ce6e5884540c488a98e9d7d788da14d8/candies', candy)
        .then(function (response){
            const newCandy = response.data;
            candies.push(newCandy);
            saveCandiesToLocalStorage();
            renderCandyList();
            resetForm();
        })
        .catch(function (error){
            console.log(error)
        });
    } else {
        alert("Please enter valid candy information.");
    }
});

function saveCandiesToLocalStorage() {
    localStorage.setItem("candies", JSON.stringify(candies));
}

function renderCandyList() {
    candyList.innerHTML = "";
    candies.forEach((candy) => {
        const candyItem = document.createElement("li");
        candyItem.className = "list-group-item";
        candyItem.innerHTML = `<strong>${candy.name}</strong> - ${candy.description} - ${candy.price.toFixed(2)} - ${candy.quantity} 
                <button class="btn btn-success btn-sm" onclick="buyCandy(${candy.uid})">Buy</button>
                <button class="btn btn-primary btn-sm" onclick="editCandy(${candy.uid})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteCandy(${candy.uid})">Delete</button>`;
        candyList.appendChild(candyItem);
    });
}

function buyCandy(uid) {
    const candy = candies.find((c) => c.uid === uid);
    if (candy && candy.quantity > 0) {
        // Decrease the candy's quantity locally
        candy.quantity--;
        // Make a PUT request to update the candy's quantity on the server
        axios.put(`https://crudcrud.com/api/ce6e5884540c488a98e9d7d788da14d8/candies/${uid}`, candy)
        .then(function (response){
            // Assuming the server has successfully updated the candy's quantity
            // You can handle the response if needed
            saveCandiesToLocalStorage();
            renderCandyList();
        })
        .catch(function (error){
            console.log(error);
        });
    }
}

function editCandy(uid) {
    const candy = candies.find((c) => c.uid === uid);
    if (candy) {
        document.getElementById("name").value = candy.name;
        document.getElementById("description").value = candy.description;
        document.getElementById("price").value = candy.price;
        document.getElementById("quantity").value = candy.quantity;
        deleteCandy(uid);
    }
}

function deleteCandy(uid) {
    // Make a DELETE request to remove the candy from the server
    axios.delete(`https://crudcrud.com/api/ce6e5884540c488a98e9d7d788da14d8/candies/${uid}`)
    .then(function (response){
        const index = candies.findIndex((c) => c.uid === uid);
        if (index !== -1) {
            candies.splice(index, 1);
            saveCandiesToLocalStorage();
            renderCandyList();
        }
    })
    .catch(function (error){
        console.log(error)
    });
}

function resetForm() {
    document.getElementById("name").value = "";
    document.getElementById("description").value = "";
    document.getElementById("price").value = "";
    document.getElementById("quantity").value = "";
}

renderCandyList();
