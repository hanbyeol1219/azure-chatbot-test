import React, { useState } from "react";
import { searchDocuments, getAnswerFromAzureGPT } from "../api/api";
import { S } from "../style/ChatRoom.styles";

export const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");

  // 질문 처리 함수
  const handleAskQuestion = async () => {
    if (question.trim() === "") return;

    const newMessages = [...messages, { role: "user", content: question }];
    setMessages(newMessages);

    try {
      const documentContent = await searchDocuments(question);
      const answer = await getAnswerFromAzureGPT(question, documentContent);

      setMessages([
        ...newMessages,
        { role: "assistant", content: answer, error: false },
      ]);
    } catch (error) {
      console.error("오류 발생:", error.message);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "API 호출 오류 발생", error: true },
      ]);
    }
    setQuestion(""); // 질문 입력 필드 비우기
  };

  // 엔터 키 눌렀을 때 질문 처리
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAskQuestion(); // 엔터 키로 질문 처리
    }
  };

  return (
    <S.ChatRoomContainer>
      <S.Title>Chatbot Test</S.Title>
      <S.MessagesContainer>
        {messages.map((message, index) => (
          <S.Message
            key={index}
            role={message.role}
            error={message.error ? "true" : undefined}
          >
            {message.content}
          </S.Message>
        ))}
      </S.MessagesContainer>
      <S.InputContainer>
        <S.Input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown} // 엔터 키 입력 처리
          placeholder="질문을 입력하세요"
        />
        <S.Button onClick={handleAskQuestion}>입력</S.Button>
      </S.InputContainer>
    </S.ChatRoomContainer>
  );
};
