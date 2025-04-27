import Message from "../models/Message.js";

export const getUsersForSidebar = async (req, res) => {
    try{
        const userId = req.user._id; // Assuming you have the user ID in req.user
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password"); // Exclude the logged-in user and password field
        res.status(200).json(filteredUsers);
    }catch(err){
        console.log("Error fetching users for sidebar:", err);
        res.status(500).json({message: "Internal server error"});
    }

}

export const getMessages = async (req, res) => {
    try{
        const { id:userToChatId } = req.params; 
        const myId = req.user._id; 
        const messages = await Message.find({
            $or:[
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        }); 
        res.status(200).json(messages);
    }catch(err){
        console.log("Error fetching messages:", err);
        res.status(500).json({message: "Internal server error"});
    }
}

export const sendMessage = async (req, res) => {
    try{
        const {text,image} = req.body;
        const { id:receiverId } = req.body; 
        const senderId = req.user._id;
        
        let imageUrl ;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url; 
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl, 
        });
        await newMessage.save(); 
        res.status(201).json(newMessage); 
    }catch(err){
        console.log("Error sending message:", err);
        res.status(500).json({message: "Internal server error"});
    }
};