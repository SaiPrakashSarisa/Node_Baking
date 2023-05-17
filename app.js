const express = require("express");
const app = express();
const serveStatic = require("serve-static");
const cors = require("cors");

// getting out routes module
const routes = require("./src/routes/Log&Reg");

app.set("view-engine", "ejs");

app.use(cors());
// to serve static css files
app.use(express.static(__dirname + "/public"));

// to server static javascript file
app.use(
  serveStatic(__dirname + "/src/util/sandbox", {
    "Content-Type": "text/javascript",
  })
);

// using routes as middleware function
app.use("/", routes);
// app.use("/registerform", routes);
// app.use("/adduser", routes);
// app.use("/dashboard", routes);
// app.use("/savings", routes);
// app.use("/creditcards", routes);
app.use("/loans", routes);
app.use("/investments", routes);
// app.use("/deposit", routes);
// app.use("/withdraw", routes);
// app.use("/transfer", routes);
// app.use("/addCard", routes);

app.listen(8000, (req, res) => {
  console.log("application is running on port: 8000......");
});
