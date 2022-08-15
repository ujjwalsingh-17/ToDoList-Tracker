
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose=require('mongoose');
const app = express();
const _=require("lodash")

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


//Connections

mongoose.connect("mongdb+srv://admin-ujjwal:Testing123@cluster0.lwg07wr.mongodb.net/todolistDB",{useNewUrlParser: true});


//Schema

const itemsSchema={
  name: String
}

const Item= mongoose.model("Item",itemsSchema)


const listSchema={
  name:String,
  items:[itemsSchema]
};

const List= mongoose.model("List",listSchema)





const day = date.getDate();


//Routes

app.get("/", function(req, res) {


  Item.find({}, function(err,foundItems){
    
    res.render("list", {listTitle: day, newListItems: foundItems});

  })

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


  


app.listen(process.env.PORT || 3000, function () {
  console.log("Server started ");
});