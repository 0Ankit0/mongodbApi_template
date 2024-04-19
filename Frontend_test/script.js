
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
        error: function (xhr, error) {
            if (xhr.status === 401) {
                alert(xhr.responseJSON.message);
            } else {
                alert("Error occurred", error);
            }

        }
    });
});

$("#fileUpload").submit(function (event) {
    event.preventDefault();

    var data = new FormData();
    data.append("file", $("#file")[0].files[0]);

    $.ajax({
        url: "http://localhost:8000/upload/file",
        type: "POST",
        data: data,
        contentType: false,
        processData: false,
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
        success: function (response) {
            alert(response);
            console.log(response);
        },
        error: function (xhr, error) {
            alert("Error occurred", error);
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

        socket.on("liveMessage", (data) => {
            $(".chat-history ul").append(`<li class="clearfix">
            <div class="message other-message">
              ${data}
            </div>
          </li>`);
        });

        $(document).on("click", "#sendMessageBtn", function () {
            const message = $("#messageInput").val();

            if ($(this).data("groupid") === undefined || $(this).data("groupid") === "") {
                socket.emit("groupmessage", { receiverId: $(this).data("userid"), message: message });
            } else {

                socket.emit("message", { receiverId: $(this).data("userid"), message: message });
            }

        });
        socket.on("messageSent", (message) => {
            $(".chat-history ul").append(`<li class="clearfix">
            <div class="message my-message float-right">
              ${message}
            </div>
          </li>`);
            $("#messageInput").val("")
        });
    }
});

