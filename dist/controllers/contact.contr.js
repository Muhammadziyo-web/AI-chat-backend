var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { JWT } from '../utils/jwt';
// import userModel from '../schemas/user.schema.js';
import ContactModel from '../schemas/contact.schema.js';
class ContactController {
    static getContacts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const contacts = yield ContactModel.find();
                res.status(200).send({
                    success: true,
                    data: contacts
                });
            }
            catch (error) {
                console.log('error.message :', error.message);
                res.status(500).send({ success: false, error: error.message });
            }
        });
    }
    static getContactById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let contactId = req.params.id;
                const contacts = yield ContactModel.findById(contactId);
                res.status(200).send({
                    success: true,
                    data: contacts
                });
            }
            catch (error) {
                console.log('error.message :', error.message);
                res.status(500).send({ success: false, error: error.message });
            }
        });
    }
    static createContact(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let token = req.headers.token;
                let id = JWT.VERIFY(token).id;
                if (!id) {
                    throw new Error("Invalid Id");
                }
                const { fullName, email, phone, content, userId } = req.body;
                const newContactData = {
                    fullName,
                    email,
                    phone,
                    content,
                    userId,
                };
                const newContact = new ContactModel(newContactData);
                const savedContact = yield newContact.save();
                // Userning posts uchun 
                // userModel.findByIdAndUpdate(id, {
                // $push: {
                // posts:savedContact._id
                // }
                // })
                // /////////////////////////////////////////////////
                res.status(201).send({
                    success: true,
                    data: savedContact
                });
            }
            catch (error) {
                console.log('error.message :', error.message);
                res.status(500).json({ success: false, error: error.message });
            }
        });
    }
}
export default ContactController;
