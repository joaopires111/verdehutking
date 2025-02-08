
    function loginbutton(){
        let username = document.getElementById("login").value;
        let password = document.getElementById("password").value;

        fetch("../php/login/login.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `username=${username}&password=${password}`,
        })
        .then(response => response.text())
        .then(data => {
            if (data.includes("admin.php")) {
                window.location.href = "./admin.php";
            } else {
                document.getElementById("imgwarning").hidden = false;
            }
        })
        .catch(error => console.error("Error:", error));
    };
