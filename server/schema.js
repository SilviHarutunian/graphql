const { buildSchema } = require("graphql");

const schema = buildSchema(`
    type User {
        id: Float,
        username: String,
        age: String,
    }

    input UserInput {
        id: Float,
        username: String,
        age: String,
    }

    type Query {
        getAllUsers: [User], 
    }

    type Mutation {
        createUser(input: UserInput): User
        updateUser(input: UserInput): User
        deleteUser(id: Float): User
    }
`);

module.exports = schema;
