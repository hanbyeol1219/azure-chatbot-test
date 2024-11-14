import styled from "styled-components";

export const S = {
  ChatRoomContainer: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 700px;
    padding: 0 20px 20px 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
  `,
  Title: styled.h2`
    color: #333;
    font-size: 24px;
    margin-bottom: 16px;
  `,
  MessagesContainer: styled.div`
    width: 95%;
    min-width: 300px;
    height: 70vh;
    overflow-y: auto;
    padding: 16px;
    background-color: #fff;
    border-radius: 8px;
    border: 1px solid #ddd;
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
  `,
  Message: styled.div`
    width: 70%;
    width: 70%;
    margin-bottom: 12px;
    padding: 10px;
    border-radius: 6px;
    background-color: ${({ role }) =>
      role === "user" ? "#d1e7dd" : "#e2e3e5"};
    color: ${({ error }) => (error ? "#d9534f" : "#333")};
    align-self: ${({ role }) => (role === "user" ? "flex-end" : "flex-start")};
    text-align: left;
  `,
  InputContainer: styled.div`
    display: flex;
    width: 100%;
  `,
  Input: styled.input`
    flex: 1;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    font-size: 16px;
    margin-right: 8px;
  `,
  Button: styled.button`
    padding: 8px 16px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;

    &:hover {
      background-color: #0056b3;
    }
  `,
};
