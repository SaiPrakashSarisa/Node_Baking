//expressions
const firstname_exp = /^[^\s, ^\d].*/;
const lastname_exp = /^[^\s].*/;
const username_exp = /^[^\s].*/;
const password_exp = /^[^\s].*/;
const repassword_exp = /^[^\s].*/;
const email_exp = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
const conact_exp = /^[6-9]{1}[0-9]{9}$/;
const address_exp = /^[^\s].*/;

// validation for first name
function validatefname() {
  const firstname = document.getElementById("firstname").value;
  if (firstname_exp.test(firstname)) {
    document.getElementById("fnerr").innerHTML = "";
  } else {
    document.getElementById("fnerr").innerHTML = "Enter valid first name";
  }
}
// validation for last name
function validatelname() {
  const lastname = document.getElementById("lastname").value;
  if (lastname_exp.test(lastname)) {
    document.getElementById("lnerr").innerHTML = "";
  } else {
    document.getElementById("lnerr").innerHTML = "Enter valid Last name";
  }
}
// validation for user name
function validateusername() {
  const username = document.getElementById("username").value;
  if (username_exp.test(username)) {
    document.getElementById("unerr").innerHTML = "";
  } else {
    document.getElementById("unerr").innerHTML = "Enter valid username";
  }
}
// validation for password
function validatepass() {
  const password = document.getElementById("password").value;
  if (password_exp.test(password)) {
    document.getElementById("passerr").innerHTML = "";
  } else {
    document.getElementById("passerr").innerHTML =
      "<p>your password should contain altleast</p><p>one lowercase letter, uppercase letter, number, specialcharacter</p>";
  }
}

// validation for repassword
function validaterepass() {
  const password = document.getElementById("password").value;
  const repassword = document.getElementById("repassword").value;
  if (password === repassword) {
    document.getElementById("repasserr").innerHTML = "";
    document.getElementById("regbtn").disabled = false;
  } else {
    document.getElementById("repasserr").innerHTML = "Password does't match";
    document.getElementById("regbtn").disabled = true;
  }
}

// validation for
function validateemail() {
  const email = document.getElementById("email").value;
  if (email_exp.test(email)) {
    document.getElementById("emailerr").innerHTML = "";
  } else {
    document.getElementById("emailerr").innerHTML = "Enter a valid email";
  }
}

// validation for phone number
function validatePh() {
  const contact = document.getElementById("contact").value;
  if (conact_exp.test(contact)) {
    document.getElementById("pherr").innerHTML = "";
  } else {
    document.getElementById("pherr").innerHTML = "Enter a valid phone number";
  }
}

// validation for address
function validateaddress() {
  const address = document.getElementById("address").value;
  if (address_exp.test(address)) {
    document.getElementById("adderr").innerHTML = "";
  } else {
    document.getElementById("adderr").innerHTML = "Enter valid data";
  }
}
