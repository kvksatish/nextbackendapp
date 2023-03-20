"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
let UserModel;
try {
    UserModel = mongoose_1.default.model('User');
}
catch (_a) {
    const UserSchema = new mongoose_1.default.Schema({
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    });
    UserModel = mongoose_1.default.model('User', UserSchema);
}
exports.default = UserModel;
//# sourceMappingURL=User.js.map