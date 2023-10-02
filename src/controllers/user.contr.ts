import { Request, Response } from "express";
import sha256 from "sha256";
import userSchema from "../schemas/user.schema.js";
import { JWT } from "../utils/jwt.js";
export default {
  async get(req: Request, res: Response) {
    try { 
      const token = req.headers.token as string;
      const userId = JWT.VERIFY(token).id;
      const user = await userSchema.findById(userId)
      
        return res.status(200).json(user);
    
    } catch (error:any) {
        res.status(500).json({message:error.message});
    }
  },
  async post(req: Request, res: Response) {
    try {
      let {fullName, email, password} = req.body;
      if (!email || !password || !fullName)
        return res.status(400).json({ message: "Invalid data" });
      
      let user = new userSchema({
        fullName,
        email,
        password: sha256(password),
       
      });
      await user.save();
      res.status(201).json({
        token: JWT.SIGN({
          id: user._id,
        }),
        data: user,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  async put(req: Request, res: Response) {},
  async login(req: Request, res: Response) {
     const { email, password } = req.body;

     try {
       // Find the user by email
       const user = await userSchema.findOne({ email });

       if (!user) {
         return res.status(401).json({ message: "Invalid email or password" });
       }

       // Compare the provided password with the hashed password in the database
       const passwordMatch = await sha256(password) ==  user.password;

       if (!passwordMatch) {
         return res.status(401).json({ message: "Invalid email or password" });
       }

       // Generate a JWT token for the user
       const token:any = JWT.SIGN({id:user._id})

       res.status(200).json({ token,data:user });
     } catch (error) {
       console.error(error);
       res.status(500).json({ message: "Server error" });
     }
  },
  
};
