import mongoose from "mongoose";
import bcrypt from "bcrypt";
const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema(
    {
        User_Name:  { type: String, required: true, unique: true },
        User_Email: {  type:String, required:true, unique: true},
        User_Password: {index: true, type:String, required: true },
        User_First_Name: { type: String },
        User_Last_Name: { type: String },
        User_Bio: { type: String},
        User_Pictures: {type: String, default: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"},
        User_Gender: { type: String },
        User_Age: { type: Number },
        User_Location: { type: String },
        User_Website:{type: String},

        primaryContact: {index: true, type:String, enum : 'email', default: 'email'},
        emailConfirmed: {index: true, type:Boolean, default: false},
        isOnline: {type: Boolean, default: false},
        isDeleted: {type: Boolean, default: false},
        Role: {index: true, type:String, enum : ['user', 'admin'], default: 'user'},
    },
    { timestamps: true }
);

UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('Password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.Password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.Password = hash;
            next();
        });
    });
});
     
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    return bcrypt.compare(candidatePassword, this.Password);
};

const User = mongoose.model("User", UserSchema);
export default User;
