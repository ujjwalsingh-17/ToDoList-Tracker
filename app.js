//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose=require('mongoose');
const app = express();
const _=require("lodash")

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-ujjwal:Testing123@cluster0.lwg07wr.mongodb.net/todolistDB",{useNewUrlParser: true});


const itemsSchema={
  name: String
}

const Item= mongoose.model("Item",itemsSchema)

const item1= new Item({
  name: "Have breakfast at 9:00 a.m. sharp"
})

const item2=new Item({
  name: "Solve some questions on dsa"
})

const item3= new Item({
  name: "Do some Web Development"
})


const defaultItems=[item1,item2,item3]


const listSchema={
  name:String,
  items:[itemsSchema]
};

const List= mongoose.model("List",listSchema)

// Item.insertMany(defaultItems,function(err){
//   if(err)
//   console.log(err)
//   else
//   console.log("Successfully saved default items to database");
// })



// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

// Item.deleteOne({_id:"628d7183559102d3cc8d7397"}, function(err){
//   if(err)
//   console.log(err)
//   else
//   console.log("Successfully deleted one document")
// })
const day = date.getDate();


app.get("/", function(req, res) {


  Item.find({}, function(err,foundItems){

    if(foundItems.length==0){
      Item.insertMany(defaultItems,function(err){
    if(err)
    console.log(err)
    else
    console.log("Successfully saved default items to database");
  })
  res.redirect("/")
    }

    // console.log(foundItems)

    // console.log(foundItems);
    
    res.render("list", {listTitle: day, newListItems: foundItems});

  })



  // res.render("list", {listTitle: day, newListItems: items});

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName= req.body.list;

  const item=new Item({
    name: itemName
  })

  if(listName == day){
    item.save();
  res.redirect("/")
  }
  else{
    List.findOne({name:listName},function(err,foundList){
      if(!err){
        foundList.items.push(item)
        foundList.save()
        res.redirect("/"+listName)
      }
    })
  }
  
  })

  app.post("/delete",function(req,res){
    // console.log(req.body.checkBox)
    const checkedItemId=req.body.checkBox
    const listName=req.body.listName;

      if(listName == day){
        Item.deleteOne({_id:checkedItemId}, function(err){
          if(err)
          console.log(err)
          else
          console.log("Successfully deleted one document")
    
          res.redirect("/")
        })
      }

      else{
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}} ,function(err,foundList){
          if(!err){
            res.redirect("/"+listName)
          }
        })
      }

   
  })


// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

// app.get("/about", function(req, res){
//   res.render("about");
// });




// express routing parameters : creating custom route


app.get("/:customListName", function(req,res){
const routeName=  _.capitalize(req.params.customListName);

List.findOne({name:routeName}, function(err,foundList){
  if(!err){
    if(!foundList){ 
    // console.log("Route doesn't exits")
    // Create a new List 
    const list= new List({
      name:routeName,
      items:defaultItems
    });
    
    list.save()

    res.redirect("/"+routeName);
    }
    else{ 
    // console.log("Route already exits")
    // Show an existing list 

    res.render("list",{listTitle:foundList.name, newListItems:foundList.items})
    }
  }
});


})











// let port = process.env.PORT;
// if (port == null || port == "") {
//   port = 3000;
// }
// app.listen(port);




// app.listen(port, function() {
//   console.log("Server started successfully");
// });

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});