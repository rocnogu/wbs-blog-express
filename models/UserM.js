import mongoose from "mongoose";
import bcrypt from "bcrypt";
const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema(
    {
        Avatar: {type: String, default: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"},
        email: {  type:String, required:true, unique: true},
        name:  { type: String, required: true, unique: true },
        Password: {index: true, type:String, required: true },
        First_Name: { type: String },
        Last_Name: { type: String },
        Location: { type: String },
        Gender: { type: String },
        Bio: { type: String},
        Age: { type: Number },
        Website:{type: String},
        primaryContact: {index: true, type:String, enum : 'email', default: 'email'},
        emailConfirmed: {index: true, type:Boolean, default: false},
        isOnline: {type: Boolean, required: false, default: false},
        isDeleted: {type: Boolean, required: true, default: false},
        Role: {index: true, required:true, type:String, enum : ['user', 'admin'], default: 'user'},
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
