import express, { response } from "express";
import router from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "./utils/constant.mjs";
import passport from "passport";
import "./strategies/local-strategy.mjs";
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

app.use(passport.initialize());
app.use(passport.session());

app.use(router);

app.post("/api/auth", passport.authenticate("local"), (request, response) => {
  return response.sendStatus(200);
});
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
  console.log(request.user);
  return request.user ? response.send(request.user) : response.sendStatus(401);
});

app.post("/api/cart", (request, response) => {
  if (!request.session.user) return response.sendStatus(401);

  const { body: item } = request;

  const { cart } = request.session;
  if (cart) cart.push(item);
  else request.session.cart = [item];

  return response.status(201).send(item);
});

app.get("/api/cart", (request, response) => {
  if (!request.session.user) return response.sendStatus(401);
  return response.send(request.session.cart ?? []);
});
app.listen(PORT, () => {
  console.log(`Running on PORT ${PORT}`);
});
