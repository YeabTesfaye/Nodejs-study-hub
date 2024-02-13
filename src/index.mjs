import express from "express";
import router from "./routes/index.mjs";
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(router);

app.get("/", (request,response) => {
  response.cookie("hello", "world", {maxAge : 6000})
  return response.sendStatus(200);
})


app.listen(PORT, () => {
  console.log(`Running on PORT ${PORT}`);
});
