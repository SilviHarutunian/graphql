import styled from "styled-components";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 200px;
  border: 1px solid #000000;
  border-radius: 4px;
  margin: auto;
  margin-top: 20px;
  align-items: center;
  padding: 15px;
  justify-content: space-around;

  input {
    width: 90%;
    height: 30px;
  }

  button {
    width: 100px;
    height: 30px;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    background-color: aqua;
  }

  .userID {
    margin-top: 20px;
  }
`;

const TableContainer = styled.div`
  width: 50%;
  height: 50vh;
  margin: auto;
  padding: 15px;
  margin-top: 20px;
  border: 1px solid #000;
`;

const Table = styled.table`
  width: 100%;

  thead {
    font-weight: bold;
  }

  tr {
    height: 30px;
  }

  td {
    width: 153px;
    border-bottom: 1px solid #000;
  }
`;

const Button = styled.button`
  margin-left: 10px;
  border: none;
  background-color: #fff;
  cursor: pointer;
`;

export const Styled = {
  Form,
  TableContainer,
  Table,
  Button,
};
