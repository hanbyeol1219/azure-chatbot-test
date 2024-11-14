import "dotenv/config";
import { AzureKeyCredential, SearchClient } from "@azure/search-documents";
import axios from "axios";

const searchEndpoint = process.env.AZURE_SEARCH_ENDPOINT;
const searchApiKey = process.env.AZURE_SEARCH_API_KEY;
const indexName = process.env.INDEX_NAME;
const azureOpenAiEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
const azureOpenAiApiKey = process.env.AZURE_OPENAI_API_KEY;

// Azure Cognitive Search 사용을 위한 클라이언트 생성
const searchClient = new SearchClient(
  searchEndpoint,
  indexName,
  new AzureKeyCredential(searchApiKey)
);

// GPT-3.5 Turbo 답변 생성
async function getAnswerFromAzureGPT(query, documentContent) {
  if (!documentContent) {
    documentContent = "관련된 문서를 찾을 수 없습니다.";
  }

  const messages = [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: query },
    { role: "assistant", content: documentContent },
  ];

  try {
    const response = await axios.post(
      `${azureOpenAiEndpoint}?api-version=2024-08-01-preview`,
      {
        messages: messages,
        max_tokens: 500, //최대 답변 길이
        temperature: 0.7, //창의성(다양성)
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": azureOpenAiApiKey,
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("오류 정보:", error.response?.data);
    throw new Error("API 호출 오류 발생: " + error.message);
  }
}

// Azure search AI 문서 검색 (test.pdf 문서만 선택 *무료 요금제 data 토큰 이슈)
async function searchDocuments(query) {
  const results = await searchClient.search(query);
  let documentContent = "";

  for await (const result of results.results) {
    const content = result.document.content;
    const metadataStorageName = result.document.metadata_storage_name;

    // 문서 중 test.pdf 문서만 선택
    if (metadataStorageName === "test.pdf") {
      documentContent = content; // test.pdf의 전체 내용
      break;
    }
  }

  return documentContent;
}

// 사용자가 입력한 질문에 대해 답변하기
async function askQuestion(query) {
  const documentContent = await searchDocuments(query);

  // 질문에 맞는 문서가 없을 경우
  if (!documentContent) {
    return "관련 문서를 찾을 수 없습니다.";
  }

  const answer = await getAnswerFromAzureGPT(query, documentContent);
  return answer;
}

// 테스트용 예시
async function main() {
  const question = "잘 팔리는 펫푸드 특징 중 펫스낵에 대해 설명해줘"; // 예시 질문
  try {
    const answer = await askQuestion(question);
    console.log("답변:", answer);
  } catch (error) {
    console.error("오류 발생:", error.message);
  }
}

// 실행
main();
