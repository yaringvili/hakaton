    function retrieve() {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200 && this.responseText != "") {
          res = this.responseText.split(" ")
          document.getElementById("img").src = res[2];
          document.getElementById("counter").innerHTML = res[1];
          if(res[0] === "F"){
          document.getElementById("found").innerHTML = "Found person username: " + res[1];
          }
        }
      };
      xhttp.open("GET", "/status", true);
      xhttp.send();
    }
    setInterval(retrieve, 1000);