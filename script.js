import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, set, push, remove, get, onChildAdded } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";  

const firebaseConfig = {
    apiKey: "AIzaSyAv0LUB8IlYuG3D_YuqeXBUwldfdd2xVnQ",
    authDomain: "chatapp-a5f6f.firebaseapp.com",
    projectId: "chatapp-a5f6f",
    storageBucket: "chatapp-a5f6f.firebasestorage.app",
    messagingSenderId: "1066562669595",
    appId: "1:1066562669595:web:0804741ab9de076de47cbe",
    measurementId: "G-MVSMRZT4X7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();

let input = document.querySelector(".input");
let viewSec = document.querySelector(".view-sec");
let submit = document.querySelector(".submit");
let logout = document.querySelector(".logout-btn");

document.addEventListener("DOMContentLoaded", () => {
    let popup = document.querySelector(".popup-div");
    let popupInput = document.querySelector(".popup-input");
    let popupBtn = document.querySelector(".popup-btn");

    let savedUsername = localStorage.getItem("username");
    if (savedUsername) {
        popup.style.display = "none";
    }

    popupBtn.addEventListener("click", () => {
        let username = popupInput.value.trim();
        if (username) {
            localStorage.setItem("username", username);
            popup.style.display = "none";
            popupInput.value = "";
        } else {
            alert("Enter your username");
        }
    });

    logout.addEventListener("click", () => {
        let username = localStorage.getItem("username");
        if (!username) return;
        alert("are you sure?");

        let userRef = ref(db, "/userInfo");

        get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
                let messagesToDelete = [];
                snapshot.forEach((childSnapshot) => {
                    let data = childSnapshot.val();
                    if (data.userName === username) {
                        messagesToDelete.push(childSnapshot.key);
                    }
                });

                messagesToDelete.forEach((key) => {
                    remove(ref(db, "/userInfo/" + key))
                        .then(() => console.log("Message deleted:", key))
                        .catch((error) => console.log("Error deleting message:", error));
                });

                console.log("All user messages deleted.");
            } else {
                console.log("No messages found.");
            }

            localStorage.removeItem("username");
            popup.style.display = "flex";
        }).catch((error) => {
            console.log("Error fetching messages:", error);
        });
    });

});

// Function to display messages in chatbox
function showMessage(username, message) {
    let messBox = document.createElement("div");
    let text = document.createElement("h3");
    let pfp = document.createElement("div");
    let userNameTag = document.createElement("h4");

    messBox.style.display = "flex";
    messBox.style.alignItems = "center";
    messBox.style.gap = "10px";
    messBox.style.borderRadius = "10px";
    messBox.style.boxShadow = "1px 0px 3px black";
    messBox.style.padding = "10px";
    messBox.style.margin = "5px 0";

    pfp.style.borderRadius = "50px";
    pfp.style.border = "1px solid white";
    pfp.style.backgroundImage = `url(https://tr.rbxcdn.com/180DAY-d04a9468177b152ea023e3ac58eafeb6/420/420/Hat/Webp/noFilter)`;
    pfp.style.backgroundSize = "cover";
    pfp.style.backgroundPosition = "center";
    pfp.style.height = "40px";
    pfp.style.width = "40px";
    pfp.style.backgroundColor = "white";

    userNameTag.style.fontSize = "12px";
    userNameTag.style.fontWeight = "bold";
    userNameTag.style.color = "green";
    userNameTag.textContent = "// " + username || "Anonymous";

    text.style.fontSize = "20px";
    text.innerHTML = message;

    messBox.appendChild(pfp);
    messBox.appendChild(userNameTag);
    messBox.appendChild(text);
    viewSec.appendChild(messBox);
}

// Send Message
submit.addEventListener("click", () => {
    let username = localStorage.getItem("username");

    if (input.value.trim() !== "") {
        let message = input.value;
        input.value = ""; // Clear input field

        let newMessageRef = push(ref(db, "/userInfo"));
        set(newMessageRef, {
            userName: username,
            userMessage: message
        }).catch(e => alert("Error: " + e));
    } else {
        alert("Type something");
    }
});

// Listen for new messages in real-time
onChildAdded(ref(db, "/userInfo"), (snapshot) => {
    let data = snapshot.val();
    showMessage(data.userName, data.userMessage);
});
