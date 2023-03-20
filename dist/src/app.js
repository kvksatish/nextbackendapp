"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../Models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../Config/db");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.post('/dashboard', (req, res) => {
    var _a, _b;
    const token = (_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1];
    jsonwebtoken_1.default.verify(token, 'secret', function (err, decoded) {
        if (err) {
            res.send("Please login");
        }
        else {
            res.send(decoded);
        }
    });
});
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield User_1.default.findOne({ email });
    const hash = user === null || user === void 0 ? void 0 : user.password;
    bcrypt_1.default.compare(password, hash, function (err, result) {
        if (result) {
            const token = jsonwebtoken_1.default.sign({ email }, 'secret');
            console.log(token);
            res.send({ "msg": "Login success", "token": token });
        }
        else {
            res.send("Login Failed");
        }
    });
}));
app.post('/signup', (req, res) => {
    console.log(req.body);
    const { email, password, name } = req.body;
    console.log(email, password, name);
    // Check if the email is valid
    if (!validateEmail(email)) {
        console.log("invalidemail");
        res.status(400).json({ message: 'Invalid email' });
        return;
    }
    // Check if the password meets the requirements
    if (!validatePassword(password)) {
        console.log("invalid pass");
        res.status(400).json({ message: 'Invalid password' });
        return;
    }
    bcrypt_1.default.hash(password, 6).then(function (hash) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(hash);
            const user = new User_1.default({ email, password: hash, name });
            yield user.save();
            res.send("Signup Successful");
        });
    }).catch((err) => {
        if (err) {
            console.log(err);
            res.json({ message: 'Something went wrong, please try again later' });
        }
    });
});
const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    console.log(re.test(email));
    return re.test(email);
};
// Validate password
const validatePassword = (password) => {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    console.log(re.test(password));
    return re.test(password);
};
app.listen(7500, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.connection;
        console.log("connected");
    }
    catch (err) {
        console.log("not connected");
        console.log(err);
    }
    console.log("linstening to port 7500");
    console.log(process.env.NAME);
    //console.log(process.env.MONGO_URL)
}));
//# sourceMappingURL=app.js.map