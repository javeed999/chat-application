const asyncHandler=require("express-async-handler")
const Message=require("../models/MessageModel")
const User=require("../models/USerModel")
const chat = require("../models/ChatModels")
const mongoose=require("mongoose")
const sendMessage=asyncHandler(async(req,res)=>{
    const {content,chatId}=req.body 
    if(!content || !chatId)
    {
        console.log("Invalid data passed into request")
        return res.sendStatus(400)
    }
    var newMessage={
        sender:req.user._id,
        content:content,
        chat:chatId
    }
    try {
        var message =await Message.create(newMessage)
        message=await message.populate("sender","name pic")
        message=await message.populate("chat")
        message=await User.populate(message,{
            path:"chat.users",
            select:"name pic email",
        });
        await  chat.findByIdAndUpdate(req.body.chatId,
            {
                latestMessage:message,
            }
        )
        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }

})

const allMessages = asyncHandler(async (req, res) => {
    try{
        let messages=await await Message.find({chat:req.params.chatId})
        .populate("sender","name pic email")
        .populate("chat")
      messages=await User.populate(messages,
        {
          path:"chat.users",
          select:"name pic email"
        }
      )
        res.json(messages)
      }
    catch(err)
   {
    res.status(404)

    throw new Error(err)
   }


  });




module.exports={sendMessage,allMessages}