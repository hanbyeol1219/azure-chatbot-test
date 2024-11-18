import React, { useEffect, useRef, useState } from "react";
import {
  searchDocuments,
  getAnswerFromOpenAiGPT,
  appendDataToGoogleSheet,
} from "../api/api";
import { S } from "../style/ChatRoom.styles";
import moment from "moment";

export const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const lastMessageRef = useRef(null);
  const [chatType, setChatType] = useState("");
  const [inputData, setInputData] = useState({
    name: "",
    age: "",
    address: "",
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const inputRef = useRef(null);

  // 챗봇 메시지 추가 + 0.5초 딜레이
  const addBotMessage = (content) => {
    setIsInputDisabled(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content,
          createTime: moment().format("HH:mm"),
        },
      ]);
      setIsInputDisabled(false);
    }, 500);
  };

  // 채팅 초기화
  const initializeChat = () => {
    setIsInputDisabled(true);
    setMessages([
      {
        role: "assistant",
        content: (
          <>
            <span>
              안녕하세요!
              <br />
              무엇을 도와드릴까요?
              <br />
              아래 버튼을 클릭해주세요.
              <br />
            </span>
            <span
              style={{
                display: "block",
                fontSize: "12px",
                color: "red",
              }}
            >
              *다시 선택하려면 '작업 선택'이라고 입력해주세요.
            </span>
          </>
        ),
        createTime: moment().format("HH:mm"),
      },
      {
        role: "assistant",
        content: (
          <div>
            <button
              onClick={() => handleChatType("register")}
              style={{ display: "block", marginBottom: "10px" }}
            >
              정보등록
            </button>
            <button onClick={() => handleChatType("searchGPT")}>
              PDF 문서 검색
            </button>
          </div>
        ),
        createTime: moment().format("HH:mm"),
      },
    ]);
    setChatType("");
    setCurrentStep(0);
    setInputData({ name: "", age: "", address: "" });
    setQuestion("");
  };

  // 작업 선택
  const handleChatType = (type) => {
    setChatType(type);
    if (type === "register") {
      addBotMessage(
        <span>
          <span style={{ fontWeight: "bold" }}>이름</span>을 입력해주세요.
        </span>
      );
      setCurrentStep(0);
    } else if (type === "searchGPT") {
      addBotMessage(
        <>
          <span>질문을 입력해주세요.</span>
          <div style={{ marginTop: "10px" }}>
            <span style={{ display: "block", fontSize: "12px" }}>
              ex) 전체 문서 내용 요약해줘
            </span>
            <span style={{ display: "block", fontSize: "12px" }}>
              ex) 국가공무원법상의 공무원 구분에 대해 짧게 요약해서 알려줘
            </span>
            <span style={{ display: "block", fontSize: "12px" }}>
              ex) 경력직공무원 중 일반직 공무원은 어떻게 구분돼?
            </span>
          </div>
        </>
      );
    }
  };

  // 정보 등록
  const handleRegisterFlow = (userInput) => {
    switch (currentStep) {
      case 0:
        setInputData((prev) => ({ ...prev, name: userInput }));
        addBotMessage(
          <>
            <span style={{ fontWeight: "bold" }}>나이</span>을 입력해주세요.
          </>
        );
        setCurrentStep(1);
        break;
      case 1:
        setInputData((prev) => ({ ...prev, age: userInput }));
        addBotMessage(
          <>
            <span style={{ fontWeight: "bold" }}>주소</span>을 입력해주세요.
          </>
        );
        setCurrentStep(2);
        break;
      case 2:
        const updatedAddress = userInput;
        setInputData((prev) => {
          const updatedData = { ...prev, address: updatedAddress };
          addBotMessage(
            <>
              <span style={{ display: "block", marginBottom: "10px" }}>
                입력하신 정보가 맞습니까?
              </span>
              <span style={{ display: "block" }}>이름: {updatedData.name}</span>
              <span style={{ display: "block" }}>나이: {updatedData.age}</span>
              <span style={{ display: "block" }}>
                주소: {updatedData.address}
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "12px",
                  color: "red",
                  margin: "10px 0",
                }}
              >
                * '네'를 선택하시면 입력하신 정보가 저장됩니다.
              </span>
              <button
                onClick={() => handleConfirmation(updatedData, true)}
                style={{ marginRight: "10px" }}
              >
                네
              </button>
              <button onClick={() => handleConfirmation(null, false)}>
                아니요
              </button>
            </>
          );
          return updatedData;
        });
        setIsInputDisabled(true);
        setCurrentStep(3);
        break;
      default:
        break;
    }
  };

  // 정보 등록 확인
  const handleConfirmation = (data, isConfirmed) => {
    if (isConfirmed) {
      const saveData = {
        ...data,
        createTime: moment().format("YYYY-MM-DD HH:mm:ss"),
      };
      // 구글 시트 저장
      // appendDataToGoogleSheet(saveData);
      addBotMessage("정보 등록이 완료되었습니다.");
      setTimeout(
        () =>
          addBotMessage(
            <>
              <span
                style={{
                  marginBottom: "10px",
                }}
              >
                다음 작업을 선택해주세요.
              </span>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                <button
                  onClick={() => {
                    handleChatType("register");
                    setCurrentStep(0);
                    setInputData({ name: "", age: "", address: "" });
                  }}
                >
                  추가 등록
                </button>
                <button
                  onClick={() => {
                    setInputData({ name: "", age: "", address: "" });
                    setMessages((prev) => [
                      ...prev,
                      {
                        role: "assistant",
                        content: (
                          <div>
                            <button
                              onClick={() => handleChatType("register")}
                              style={{ display: "block", marginBottom: "10px" }}
                            >
                              정보등록
                            </button>
                            <button onClick={() => handleChatType("searchGPT")}>
                              PDF 문서 검색
                            </button>
                          </div>
                        ),
                      },
                    ]);
                  }}
                  style={{ marginRight: "10px" }}
                >
                  작업 선택
                </button>
                <button
                  onClick={() => {
                    setIsInputDisabled(true);
                    setMessages((prev) => [
                      ...prev,
                      {
                        role: "assistant",
                        content: "채팅 서비스가 종료되었습니다.",
                        isDone: true,
                      },
                    ]);
                  }}
                >
                  채팅 종료
                </button>
              </div>
            </>
          ),
        1000
      );
      setCurrentStep(4);
    } else {
      addBotMessage(
        <>
          <span style={{ display: "block", marginBottom: "10px" }}>
            다시 입력을 시작합니다.
          </span>
          <>
            <span style={{ fontWeight: "bold" }}>이름</span>을 입력해주세요.
          </>
        </>
      );
      setInputData({ name: "", age: "", address: "" });
      setCurrentStep(0);
    }
    setIsInputDisabled(false);
  };

  // PDF 문서 검색
  const handleAskQuestion = async () => {
    if (question.trim() === "") return;

    const newMessages = [
      ...messages,
      { role: "user", content: question, createTime: moment().format("HH:mm") },
    ];
    setMessages(newMessages);
    setQuestion("");

    try {
      const documentContent = await searchDocuments(question);
      const answer = await getAnswerFromOpenAiGPT(question, documentContent);

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: answer,
          error: false,
          createTime: moment().format("HH:mm"),
        },
      ]);
    } catch (error) {
      console.error("오류 발생:", error.message);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "API 호출 오류 발생",
          error: true,
          createTime: moment().format("HH:mm"),
        },
      ]);
    }
  };

  // user 입력
  const handleUserInput = () => {
    if (question.includes("작업 선택")) {
      setChatType("");
      setCurrentStep(0);
      setQuestion("");
      setIsInputDisabled(true);
      setInputData({ name: "", age: "", address: "" });
      setMessages([
        ...messages,
        {
          role: "user",
          content: question,
          createTime: moment().format("HH:mm"),
        },
      ]);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: (
            <div>
              <button
                onClick={() => handleChatType("register")}
                style={{ display: "block", marginBottom: "10px" }}
              >
                정보등록
              </button>
              <button onClick={() => handleChatType("searchGPT")}>
                PDF 문서 검색
              </button>
            </div>
          ),
          createTime: moment().format("HH:mm"),
        },
      ]);
      return;
    }
    if (question.trim() === "") return;

    setMessages([
      ...messages,
      {
        role: "user",
        content: question,
        createTime: moment().format("HH:mm"),
      },
    ]);

    if (chatType === "register") {
      handleRegisterFlow(question);
    } else if (chatType === "searchGPT") {
      handleAskQuestion();
    }

    setQuestion("");
  };

  // 엔터키
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && question.trim() !== "") {
      handleUserInput();
    }
  };

  // 초기화
  useEffect(() => {
    initializeChat();
  }, []);

  // 포커스
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [messages]);

  // 채팅방 스크롤
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
            <S.MessageBox key={index} role={message.role}>
              <S.MessageContent
                role={message.role}
                error={message.error ? "true" : undefined}
                ref={index === messages.length - 1 ? lastMessageRef : null}
                style={
                  message.isDone && {
                    backgroundColor: "#d1e7dd",
                    color: "#575757",
                    display: "block",
                    padding: "10px 20px",
                    borderRadius: "25px",
                    textAlign: "center",
                    alignSelf: "center",
                    marginTop: "20px",
                  }
                }
              >
                {message.content}
              </S.MessageContent>
              <S.CreateTime role={message.role}>
                {message.createTime}
              </S.CreateTime>
            </S.MessageBox>
          ))}
      </S.MessagesContainer>
      <S.InputContainer>
        <S.Input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="입력"
          disabled={isInputDisabled}
          ref={inputRef}
        />
        <S.Button onClick={handleUserInput} disabled={isInputDisabled}>
          입력
        </S.Button>
      </S.InputContainer>
    </S.ChatRoomContainer>
  );
};
