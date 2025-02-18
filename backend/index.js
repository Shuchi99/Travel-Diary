require("dotenv").config();
//const config = require("./config.json");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const Travel = require("./models/travel");
const upload = require("./multer");
const fs = require("fs");
const path = require("path");
const {authenticateToken} = require("./utilities");
const { error } = require("console");

// mongoose.connect(config.connectionString);
mongoose.connect(process.env.CONNECTION_STRING);

const app = express();
app.use(express.json());
app.use(cors({origin: "*"}));

app.post("/create-account",async (req, res) => {
    const {fullName, email, password}=req.body;

    if (!fullName || !email || !password){
        return res.status(400).json({error: true, message: "Required fields must be filled"});
    }

    const isUser = await User.findOne({email});
    if (isUser){
        return res.status(400).json({error: true, message: "User already exists"});  
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        fullName,email,password:hashedPassword,
    });
    await user.save();
    const accessToken=jwt.sign(
        {userId: user._id},
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "72h",
        }
    );

    return res.status(201).json({error: false, user: {fullName: user.fullName, email: user.email},
    accessToken,
    message: "Registration Successful",
  });  

});

app.post("/login",async (req, res) => {
    const {email, password}=req.body;

    if(!email || !password){
        return res.status(400).json({message: "Email and Password are required"});
    }

    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({message: "User not found"});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid){
        return res.status(400).json({message: "Password is incorrect"});
    }

    const accessToken = jwt.sign(
        {userId: user._id},
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "72h",}
    );

    return res.json({
        error: false,
        message: "Login successful",
        user: { fullName: user.fullName, email: user.email},
        accessToken,
    });
});

app.get("/get-user", authenticateToken, async (req, res) => {
    const {userId} = req.user
    const isUser = await User.findOne({_id: userId});

    if(!isUser){
        return res.sendStatus(401);
    }

    return res.json({
        user: isUser,
        message: "",
    });
});

app.post("/add-travel", authenticateToken, async (req, res) => {
    const {title, details, locationsVisited, imageUrl, dateVisited} = req.body;
    const {userId} = req.user;

    if(!title || !details || !locationsVisited || !imageUrl || !dateVisited){
        return res.status(400).json({error: true, message: "Some of the fields are missing"});
    }

    const parsedateVisited = new Date(parseInt(dateVisited));

    try{
        const travel=new Travel({
            title, details, locationsVisited, userId, imageUrl, dateVisited: parsedateVisited,
        });
    
        await travel.save();
        res.status(201).json({details: travel, message: "Added Successfully"});
    } catch(error){
        res.status(400).json({error: true, message: error.message});
    }
});

app.get("/get-all-travels", authenticateToken, async (req, res) => {
    const{userId} =req.user;

    try{
        const travels=await Travel.find({userId: userId}).sort({dateVisited:-1});
        res.status(200).json({ details: travels});
    } catch(error){
        res.status(500).json({error: true, message: error.message});
    }
});

app.post("/image-upload", upload.single("image"), async (req, res) => {
    try{
        if (!req.file){
            return res.status(400).json({error: true, message: "Please Upload an Image"});
        }

        const imageUrl = `https://travel-diary-backend-xgx6.onrender.com/uploads/${req.file.filename}`;
        res.status(200).json({imageUrl});
    } catch(error){
        res.status(500).json({error: true, message: error.message});
    }
});

app.delete("/delete-image",async(req, res) => {
    const {imageUrl} = req.query;

    if(!imageUrl){
        return res.status(400).json({error: true, message: "imageUrl is required"});
    }

    try{
        const filename = path.basename(imageUrl);
        const filePath = path.join(__dirname,'uploads', filename);

        if (fs.existsSync(filePath)){
            fs.unlinkSync(filePath);
            res.status(200).json({message: "image deletion successfull"});
        }
        else{
            res.status(200).json({error: true, message: "Image not found"});
        }
    } catch(error){
        res.status(500).json({error: true, message: error.message});
    }
});

app.put("/edit-travel/:id",authenticateToken,async(req, res) => {
    const {id} = req.params;
    const {title, details, locationsVisited, imageUrl, dateVisited} = req.body;
    const {userId} = req.user;

    if(!title || !details || !locationsVisited || !dateVisited){
        return res.status(400).json({error: true, message: "Some of the fields are missing"});
    }

    const parsedateVisited = new Date(parseInt(dateVisited));
    try{
        const travel = await Travel.findOne({_id:id,userId: userId});
        if(!travel){
            return res.status(404).json({error: true, message: "Travel data not found"});
        }
        const placeholderImgUrl = `https://travel-diary-backend-xgx6.onrender.com/assets/placeholder.jpg`;
        travel.title = title;
        travel.details = details;
        travel.locationsVisited = locationsVisited;
        travel.imageUrl = imageUrl || placeholderImgUrl;
        travel.dateVisited = dateVisited;

        await travel.save();
        res.status(200).json({ details: travel, message:"update Successful"});
    } catch(error){
        res.status(500).json({error: true, message: error.message});
    }
});

app.delete("/delete-travel/:id",authenticateToken, async(req, res) => {
    const{id}=req.params;
    const{userId}=req.user;

    try{
        const travel = await Travel.findOne({_id:id,userId: userId});
        if(!travel){
                return res.status(404).json({error: true, message: "Travel data not found"});
            }
        
        await travel.deleteOne({_id:id, userId:userId});

        const imageUrl = travel.imageUrl;
        const filename = path.basename(imageUrl);

        const filePath = path.join(__dirname,'uploads', filename);

        fs.unlink(filePath, (error)=>{
            if (error){
                console.error("Failed to delete image file: ",error);
            }
        });
        res.status(200).json({message: "Travel data deleted!"});
    } catch(error){
        res.status(500).json({error: true, message: error.message});
    }
});

app.get("/search-travel",authenticateToken, async(req, res) => {
    const {query} = req.query;
    const {userId} = req.user;

    if(!query){
        return res.status(404).json({error: true, message: "query is required"});
    }
    try{
        const searchResults = await Travel.find({
            userId: userId,
            $or: [
                {title: {$regex: query, $options: "i"}},
                {details: {$regex: query, $options: "i"}},
                {locationsVisited: {$regex: query, $options: "i"}},
            ],
        }).sort({dateVisited: -1});

        res.status(200).json({details: searchResults});
    } catch(error){
        res.status(500).json({error: true, message: error.message});
    }
});

app.get("/travel/filter",authenticateToken, async(req, res) => {
    const {startDate,endDate} = req.query;
    const {userId} = req.user;

    try{
        const start = new Date(parseInt(startDate));
        const end = new Date(parseInt(endDate));

        const filteredStories = await Travel.find({
            userId: userId,
            dateVisited: {$gte: start, $lte: end},
        }).sort({dateVisited: -1});

        res.status(200).json({details: filteredStories});
    } catch(error){
        res.status(500).json({error: true, message: error.message});
    }
});

app.use("/uploads", express.static(path.join(__dirname,"uploads")));
app.use("/assets", express.static(path.join(__dirname,"assets")));

app.listen(8000);
module.exports = app;
