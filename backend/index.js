require("dotenv").config();

mongoose.connect(process.env.MONGO_URI);
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const upload = require("./multer");

const fs = require("fs");
const path = require("path");

const { authenticationToken } = require("./utilities");

const User = require("./models/user.model");
const TravelStory = require("./models/travelStory.model");

// mongoose.connect(config.connectionString);

const app = express();
app.use(express.json());

app.use(cors({ origin: "*" }));

// Create Account
app.post("/create-account", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ error: true, message: "All fields are required" });
    }

    const isUser = await User.findOne({ email });
    if (isUser) {
      return res
        .status(400)
        .json({ error: true, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fullName, email, password: hashedPassword });
    await user.save();

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "72h" }
    );

    return res.status(201).json({
      error: false,
      user: { fullName: user.fullName, email: user.email },
      accessToken,
      message: "Registration successful",
    });
  } catch (err) {
    console.error("Error during registration:", err);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

//Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "72h" }
    );

    return res.json({
      error: false,
      message: "Login successful",
      user: { fullName: user.fullName, email: user.email },
      accessToken,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

// Get User
app.get("/get-user", authenticationToken, async (req, res) => {
  const { userId } = req.user;
  const isUser = await User.findOne({ _id: userId });

  if (!isUser) {
    return res.sendStatus(401);
  }
  return res.json({
    user: isUser,
    message: "",
  });
});

// Route to handle image upload
app.post("/image-upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: true,
        message: "No image uploaded",
      });
    }

    const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;

    res.status(201).json({ imageUrl });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});

// Delete an image from uploads folder
app.delete("/delete-image", async (req, res) => {
  const { imageUrl } = req.query;

  if (!imageUrl) {
    return res
      .status(400)
      .json({ error: true, message: "imageUrl parameter is required" });
  }

  try {
    // ✅ Corrected: Use "=" sign
    const filename = path.basename(imageUrl);

    // Define the full file path
    const filePath = path.join(__dirname, "uploads", filename);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
      // Delete the file
      fs.unlinkSync(filePath);
      res.status(200).json({ message: "Image deleted successfully" });
    } else {
      res.status(404).json({ error: true, message: "Image not found" });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});

//Serve static files from the uploads and assets directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

//Add Travel Story
app.post("/add-travel-story", authenticationToken, async (req, res) => {
  if (!req.body) {
    return res
      .status(400)
      .json({ error: true, message: "Missing request body" });
  }

  const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
  const { userId } = req.user;

  if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
    return res
      .status(400)
      .json({ error: true, message: "All fields are required" });
  }

  const parsedVisitedDate = new Date(parseInt(visitedDate));

  try {
    const travelStory = new TravelStory({
      title,
      story,
      visitedLocation,
      userId,
      imageUrl,
      visitedDate: parsedVisitedDate,
    });

    await travelStory.save();

    return res.status(201).json({
      story: travelStory,
      message: "Added Successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
});

//Get All Travel Stories
app.get("/get-all-stories", authenticationToken, async (req, res) => {
  const { userId } = req.user;
  try {
    const travelStories = await TravelStory.find({
      userId: userId,
    }).sort({
      isFavourite: -1,
    });
    res.status(200).json({
      stories: travelStories,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});
// Serve static images from "uploads" folder
app.use("/uploads", express.static("uploads"));

// Edit Travel Story
app.put("/edit-story/:id", authenticationToken, async (req, res) => {
  const { id } = req.params;
  const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
  const { userId } = req.user;

  // Validate required fields
  if (!title || !story || !visitedLocation || !visitedDate) {
    return res
      .status(400)
      .json({ error: true, message: "All fields are required" });
  }

  try {
    // Convert visitedDate to Date object
    const parsedVisitedDate = new Date(parseInt(visitedDate));
    if (isNaN(parsedVisitedDate.getTime())) {
      return res.status(400).json({
        error: true,
        message: "Invalid visitedDate",
      });
    }

    // Find and authorize
    const travelStory = await TravelStory.findOne({ _id: id, userId });
    if (!travelStory) {
      return res.status(404).json({
        error: true,
        message: "Travel Story not found or unauthorized",
      });
    }

    // Placeholder fallback if imageUrl is empty or null
    const placeholderImgUrl = `http://localhost:8000/assets/placeholder.png`;

    // Update fields
    travelStory.title = title;
    travelStory.story = story;
    travelStory.visitedLocation = visitedLocation;
   
travelStory.imageUrl = imageUrl && imageUrl.trim() !== "" ? imageUrl : placeholderImgUrl;
    travelStory.visitedDate = parsedVisitedDate;

    await travelStory.save();

    res.status(200).json({
      story: travelStory,
      message: "Update successful",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});

// Delete a travel Story
app.delete("/delete-story/:id", authenticationToken, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    // Find and authorize
    const travelStory = await TravelStory.findOne({ _id: id, userId });
    if (!travelStory) {
      return res
        .status(404)
        .json({ error: true, message: "Travel story not found" });
    }

    // Delete the travel story from DB
    await travelStory.deleteOne();

    // Extract and delete image file
    const imageUrl = travelStory.imageUrl;
    const filename = path.basename(imageUrl);
    const filePath = path.join(__dirname, "uploads", filename);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Failed to delete image file:", err.message);
        // Still respond with success
      }
    });

    res.status(200).json({ message: "Travel story deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Update isFavourite
app.put("/update-is-favourite/:id", authenticationToken, async (req, res) => {
  const { id } = req.params;
  const { isFavourite } = req.body;
  const { userId } = req.user;

  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

    if (!travelStory) {
      return res
        .status(404)
        .json({ error: true, message: "Travel story not found" });
    }

    travelStory.isFavourite = isFavourite;

    await travelStory.save();

    res.status(200).json({
      story: travelStory,
      message: "Update successful",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});

// Search travel stories
app.get("/search", authenticationToken, async (req, res) => {
  const { query } = req.query;
  const { userId } = req.user;

  if (!query) {
    return res.status(404).json({
      error: true,
      message: "Query is required",
    });
  }

  try {
    const searchResults = await TravelStory.find({
      userId: userId,
      $or: [
        {
          title: {
            $regex: query,
            $options: "i",
          },
        },
        {
          story: {
            $regex: query,
            $options: "i",
          },
        },
        {
          visitedLocation: {
            $elemMatch: { $regex: query, $options: "i" },
          },
        },
      ],
    }).sort({ isFavourite: -1 });

    res.status(200).json({
      stories: searchResults,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});

// Filter travel stories by date range
// app.get("/travel-stories/filter", authenticationToken, async (req, res) => {
//   const { startDate, endDate } = req.query;
//   const { userId } = req.user;

//   if (!startDate || !endDate) {
//     return res
//       .status(400)
//       .json({
//         error: true,
//         message: "Both startDate and endDate are required",
//       });
//   }

//   try {
//     // Convert startDate and endDate from milliseconds to Date objects

//     const start = new Date(startDate);
//     start.setHours(0, 0, 0, 0); // Start of day

//     const end = new Date(endDate);
//     end.setHours(23, 59, 59, 999); // End of day

//     //find travel stories taht belongs to the authenticated user and fall within the data range

//     const filteredStories = await TravelStory.find({
//       userId: userId,
//       visitedDate: {
//         $gte: start,
//         $lte: end,
//       },
//     }).sort({ isFavourite: -1 });

//     res.status(200).json({ stories: filteredStories });
//   } catch (error) {
//     res.status(500).json({ error: true, message: error.message });
//   }
// });
app.get("/travel-stories/filter", authenticationToken, async (req, res) => {
  const { startDate, endDate } = req.query;
  const { userId } = req.user;

  if (!startDate || !endDate) {
    return res.status(400).json({
      error: true,
      message: "Both startDate and endDate are required",
    });
  }

  const start = new Date(parseInt(startDate));
  const end = new Date(parseInt(endDate));

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({
      error: true,
      message: "Invalid startDate or endDate",
    });
  }

  // Normalize to full day
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  try {
    const filteredStories = await TravelStory.find({
      userId: userId,
      visitedDate: {
        $gte: start,
        $lte: end,
      },
    }).sort({ isFavourite: -1 });

    res.status(200).json({ stories: filteredStories });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// app.listen(8000, () => {
//   console.log("Server running on http://localhost:8000");
// });

module.exports = app;
