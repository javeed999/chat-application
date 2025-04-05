const express=require("express")
const router=express.Router()
const {accessChat,fetchChat,createGroupChat,renameGroup,removeGroup,addToGroup}=require("../controllers/chatControllers")
const {protect} =require("../middleware/authMiddleware")
router.route("/").post(protect,accessChat)
router.route("/").get(protect,fetchChat)
router.route("/group").post(protect,createGroupChat)
router.route("/rename").put(protect,renameGroup)
router.route("/groupremove").put(protect,removeGroup)
router.route("/groupadd").put(protect,addToGroup)


module.exports=router