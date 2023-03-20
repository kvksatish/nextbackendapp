import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import UserModel from './Models/User';
import jwt from 'jsonwebtoken';
import { connection } from './Config/db';
import dotenv from 'dotenv';
import cors from 'cors'

dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.post('/dashboard', (req: Request, res: Response) => {
  const token = req.headers?.authorization?.split(" ")[1];
  jwt.verify(token as string, 'secret', function (err:any, decoded:any) {
    if (err) {
      res.send("Please login");
    } else {
      res.send(decoded);
    }
  });
});

app.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  const hash = user?.password;

  bcrypt.compare(password, hash as string, function (err:any, result:any) {
    if (result) {
      const token = jwt.sign({ email }, 'secret');
      console.log(token);
      res.send({ "msg": "Login success", "token": token });
    } else {
      res.send("Login Failed");
    }
  });
});



app.post('/signup', (req: Request, res: Response) => {
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

  bcrypt.hash(password, 6).then(async function (hash:string) {
      console.log(hash);
      const user = new UserModel({ email, password: hash, name });
      await user.save();

      res.send("Signup Successful");
  }).catch((err:any) => {
      if (err) {
          console.log(err);
          res.json({ message: 'Something went wrong, please try again later' });
      }
  });
});



const validateEmail = (email: string): boolean => {
  const re = /\S+@\S+\.\S+/;
  console.log(re.test(email))
  return re.test(email);
}

// Validate password
const validatePassword = (password: string): boolean => {
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  console.log(re.test(password))
  return re.test(password);
}


app.listen(7500, async () => {
  try {
      await connection
      console.log("connected")
  }
  catch (err) {
      console.log("not connected")
      console.log(err)
  }
  console.log("linstening to port 7500")
  console.log(process.env.NAME)
  //console.log(process.env.MONGO_URL)
})