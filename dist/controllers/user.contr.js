var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import sha256 from "sha256";
import userSchema from "../schemas/user.schema.js";
import { JWT } from "../utils/jwt.js";
export default {
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.token;
                const userId = JWT.VERIFY(token).id;
                const user = yield userSchema.findById(userId);
                return res.status(200).json(user);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    },
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { fullName, email, password } = req.body;
                if (!email || !password || !fullName)
                    return res.status(400).json({ message: "Invalid data" });
                let user = new userSchema({
                    fullName,
                    email,
                    password: sha256(password),
                });
                yield user.save();
                res.status(201).json({
                    token: JWT.SIGN({
                        id: user._id,
                    }),
                    data: user,
                });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    },
    put(req, res) {
        return __awaiter(this, void 0, void 0, function* () { });
    },
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                // Find the user by email
                const user = yield userSchema.findOne({ email });
                if (!user) {
                    return res.status(401).json({ message: "Invalid email or password" });
                }
                // Compare the provided password with the hashed password in the database
                const passwordMatch = (yield sha256(password)) == user.password;
                if (!passwordMatch) {
                    return res.status(401).json({ message: "Invalid email or password" });
                }
                // Generate a JWT token for the user
                const token = JWT.SIGN({ id: user._id });
                res.status(200).json({ token, data: user });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: "Server error" });
            }
        });
    },
};
