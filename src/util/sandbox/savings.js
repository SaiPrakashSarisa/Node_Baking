function deposit() {
  const depositForm = document.getElementById("deposit");
  const withdrawForm = document.getElementById("withdraw");
  const transferform = document.getElementById("transfer");
  depositForm.style.display = "block";
  withdrawForm.style.display = "none";
  transferform.style.display = "none";
}

function widthdraw() {
  const withdrawForm = document.getElementById("withdraw");
  const depositForm = document.getElementById("deposit");
  const transferform = document.getElementById("transfer");
  withdrawForm.style.display = "block";
  depositForm.style.display = "none";
  transferform.style.display = "none";
}

function transfer() {
  const transferform = document.getElementById("transfer");
  const withdrawForm = document.getElementById("withdraw");
  const depositForm = document.getElementById("deposit");
  transferform.style.display = "block";
  withdrawForm.style.display = "none";
  depositForm.style.display = "none";
}

function closeForm() {
  const depositForm = document.getElementById("deposit");
  const withdrawForm = document.getElementById("withdraw");
  const transferform = document.getElementById("transfer");
  transferform.style.display = "none";
  withdrawForm.style.display = "none";
  depositForm.style.display = "none";
}
