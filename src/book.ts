import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate";

let bookSchema=new mongoose.Schema({
    title:{type:String,required:true },
    author:{type: String, required: true},
    price:{type:Number,required:false},
    available:{type:Boolean,required:true,default:false},
    publishingDate:{type:Date, required:true, default: new
    Date()}
    });

    bookSchema.plugin(mongoosePaginate);
    const Book=mongoose.model("Book",bookSchema);
    export default Book; 
