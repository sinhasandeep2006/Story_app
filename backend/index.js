require("dotenv").config()
const config = require("./config.json")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const express = require("express")
const cors = require("cors")
const jwt = require('jsonwebtoken')
const User = require("./models/user.model")
const TravelStory = require("./models/travelStory.model")
const { authenticateToken } = require("./utilities")
const fs = require("fs")
const path = require("path")
const upload = require("./multer")
const travelStoryModel = require("./models/travelStory.model")

mongoose.connect(config.connnectionstring)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    next();
});
app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return res.status(400)
            .json({ error: true, message: "All fields are required" })
    }
    const isUser = await User.findOne({
        email
    })
    if (isUser) {
        return res.status(400)
            .json({ error: true, message: "the user exists" })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({
        fullName,
        email,
        password: hashedPassword
    })
    await user.save();
    const accessToken = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "72h",
        }
    )
    return res.status(201)
        .json({
            error: false,
            user: {
                fullName: user.fullName,
                email: user.email
            },
            accessToken,
            message: "Registration Successful",
        })
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(404).json({ message: "Enter your email and password" })
    }
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(400).json({ message: "Oops your are in the danguner" })
    }
    const ispasswordValid = await bcrypt.compare(password, user.password);
    if (!ispasswordValid) {
        return res.status(400).json({ message: "Here you!!!  😒😒 check your notes bro for the password!!!" })
    }
    const accessToken = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "72h"
        }
    )
    return res.json({
        error: false,
        message: "login Successful",
        user: {
            fullName: user.fullName,
            email: user.email
        },
        accessToken,
    })
})

app.get("/get-user", authenticateToken, async (req, res) => {
    const { userId } = req.user;
    const isUser = await User.findOne({ _id: userId });
    if (!isUser) {
        return res.sendStatus(401);
    }
    return res.json({
        user: isUser,
        message: " ",
    })

})
app.post("/image-upload", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: true,
                message: "no image upload"
            })
        }
        const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;
        res.status(200).json({ imageUrl })
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message
        })
    }
})
//delere
app.delete("/delete-image", async (req, res) => {
    const { imageUrl } = req.query;
    if (!imageUrl) {
        return res.status(400)
            .json({
                error: true,
                message: "imageUrl parameter is required"
            })
    }
    try {
        //Extract the filename from the imageUrl
        const filename = path.basename(imageUrl)
        // Define the file path
        const filepath = path.join(__dirname, 'uploads', filename)
        //check if the file exist
        if (fs.existsSync(filepath)) {
            //delte the file formr the uploadfile
            fs.unlinkSync(filepath);
            res.status(200).json({
                message: "Image delted successfully"
            })
        } else {
            res.status(200).json(
                {
                    error: true,
                    message: "Image is not found"
                }
            )
        }
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message
        })
    }
})

app.use("/uploads", express.static(path.join(__dirname, "uploads")))
app.use("/assets", express.static(path.join(__dirname, "assets")))
app.post("/add-travel-story", authenticateToken, async (req, res) => {
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
    const { userId } = req.user;
    //validate Requeired
    if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
        return res.status(400).json({
            error: true,
            message: "all fields are required"
        })
    }
    //convert visited date from the milliseconds to date object
    const parsedVisitedDate = new Date(parseInt(visitedDate));
    try {
        const travalStory = new TravelStory({
            title,
            story,
            visitedLocation,
            userId,
            imageUrl,
            visitedDate: parsedVisitedDate,
        })
        await travalStory.save();
        res.status(200).json({
            story: travalStory,
            message: 'Added Successfully'
        })
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message
        })
    }
})

// get all the travel story
app.get("/get-all-the-travel-story", authenticateToken, async (req, res) => {
    const { userId } = req.user;
    try {
        const travelStories = await TravelStory.find({ userId: userId }).sort({ isFavourite: -1 });
        res.status(200).json({
            stories: travelStories

        })
    } catch (err) {
        res.status(500).json({
            err: true,
            message: err.message
        })
    }
})
app.put("/edit-story/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
    const { userId } = req.user
    if (!title || !story || !visitedLocation || !visitedDate) {
        return res.status(400).json({
            error: true,
            message: "all fields are required"
        })
    }
    //convert visited date from the milliseconds to date object
    const parsedVisitedDate = new Date(parseInt(visitedDate));
    try {
        const travalStory = await TravelStory.findOne({
            _id: id,
            userId: userId
        })
        if (!travalStory) {
            return res.status(404).json({
                error: true,
                message: "Travel story is not found"
            })
        }
        const placeholderImaUrl = `http://localhost:8000/assets/placeholder.png.png`
        travalStory.title = title
        travalStory.story = story
        travalStory.visitedLocation = visitedLocation
        travalStory.imageUrl = imageUrl || placeholderImaUrl
        travalStory.visitedDate = parsedVisitedDate
        await travalStory.save();
        res.status(200).json({
            story: travalStory,
            message: "Update SuccesFul"
        })
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message
        })
    }
})

app.delete("/delete-story/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;
    try {
        const travalStory = await TravelStory.findOne({
            _id: id,
            userId: userId
        })
        if (!travalStory) {
            return res.status(404).json({
                error: true,
                message: "Travel story is not found"
            })
        }
        await travalStory.deleteOne({
            _id: id,
            userId: userId
        })
        const imageUrl = travalStory.imageUrl;
        const filename = path.basename(imageUrl);
        const filePath = path.join(__dirname, 'uploads', filename)
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Failed to delted image file", err)
            }
        })
        res.status(200).json({ message: "Travel story delted successfully" })
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message
        })
    }
})

app.put("/update-is-favourite/:id", authenticateToken, async (req, res) => {
    const {id}=req.params
    const {isFavourite}=req.body;
    const {userId}=req.user
    try {
        const travalStory =await TravelStory.findOne({
            _id:id,
            userId:userId
        })
        if(!travalStory){
            return res.status(404).json({
                error:"Travel story not found sir!!!"
            })
        }
        travalStory.isFavourite=isFavourite;
        await travalStory.save()
        res.status(200).json({
            story:travalStory,
            message:'UpdateSucessfull'
        })
    } catch (err) {
        res.status(400).json({
            err:true,
            message:err.message
        })
    }
})
app.get("/search", authenticateToken, async (req, res) => {
    const {query}=req.query;
    const {userId}=req.user;
    if(!query){
        return res.status(404).json({
            error:true,
            message:"not found!!"
        })
    }
    try {
        const searchResults= await TravelStory.find({
            userId:userId,
            $or:[
               { title: {$regex:query,$options:"i"}},
               {story:{$regex:query,$options:"i"}},
                {visitedLocation:{$regex:query,$options:"i"}}
            ],
        }).sort({isFavourite:-1})
        res.status(200).json({stories:searchResults})
    } catch (error) {
        res.status(500).json({
            error:true,
            message:error.message
        })
    }
})
app.get("/travel-stories/filter", authenticateToken, async (req, res) => {
    const {startDate,endDate}=req.query
    const {userId}=req.user;
    try {
        const start =new Date(parseInt(startDate))
        const end =new Date(parseInt(endDate))
        const filteredStories = await TravelStory.find({
            userId:userId,
            visitedDate:{$gte:start,$lte:end},

        }).sort({isFavourite:-1})
        res.status(200).json({stories:filteredStories})
    } catch (error) {
        res.status(500).json({
            error:true,
            message:error.message
        })
    }
})



app.listen(8000);
module.exports = app; 