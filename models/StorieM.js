import mongoose from "mongoose";
//  Schema
const { Schema } = mongoose;
const StorieSchema = new Schema(
  {
    Storie_Picture: { type: String, default:"https://i.ibb.co/7vtdj63/default-recipe-img.jpg"},
    Storie_Title: { type: String, required: true},
    Storie_Video: { type: String, required: true},
    Storie_Text: { type: String, required: true},
    Storie_Sub_Title: { type: String},
    created_by: { type: String},
    updated_by: { type: String},

    Storie_Tags: { type: Schema.Types.Mixed},
    
    Storie_isDeleted: {type: Boolean, default: false}
  },
  { timestamps: true }
);
//    model
const Storie = mongoose.model("Storie", StorieSchema);
// make new storie
const storie = new Storie({});
// timestamp save
//  export
export default mongoose.models.Storie || mongoose.model("Storie", StorieSchema);
