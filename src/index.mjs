import express, { response } from "express";
import router from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "./utils/constant.mjs";
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "Jack the dev",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
  })
);
app.use(router);

app.get("/", (request, response) => {
  console.log(request.session);
  console.log(request.sessionID);
  request.session.visited = true;

  response.cookie("hello", "world", { maxAge: 60000 });
  return response.sendStatus(201);
});

app.post("/api/auth", (request, response) => {
  const {
    body: { username, password },
  } = request;

  const findUser = mockUsers.find((user) => user.username === username);

  if (!findUser) return response.status(401).send({ msg: "BAD CREDENTIALS" });

  if (!findUser.password || findUser.password !== password) {
    return response.status(401).send({ msg: "BAD CREDENTIALS" });
  }

  request.session.user = findUser;
  return response.status(200).send(findUser);
});

app.get("/api/auth/status", (request, response) => {
  return request.session.user
    ? response.status(200).send(request.session.user)
    : response.status(401).send({ msg: "Not Authenticated" });
});

app.post("/api/cart", (request, response) => {
  if (!request.session.user) return response.sendStatus(401);

  const { body: item } = request;

  const {cart} = request.session;
  if(cart) cart.push(item);
  else request.session.cart  = [item];

  return response.status(201).send(item);
});

app.get("/api/cart", (request, response) => {
  if(!request.session.user) return response.sendStatus(401);
  return response.send(request.session.cart ?? [])
})
app.listen(PORT, () => {
  console.log(`Running on PORT ${PORT}`);
});
