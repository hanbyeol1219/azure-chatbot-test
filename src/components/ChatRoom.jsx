import React, { useEffect, useRef, useState } from "react";
import { searchDocuments, getAnswerFromOpenAiGPT } from "../api/api";
import { S } from "../style/ChatRoom.styles";

export const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const lastMessageRef = useRef(null);

  const handleAskQuestion = async () => {
    if (question.trim() === "") return;
    setQuestion("");

    const newMessages = [...messages, { role: "user", content: question }];
    setMessages(newMessages);

    try {
      const documentContent = await searchDocuments(question);
      // const answer = await getAnswerFromAzureGPT(question, documentContent);
      const answer = await getAnswerFromOpenAiGPT(question, documentContent);

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
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAskQuestion();
    }
  };

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [messages]);

  return (
    <S.ChatRoomContainer>
      <S.Title>Chatbot</S.Title>
      <S.MessagesContainer>
        {messages.length > 0 &&
          messages.map((message, index) => (
            <S.Message
              key={index}
              role={message.role}
              error={message.error ? "true" : undefined}
              ref={index === messages.length - 1 ? lastMessageRef : null}
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
          onKeyDown={handleKeyDown}
          placeholder="입력"
        />
        <S.Button onClick={handleAskQuestion}>입력</S.Button>
      </S.InputContainer>
    </S.ChatRoomContainer>
  );
};
