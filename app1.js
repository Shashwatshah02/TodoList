const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.get("/", function(req, res) {
    const day = date.getDate();

    res.render("list", {listTitle: day, listItems: items});
});

app.post("/", function(req, res) {
    const item = req.body.newItem;

    if (req.body.list === "Work") {
      workItems.push(item);
      res.redirect("/work");
    } else {
      items.push(item);
      res.redirect("/");
    }
});

app.listen(3000, function() {
    console.log("Server is running on port 3000");
});