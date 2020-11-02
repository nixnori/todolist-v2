
const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true})

const itemSchema = new mongoose.Schema ({
  name: String
})

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item ({
  name: "This is item 1."
})

const item2 = new Item ({
  name: "This is item 2."
})

const item3 = new Item ({
  name: "This is item 3."
})

const defaultItems = [item1, item2, item3]

app.get("/", function(req, res) {
  
  Item.find({}, (err, foundItems) => {
    
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, err => {
        if (err) {
          console.log(err) 
        } else {
          console.log("Item added successfully!")
        }
      })
      
      res.redirect("/")
    } else {
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }

  })

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item ({
    name: itemName
  })

  item.save()

  res.redirect("/")
  
});

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;
  console.log(checkedItemId)

  Item.findOneAndDelete({_id: checkedItemId}, function(err) {
    if (!err) {
      console.log("Delete successful.")
      res.redirect("/")
    }
  })

})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
