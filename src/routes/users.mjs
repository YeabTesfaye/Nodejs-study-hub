import { Router } from "express";
import {
  createUserQueryValidationSchema,
  createUserValidationSchema,
} from "../utils/validationSchema.mjs";
import { validationResult, checkSchema, matchedData } from "express-validator";
import { mockUsers } from "../utils/constant.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { hashedPassword } from "../utils/helper.mjs";
const router = Router();

router.get(
  "/api/users",
  checkSchema(createUserQueryValidationSchema),
  (request, response) => {
    const result = validationResult(request);
    // do something with result object
    console.log(result);
    console.log(request.session);
    console.log(request.session.id);
    const {
      query: { filter, value },
    } = request;
    if (filter && value)
      return response.send(
        mockUsers.filter((user) => user[filter].includes(value))
      );
    return response.send(mockUsers);
  }
);

router.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  async (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty()) return response.status(400).send(result.array());

    const data = matchedData(request);
    data.password = hashedPassword(data.password);
    const newUser = new User(data);
    try {
      const savedUser = await newUser.save();
      console.log(savedUser);
      return response.status(201).send(savedUser);
    } catch (err) {
      return response.sendStatus(400);
    }
  }
);

router.get("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;

  const findUser = mockUsers[findUserIndex];
  if (!findUser) return response.sendStatus(404);
  return response.send(findUser);
});

// put request is used to update the resource wholly
router.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return response.sendStatus(200);
});

// patch request is used to update the resource partically
router.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;

  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return response.sendStatus(200);
});

// Delete request is used to delete a resource
router.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  mockUsers.splice(findUserIndex, 1);
  return response.sendStatus(200);
});

export default router;
