const express = require('express');
const router =express.Router();
const Todo = require('../Models/todoModel');
const path = require('path');

var localVersion = true;

//GET ALL TODO LIST
router.get('/stream', async (req,res) =>{
    try{
      var  eventInterval;
       Todo.watch().on("change",(change)=>{
        console.log(change);
        localVersion = false;
       });
      res.set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept",
      })
      eventInterval = setInterval(async () => {
      const postList = await Todo.find().select("title users discription status").populate("users" ,"email name");
      console.log("client connected to sse",postList.length);
       const dataTosend ={
        status:true,
        data:postList
       }
       if(!localVersion){
        res.status(200).write(`data: ${JSON.stringify(dataTosend)}\n\n`);
       }
       
      }, 1000);
       if(localVersion){
        const postList = await Todo.find().select("title users discription status").populate("users" ,"email name");
        console.log("client connected to sse",postList.length);
        const dataTosend ={
         status:true,
         data:postList
       }
        res.status(200).write(`data: ${JSON.stringify(dataTosend)}\n\n`);
       }
       
      //  req.on('close', (err) => {
      //    clearInterval(eventInterval);
      //  res.end();
    // });
}
   catch (err) {
    res.status(400).json({ status: false, message: err });
  }
});

//GET ALL TODO LIST
router.get('/get',async (req,res)=>{
    try{
        const postList = await Todo.find().select("title users discription status").populate("users" ,"email name");
        res.status(200).json({ status: true,data:postList});
    }
   catch (err) {
    res.status(400).json({ status: false, message: err });
  }
});

//GET ONE TODO BY ID
router.get('/get/:userId',async (req,res)=>{
    console.log(req.params.todoId)
    try{
        const postDet=await Todo.findAll(req.params.userId);
        res.status(200).json({ status: true,data:postDet});
       }
   catch (err) {
    res.status(400).json({ status: false, message: err });
  }
});

// GET TODO BY SEARCH
router.post('/search',async (req,res)=>{
    try{
        var regex=new RegExp(req.body.title,'i');
        const postDet = await Todo.find({"title":regex});
        res.status(200).json({ status: true,data:postDet});
    }
   catch (err) {
    res.status(400).json({ status: false, message: err });
  }
});

router.patch("/edit/:todoId", async (req, res) => {
  console.log(req.params.todoId);
  try {
    const data = await Todo.findById(req.params.todoId);
    if (!data) return res.json({ status: false, message: "No todo found" });

    const udpateData = req.body;
      console.log(udpateData);
    const changePost = await Todo.findOneAndUpdate(
      {
        _id: req.params.todoId,
      },
      {
        $set: udpateData,
      },
      { upsert: true }
    );
    res.json({ status: true, data: changePost });
  } catch (err) {
    res.json({ status: false, message: err });
  }
});

//ADD TODO
router.post("/upload", (req,res) => {
     try {   
    const file = new Todo({
        title:req.body.title,
        discription:req.body.discription,
        users: req.body.user_id,
        status:req.body.status 
       });
       file.save().then(()=>{
         res.status(200).json({ status: true, data: file });
       })
    }
   catch (err) {
    res.status(400).json({ status: false, message: err });
  }
})

//DELETE THE TODO BY ID
router.delete('/delete/:todoId',async (req,res)=>{
    console.log(req.params.todoId)
    try{
        const removePost = await Todo.remove({
            _id:req.params.todoId
        });
        res.status(200).json({ status: true,data:removePost});
       }
   catch (err) {
    res.status(400).json({ status: false, message: err });
  }
});

module.exports = router;
