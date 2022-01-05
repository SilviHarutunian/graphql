const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const cors = require("cors");
const schema = require("./schema");
const users = [{ id: 1640805533963, username: "Vasya", age: 25 }];

const app = express();
app.use(cors());

const createUser = (input) => {
  const id = Date.now();
  return {
    id,
    ...input,
  };
};

const root = {
  getAllUsers: () => {
    return users;
  },
  createUser: ({ input }) => {
    const user = createUser(input);
    users.push(user);
    return user;
  },
  updateUser: ({ input }) => {
    const index = users.findIndex((user) => user.id === input.id);
    const user = users[index];

    if (index > -1) {
      user.username = input.username;
      user.age = input.age;
    }
    return user;
  },
  deleteUser: ({ id }) => {
    const index = users.findIndex((user) => user.id === id);
    const user = users[index];
    if (index > -1) {
      users.splice(index, 1);
    }
    return user;
  },
};

app.use("/graphql", graphqlHTTP({ graphiql: true, schema, rootValue: root }));

app.listen(5000, () => console.log("server started on port 5000"));
