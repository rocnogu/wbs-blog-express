import mongoose from "mongoose";

//  Schema
const { Schema } = mongoose;
// RecipeSchema
const RecipeSchema = new Schema(
  {
    Recipe_Picture: { type: String, default:"https://i.ibb.co/7vtdj63/default-recipe-img.jpg"},
    Recipe_Difficulty: { type: String, default:"Easy"},
    Recipe_Title: { type: String, default:"Recipe_Title"},
    Recipe_Sub_Title: { type: String},
    updated_by: { type: String},
    created_by: { type: String},

    Recipe_Preparation_Time: { type: Number, default:"1"},
    Recipe_Cooking_Time: { type: Number, default:"2"},
    Recipe_Serves: { type: Number, default:"3"},

    Recipe_Ingredients: { type: Schema.Types.Mixed},
    Recipe_Method: { type: Schema.Types.Mixed, default:"Recipe_Method"},
    Recipe_Tags: { type: Schema.Types.Mixed},
   
    Recipe_isDeleted: {type: Boolean, default: false}
  },
  { timestamps: true }
  // toDateString()
);
//    model
const Recipe = mongoose.model("Recipe", RecipeSchema);
// make new Recipe
const recipe = new Recipe({});
// timestamp save
//  export
export default mongoose.models.Recipe || mongoose.model("Recipe", RecipeSchema);

