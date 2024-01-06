const express = require("express")
const app = express()
const mongoose = require("mongoose")
app.set('view engine', 'ejs')
app.use(express.static("public"));
const bodyparser = require("body-parser")
mongoose.connect("mongodb://127.0.0.1:27017/eassets", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (!err) {
    console.log("connected to db");
  } else {
    console.log("error");
  }
})

app.use(bodyparser.urlencoded({ extended: true }));
const assetschema = new mongoose.Schema({
  AssetID: Number,
  Name: String,
  AssetType: String,
  Description: String,
  Area: Number,
  YearOfConstruction: Number,
  Capacity: Number,
  NumRooms: Number,
  MaintenanceRequired: String
})
let assetmod = mongoose.model("asset", assetschema);
app.get("/", (req, res) => {
  assetmod.find({}, (err, items) => {
    res.render("table", { newassets: items })
  })
  app.post("/newcreate", (req, res) => {
    res.sendFile(__dirname + "/index.html")
  })
})
app.post("/save", (req, res) => {
  let info = new assetmod({
    AssetID: req.body.AssetID,
    Name: req.body.Name,
    AssetType: req.body.AssetType,
    Description: req.body.Description,
    Area: req.body.Area,
    YearOfConstruction: req.body.YearOfConstruction,
    Capacity: req.body.Capacity,
    NumRooms: req.body.NumRooms,
    MaintenanceRequired: req.body.MaintenanceRequired
  });
  info.save();
  res.redirect("/")
});
app.get("/delete/:id", (req, res) => {
  let id = req.params.id;
  let del = assetmod.findByIdAndDelete(id);
  del.exec((err) => {
    if (err) throw err;
    res.redirect("/");
  });
});
app.get("/edit/:id", (req, res) => {

  const id = mongoose.Types.ObjectId(req.params.id.trim());
  
  // assetmod.updateOne({_id: id},{
  //   Name: req.body.Name
  // },function(err,result){
  //   if(err) throw err
  //   else{
  //     res.render("'edit',{ title:"Edit Asset Record" ,newassets:data}");
  //   }
  // });
  let edit = assetmod.findById(id);
  edit.exec((err, data) => {
    if (err) throw err;
    res.render('edit', { title: "Edit Asset Record", newassets: data });
  });

});

app.post("/update/", function (req, res) {
  const id = mongoose.Types.ObjectId(req.body.id.trim());
  assetmod.updateOne({ _id: id }, {
    AssetID: req.body.AssetID,
    Name: req.body.Name,
    AssetType: req.body.AssetType,
    Description: req.body.Description,
    Area: req.body.Area,
    YearOfConstruction: req.body.YearOfConstruction,
    Capacity: req.body.Capacity,
    NumRooms: req.body.NumRooms,
    MaintenanceRequired: req.body.MaintenanceRequired,
  }, function (err) {
    if (err) {
      console.log(err);
    }
  })
  res.redirect("/");
})

// app.post('/update/', (req, res) => {
//   console.log("before 88888888888")
//   assetmod.findByIdAndUpdate((req.body.id), {
//     //$set:

//     AssetID: req.body.AssetID,
//     Name: req.body.Name,
//     AssetType: req.body.AssetType,
//     Description: req.body.Description,
//     Area: req.body.Area,
//     YearOfConstruction: req.body.YearOfConstruction,
//     Capacity: req.body.Capacity,
//     NumRooms: req.body.NumRooms,
//     MaintenanceRequired: req.body.MaintenanceRequired,
//   }, function (err) {
//     if (err)
//       console.log(err);
//   })
//   res.redirect("/");
// });

app.listen(3000, function () {
  console.log("connected to port 3000");
})


