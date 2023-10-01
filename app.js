const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.set("view engine", "ejs"); // Line of code required for ejs to work
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // mianly for connection with css and images

mongoose.connect("mongodb+srv://admin:admin@cluster0.zs09vys.mongodb.net/todolistDB"); // Here todolist is the database created

let day = date.getDate();

const itemSchema = new mongoose.Schema({
  name: String,
});
const itemModel = new mongoose.model("item", itemSchema);

const item1 = new itemModel({
  name: "Buy Food",
});
const item2 = new itemModel({
  name: "Eat Food",
});
const item3 = new itemModel({
  name: "Sell Food",
});
const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
  name: String,
  item: [itemSchema],
});

const listModel = new mongoose.model("list", listSchema);

// let items = ["Buy Food", "Eat Food", "Sell Food"];
// let workItems = [];
app.get("/", (req, res) => {
  // let day = date(); Method 1

  itemModel.find().then(function (x) {
    if (x.length === 0) {
      itemModel.insertMany(defaultItems).then(function (x) {
        console.log("Success");
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: day, listItems: x });
    }
  });
});

app.get("/:customListName", (req, res) => {
  const customName = _.capitalize(req.params.customListName);
  listModel.findOne({ name: customName }).then(function (x) {
    if (!x) {
      // console.log("Its a new name");
      const listItem = new listModel({
        name: customName,
        item: defaultItems,
      });
      listItem.save();
      res.redirect("/" + customName);
    } else {
      // console.log("name exists");
      res.render("list", { listTitle: customName, listItems: x.item });
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.post("/", (req, res) => {
  const buttonValue = req.body.button;
  const inputValue = req.body.toDoItem;

  const itemx = new itemModel({
    name: inputValue,
  });
  if (buttonValue === day) {
    itemx.save();
    res.redirect("/");
  } else {
    listModel.findOne({ name: buttonValue }).then(function (x) {
      x.item.push(itemx);
      x.save();
      res.redirect("/" + buttonValue);
    });
  }

  // console.log(req.body);
  // let item = req.body.toDoItem;
  // if (req.body.button === "Work") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }
  // res.render("list", {items:item}); SInce we have rendered it first we cant do the same again hence we need to create
  // list and this list will have the appended values. Once the value is appended then we redirect the route to the home
  // page. Now we have again reached the get request part and now we render the values. Hence the items are now visible
});

app.post("/delete", (req, res) => {
  const itemToBeDeleted = req.body.checkbox;
  const hiddenText = req.body.hiddenValues;
  if (hiddenText === day) {
    itemModel.deleteOne({ _id: itemToBeDeleted }).then(function () {
      console.log("Deleted Successfully");
      res.redirect("/");
    });
  } else {
    listModel
    .findOneAndUpdate({name:hiddenText}, {$pull:{item:{_id:itemToBeDeleted}}}).then(function(x){
      res.redirect("/"+hiddenText);
    })
  }
});

app.listen(3000, () => {
  console.log("Gotchaa !!!");
});
