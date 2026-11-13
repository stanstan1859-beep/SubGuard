// SUBGUARD - Subscription Tracker

let subscriptions = JSON.parse(
    localStorage.getItem("subscriptions") || "[]"
);

// Open subscription form
function showForm() {
    document.getElementById("subscriptionForm").style.display = "block";
}

// Save subscription
document.getElementById("subscriptionForm").addEventListener("submit", function(event) {

    event.preventDefault();

    let name = document.getElementById("name").value;
    let amount = Number(document.getElementById("amount").value);
    let expiry = document.getElementById("expiry").value;

    let subscription = {
        id: Date.now(),
        name: name,
        amount: amount,
        expiry: expiry
    };

    subscriptions.push(subscription);

    localStorage.setItem("subscriptions", JSON.stringify(subscriptions));

    this.reset();
    this.style.display = "none";

    displaySubscriptions();
});

// Display subscriptions
function displaySubscriptions() {

    let list = document.getElementById("subscriptionList");
    list.innerHTML = "";

    subscriptions.forEach(function(sub) {

    let card = document.createElement("div");
    card.className = "subscription-card";

    let today = new Date();
    today.setHours(0, 0, 0, 0);

    let expiryDate = new Date(sub.expiry + "T00:00:00");
    let daysLeft = Math.ceil((expiryDate - today) / 86400000);

    let status;

    if (daysLeft < 0) {
        status = "Expired";
    } else if (daysLeft <= 7) {
        status = "Expiring Soon";
    } else {
        status = "Active";
    }

        card.innerHTML = `
    <h3>${sub.name}</h3>
    <p>Amount: ₹${sub.amount}</p>
    <p>Expiry Date: ${sub.expiry}</p>
    <p class="status ${status.toLowerCase().replace(" ", "-")}">
        Status: ${status}
    </p>
`;

        let button = document.createElement("button");
        button.textContent = "Delete";

        button.onclick = function() {
            deleteSubscription(sub.id);
        };

        card.appendChild(button);
        list.appendChild(card);
    });

    updateSummary();
}

// Update dashboard
function updateSummary() {

    document.getElementById("total").textContent = subscriptions.length;

    let today = new Date();
    today.setHours(0, 0, 0, 0);

    let upcoming = subscriptions.filter(function(sub) {
        let date = new Date(sub.expiry + "T00:00:00");
        let days = (date - today) / 86400000;
        return days >= 0 && days <= 7;
    });

    document.getElementById("upcoming").textContent = upcoming.length;

    let spending = subscriptions.reduce(function(sum, sub) {
        return sum + sub.amount;
    }, 0);

    document.getElementById("spending").textContent =
        "₹" + spending.toFixed(2);
}

// Delete subscription
function deleteSubscription(id) {

    subscriptions = subscriptions.filter(function(sub) {
        return sub.id !== id;
    });

    localStorage.setItem("subscriptions", JSON.stringify(subscriptions));

    displaySubscriptions();
}

// Load saved subscriptions
displaySubscriptions();