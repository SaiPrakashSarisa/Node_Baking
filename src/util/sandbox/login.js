const urlParams = new URLSearchParams(window.location.search);
const errmsg = urlParams.get("error");
console.log(errmsg);

if (errmsg) {
  document.getElementById("errmsg").innerHTML = errmsg;
  setTimeout(() => {
    document.getElementById("errmsg").innerHTML = "";
  }, 3000);
}
