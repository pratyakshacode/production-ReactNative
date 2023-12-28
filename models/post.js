import mongoose from "mongoose";

const postSchema = mongoose.Schema({

    title: {
        type:String,
        required: [true, "Title is required"],

    }, 
    description : {
        type: String, 
        required: [true, "Please add post description"]
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
}, {timestamps: true})

export default mongoose.model("Post", postSchema);