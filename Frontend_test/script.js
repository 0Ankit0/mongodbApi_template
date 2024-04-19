var socket;

if (!socket || !socket.connected) {
    socket = io('http://localhost:8000/');
}
const form = $("#loginForm");

form.submit(function (event) {
    event.preventDefault();

    var data = {
        Email: $("#Email").val(),
        Password: $("#Password").val()
    }
    $.ajax({
        url: "http://localhost:8000/user/login",
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            sessionStorage.setItem("token", response.token);
            socket.emit('login', response.token);
            socket.on('loginSuccessful', function () {
                location.href = "./index.html";
            });
        },
        error: function (xhr, status, error) {
            // Request failed
            console.error("Request failed. Status: " + status);
        }
    });
});

$(document).ready(function () {
    const token = sessionStorage.getItem("token");

    if (token) {
        const navbar = $("#narbarBtn");
        const logoutButton = $(
            `<button class='btn btn-danger'  id='logoutButton'>Logout</button>`
        );

        navbar.html(logoutButton);

        $("#logoutButton").click(function () {
            sessionStorage.removeItem("token");
            socket.emit('logout');
            window.location.href = "./login.html";
        });
    }
});