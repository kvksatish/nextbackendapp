import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  age: number;
}

let UserModel: Model<IUser>;

try {
  UserModel = mongoose.model<IUser>('User');
} catch {
  const UserSchema: Schema = new mongoose.Schema({
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
  UserModel = mongoose.model<IUser>('User', UserSchema);
}

export default UserModel;
