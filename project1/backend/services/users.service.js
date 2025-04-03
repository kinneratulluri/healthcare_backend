import bcrypt from "bcrypt";

export const userService = (password)=>{
  return  bcrypt.hash(password,12)
}

export const compareService = (password,hashedPassword)=>{
    return bcrypt.compare(password,hashedPassword)
}
