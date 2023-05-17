function addCard() {
  document.getElementById("addCard").style.display = "block";
}

function removeForm(id) {
  document.getElementById("addCard").style.display = "none";
  document.getElementById(id).style.display = "none";
}

function showdetails(id, length) {
  //getting card number
  let popupid = "popup" + id.substring(4);
  // console.log(popupid);
  document.getElementById(popupid).style.display = "block";

  for (let i = 1; i <= length; i++) {
    if (i != id.substring(4)) {
      document.getElementById("popup" + i).style.display = "none";
    }
  }
}

function swipe(index, length) {
  // console.log(index);
  // console.log(length);
  document.getElementById("actions" + index).style.display = "block";
  document
    .getElementById("actionlink" + index)
    .setAttribute("action", "/swipe");
}

function paydue(index) {
  document.getElementById("actions" + index).style.display = "block";
  document
    .getElementById("actionlink" + index)
    .setAttribute("action", "/paydue");
}

function removeCard(index) {
  document.getElementById("actions" + index).style.display = "block";
  document
    .getElementById("actionlink" + index)
    .setAttribute("action", "/removeCard");
}

function displayMenu() {
  const btn = document.getElementById("dropdown");

  if (btn.style.display === "none") {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
}
