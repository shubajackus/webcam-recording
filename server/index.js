const express = require("express");
const db_conn = require("./database_conn");
const router = express.Router();
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8000;
const path = require('path');
const e = require("express");

app.use(cors());
app.use(express.json());

const buildPath = path.join(__dirname, '..', 'build');
app.use(express.static(buildPath));
app.use("/admin", express.static(buildPath));

// test url
app.get("/api/something", (req, res) => {
  res.json({data: "Hello World!"});
});

// post method from client to save recording data
app.post("/api/upload_recording", async (req, res) => {
    console.log("Fetch post successfull..");
    console.log(req.body.name);
    console.log(req.body.dateModified);

    //Create video file object to be saved in db
    let videoFileObj = new db_conn.Recordings({ name: req.body.name, dateModified: req.body.dateModified, url: req.body.url.replace(".mkv", ".mp4") });

    // from db obj model indert video file object 
    videoFileObj.save(err=>{
      if(err){
        next();
      }
      res.json({data: videoFileObj})
    });
  });



// Get all saved recording data from mongodb
app.get("/api/get_all_recordings", async (req, res) => {
  const recordings = await db_conn.Recordings.find({});
  if(recordings){
    res.json({data: recordings})
  }else{
    res.json({message: "Something went wrong"})
  }
});


app.listen(PORT, ()=>{
    console.log(`Server Listening on ${PORT}`);
});


