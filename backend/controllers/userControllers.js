const asyncHandler=require("express-async-handler")
const User=require("../models/USerModel")
const generateToken=require("../config/generateToken")
const bcrypt=require("bcryptjs")
const registerUser=asyncHandler(async (req,res)=>{
    const {name,email,password,pic}=req.body
    if(!name || !email || !password)
    {
        res.status(400)
        throw new Error("Please Enter all the fields")
    }
    const userExists=await User.findOne({email})
    if(userExists)
    {
            res.status(400);
      throw new Error("User Already Exists")
    }
    else 
    {
        const hashedPassword=await bcrypt.hash(password,12)
        const user=await User.create({
            name,
            email,
            password:hashedPassword,
            pic,
        })
        if(user)
        {
            res.status(201).json({
                _id:user.id,
                name:user.name,
                email:user.email,
                pic:user.pic,
                token:generateToken(user._id),
            })
        }
        else
        {
            throw new Error("Failed to Create")
        }
    }
})

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find a single user
    const user = await User.findOne({ email });

    if (!user) {
        res.status(401); // 401 for unauthorized
        throw new Error("Invalid Email or Password");
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid Email or Password");
    }
});


const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            // { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
  
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
  });
module.exports={registerUser,authUser,allUsers}