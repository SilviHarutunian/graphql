import { SyntheticEvent, useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";

import { GET_ALL_USERS } from "./query/user";
import { CREATE_USER, DELETE_USER, UPDATE_USER } from "./mutation/user";

import { Styled } from "./styled";

interface IUser {
  id: number;
  username: string;
  age: string;
}

const App = () => {

  const [users, setUsers] = useState<IUser[]>([]);
  const [username, setUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newAge, setNewAge] = useState("");
  const [age, setAge] = useState("");
  const [inEditMode, setInEditMode] = useState({
    status: false,
    rowKey: 0,
  });

  const { data, loading } = useQuery(GET_ALL_USERS);

  const [newUser] = useMutation(CREATE_USER, {
    update: (cache, { data: { createUser } }) => {
      const data: { getAllUsers: Array<IUser> } | null = cache.readQuery({
        query: GET_ALL_USERS,
      });
      cache.writeQuery({
        query: GET_ALL_USERS,
        data: { getAllUsers: data?.getAllUsers.concat([createUser]) },
      });
    },
  });

  const [updatedUser] = useMutation(UPDATE_USER, {
    update: (cache, { data: { updateUser } }) => {
      const data: { getAllUsers: Array<IUser> } | null = cache.readQuery({
        query: GET_ALL_USERS,
      });
    },
  });

  const [deletedUser] = useMutation(DELETE_USER, {
    update: (cache, { data: { deleteUser } }) => {
      const data: { getAllUsers: Array<IUser> } | null = cache.readQuery({
        query: GET_ALL_USERS,
      });

      cache.writeQuery({
        query: GET_ALL_USERS,
        data: {
          getAllUsers: data?.getAllUsers.filter(
            (user) => user.id !== deleteUser.id
          ),
        },
      });
    },
  });

  useEffect(() => {
    if (!loading) {
      setUsers(data.getAllUsers);
    }
  }, [data]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  const addUser = (e: SyntheticEvent) => {
    e.preventDefault();
    if (username !== "" && age !== "") {
      newUser({
        variables: {
          input: {
            username,
            age,
          },
        },
      }).then(({ data }) => {
        console.log(data);
        setUsername("");
        setAge("");
      });
    }
  };

  const onEdit = (id: number, username: string, age: string) => {
    setInEditMode({
      status: true,
      rowKey: id,
    });
    setNewUsername(username);
    setNewAge(age);
  };

  const onCancel = () => {
    setInEditMode({
      status: false,
      rowKey: 0,
    });
    setNewUsername("");
    setNewAge("");
  };

  const onDelete = (event: SyntheticEvent, id: number) => {
    deletedUser({
      variables: {
        id,
      },
    }).then(({ data }) => {
      console.log(data);
    });
  };

  const onSave = (id: number, newUsername: string, age: string) => {
    if (newUsername !== "" || newAge !== "") {
      updatedUser({
        variables: {
          input: {
            id,
            username: newUsername,
            age: newAge,
          },
        },
      }).then(({ data }) => {
        console.log(data);
      });
      setInEditMode({
        status: false,
        rowKey: 0,
      });
    }
  };

  return (
    <div>
      <Styled.Form onSubmit={addUser}>
        <label>Username:</label>
        <input
          type="string"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Age:</label>
        <input
          type="string"
          value={age}
          required
          onChange={(e) => setAge(e.target.value)}
        />
        <button type="submit">Create User</button>
      </Styled.Form>
      <Styled.TableContainer>
        <Styled.Table>
          <thead>
            <tr>
              <td>ID</td>
              <td>Username</td>
              <td>Age</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                {inEditMode.status && inEditMode.rowKey === user.id ? (
                  <>
                    <td>
                      <input
                        value={newUsername}
                        onChange={(event) => setNewUsername(event.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        value={newAge}
                        onChange={(event) => setNewAge(event.target.value)}
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td>{user.username}</td>
                    <td>{user.age}</td>
                  </>
                )}
                <td>
                  {inEditMode.status && inEditMode.rowKey === user.id ? (
                    <>
                      <Styled.Button
                        onClick={() => onSave(user.id, newUsername, newAge)}
                      >
                        Save
                      </Styled.Button>
                      <Styled.Button onClick={() => onCancel()}>
                        Cancel
                      </Styled.Button>
                    </>
                  ) : (
                    <>
                      <Styled.Button
                        onClick={() => onEdit(user.id, user.username, user.age)}
                      >
                        Edit
                      </Styled.Button>

                      <Styled.Button
                        onClick={(event) => onDelete(event, user.id)}
                      >
                        Delete
                      </Styled.Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Styled.Table>
      </Styled.TableContainer>
    </div>
  );
};

export default App;
