// import mongoose, {Schema}from "mongoose";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";


// const userSchema = new Schema({

//  username:{

//     type :String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     trim : true,
//     index:true,


//  },

//  email: {

//     type :String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     trim : true,
//     index:true,

//  },


//  fullname:{

//     type :String,
//     required: true,
//     lowercase: true,
//     trim : true,
//     index:true,

//  },

//  avatar:{

//     type :String,
//     required: true,
//     unique: true,


//  },

//  CoverImage:{

//     type :String,
  

//  },

//  watchHistory:{

//     type: Schema.Types.ObjectId,
//     ref:"Video"
//  },

//  password:{

//     type:String,
//     required:[true, "password is requires=d"],
//  },


//  refreshToken:{
//     type:String
//  }















// }, 
// {timestamps:true})



// userSchema.pre("save",  async function (next){
   
//    if(this.isModified("password")){
//       return next()
//    }
   
   
//    this.password= await bcrypt.hash(this.password, 8)


//    next()


//    userSchema.methods.isPasswordCorrect = async function (password) {

//      return await bcrypt.compare(password, this.password)
      
//    }


// userSchema.methods.generateAccessToken = function(){
//    return jwt.sign({
//       _id: this._id,
//       email: this.email,
//       username: this.username,
//       fullname : this.fullname
//    }, process.env.ACCESS_TOKEN_SECRET,{
//       expiresIn: process.env.ACCESS_TOKEN_EXPIRY
//    })
// }


// userSchema.methods.generateRefressToken = function(){

//    return jwt.sign({
//       _id: this._id,
//       email: this.email,
//       username: this.username,
//       fullname : this.fullname
//    }, process.env.REFRESS_TOKEN_SECRET,{
//       expiresIn: process.env.REFRESS_TOKEN_EXPIRY
//    }) 
// }
// }


// )





// export const User = mongoose.model("User", userSchema )




import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    fullname: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    avatar: {
      type: String,
      required: true,
      unique: true,
    },

    CoverImage: {
      type: String,
    },

    watchHistory: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },

    password: {
      type: String,
      required: [true, "password is required"],
    },

    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// ✅ Corrected Password Hashing in `pre("save")`
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Fix: Ensuring password is hashed only when modified

  this.password = await bcrypt.hash(this.password, 8);
  next();
});

// ✅ Corrected Password Verification Method
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// ✅ Corrected Access Token Generation
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// ✅ Corrected Refresh Token Generation
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export const User = mongoose.model("User", userSchema);
