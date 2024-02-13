import { Router } from "express";
import userRouter from "./users.mjs";
import productRouter from './products.mjs';
// import cookieParser from 'cookie-parser'
const router = Router();

router.use(userRouter);
router.use(productRouter);
export default  router;