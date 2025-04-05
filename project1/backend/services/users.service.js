import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const userService = (password)=>{
  return  bcrypt.hash(password,12)
}

export const compareService = (password,hashedPassword)=>{
    return bcrypt.compare(password,hashedPassword)
}

export const jwtService= (role,SECRET_KEY,expireDate)=>{
   return jwt.sign({
    id:role._id,
    email:role.email
   },SECRET_KEY,{
    expiresIn:expireDate
   })
}