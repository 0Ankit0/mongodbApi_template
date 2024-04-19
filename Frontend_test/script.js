// Assuming you have included the jQuery library

// Assuming you have a form element with the id "loginForm"
const form = $("#loginForm");


form.submit(function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    var data = {
        Email: $("#Email").val(),
        Password: $("#Password").val()
    }
    console.log(data);
    $.ajax({
        url: "http://localhost:8000/user/login",
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            document.cookie = `token=${response.token}; path=/; secure; samesite=strict`;
            const socket = io('http://localhost:8000/');
            socket.emit('login', response.token);
            location.href = "./index.html";
        },
        error: function (xhr, status, error) {
            // Request failed
            console.error("Request failed. Status: " + status);
        }
    });
});
function getCookie(name) {
    let cookieArr = document.cookie.split("; ");

    for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");

        if (name == cookiePair[0]) {
            return decodeURIComponent(cookiePair[1]);
        }
    }

    // Return null if not found
    return null;
}
$(document).ready(function () {
    // Check if the user is logged in
    const token = getCookie("token");

    if (token) {
        const navbar = $("#narbarBtn");
        const logoutButton = $(
            "<button class='btn btn-danger' id='logoutButton'>Logout</button>"
        );

        navbar.html(logoutButton);

        $("#logoutButton").click(function () {
            document.cookie =
                "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

            window.location.href = "./login.html";
        });
    }
});