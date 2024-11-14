import axios from "axios";
import { AzureKeyCredential, SearchClient } from "@azure/search-documents";

const searchEndpoint = import.meta.env.VITE_AZURE_SEARCH_ENDPOINT;
const searchApiKey = import.meta.env.VITE_AZURE_SEARCH_API_KEY;
const indexName = import.meta.env.VITE_INDEX_NAME;
const azureOpenAiEndpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
const azureOpenAiApiKey = import.meta.env.VITE_AZURE_OPENAI_API_KEY;

const searchClient = new SearchClient(
  searchEndpoint,
  indexName,
  new AzureKeyCredential(searchApiKey)
);

// GPT-3.5 Turbo 답변 생성
export const getAnswerFromAzureGPT = async (query, documentContent) => {
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
        max_tokens: 500,
        temperature: 0.7,
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
};

// Azure Search 문서 검색
export const searchDocuments = async (query) => {
  try {
    const response = await axios.post(
      `/api/indexes('${indexName}')/docs/search.post.search?api-version=2024-07-01`,
      {
        search: query,
      }
    );
    let documentContent = "";

    for (const result of response.data.value) {
      const content = result.content;
      const metadataStorageName = result.metadata_storage_name;

      // test.pdf 문서만 선택
      if (metadataStorageName === "test.pdf") {
        documentContent = content;
        break;
      }
    }

    return documentContent;
  } catch (error) {
    console.error("오류 정보:", error.response?.data);
    throw new Error("API 호출 오류 발생: " + error.message);
  }
};
