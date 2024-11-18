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
    width: 400px;
    min-width: 400px;
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
  MessageBox: styled.div`
    margin-bottom: 12px;
    align-items: flex-end;
    display: flex;
    justify-content: flex-start;
    flex-direction: ${({ role }) => (role === "user" ? "row-reverse" : "row")};
  `,
  MessageContent: styled.div`
    padding: 8px 12px;
    border-radius: 8px;
    background-color: ${({ role }) =>
      role === "user" ? "#d1e7dd" : "#e2e3e5"};
    color: ${({ error }) => (error ? "#d9534f" : "#333")};
    text-align: left;
    display: inline-block;
    max-width: 70%;
  `,
  CreateTime: styled.span`
    font-size: 12px;
    color: gray;
    margin-right: ${({ role }) => (role === "user" ? "5px" : "0")};
    margin-left: ${({ role }) => (role === "user" ? "0" : "5px")};
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
