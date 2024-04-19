
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
            location.href = "./index.html";
            io('http://localhost:8000/', response.token)
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
        const socket = io('http://localhost:8000/', { query: { token } });

        const navbar = $("#narbarBtn");
        const logoutButton = $(
            `<button class='btn btn-danger'  id='logoutButton'>Logout</button>`
        );

        navbar.html(logoutButton);

        $("#logoutButton").click(function () {
            sessionStorage.removeItem("token");
            socket.disconnect();
            window.location.href = "./login.html";
        });

        socket.on("chat message", (data) => {
            const messages = document.getElementById("messages");
            const li = document.createElement("li");
            li.textContent = `${data.user}: ${data.message}`;
            messages.appendChild(li);
        });

        $(document).on("click", "#sendMessageBtn", function () {
            const message = $("#messageInput").val();
            socket.emit("message", { receiverId: $(this).data("userid"), message: message });

        });
        socket.on("messageSent", (message) => {
            $(".chat-history ul").append(`<li class="clearfix">
            <div class="message my-message">
              ${message}
            </div>
          </li>`);
        });
    }
});

