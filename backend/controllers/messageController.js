import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import cloudinary from "../lib/cloudinary.js";

// Get all users except the logged in user
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select(
      "-password"
    );

    // Count number of messages not seen
    const unSeenMessages = {};
    const promises = users.map(async (user) => {
      const messages = await Message.find({
        sender: req.user._id,
        receiver: user._id,
        seen: false,
      });

      if (messages.length > 0) {
        unSeenMessages[user._id] = messages.length;
      }
    });
    await Promise.all(promises);

    res.status(200).json({ success: true, users: users, unSeenMessages });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all messages between two users
export const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: req.params.id },
        { sender: req.params.id, receiver: req.user._id },
      ],
    });

    // Mark messages as seen
    await Message.updateMany(
      {
        $or: [
          { sender: req.user._id, receiver: req.params.id },
          { sender: req.params.id, receiver: req.user._id },
        ],
      },
      { seen: true }
    );

    res.status(200).json({ success: true, messages: messages });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// API to mark message as seen using message id
export const markMessageAsSeen = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, {
      seen: true,
    });

    res.status(200).json({ success: true, message: message });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// API to send a message to a user
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    // Create a new message
    const newMessage = await Message.create({
      sender: req.user._id,
      receiver: req.params.id,
      text,
      image: imageUrl,
    });

    res.status(200).json({ success: true, message: newMessage });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
