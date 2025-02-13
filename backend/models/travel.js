const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const travelSchema=new Schema({
    title: {type: String, required: true},
    details: {type: String, required: true},
    locationsVisited: {type: [String], default: []},
    userId: {type: Schema.Types.ObjectId, ref:"User", required: true },
    createdOn: {type: Date, default: Date.now},
    imageUrl: {type: String, required:true},
    dateVisited: {type: Date, required: true},
});

module.exports=mongoose.model("Travel",travelSchema);