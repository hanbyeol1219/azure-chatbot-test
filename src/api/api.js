import axios from "axios";
import { AzureKeyCredential, SearchClient } from "@azure/search-documents";
// import { google } from "googleapis";

const searchEndpoint = import.meta.env.VITE_AZURE_SEARCH_ENDPOINT;
const searchApiKey = import.meta.env.VITE_AZURE_SEARCH_API_KEY;
const indexName = import.meta.env.VITE_INDEX_NAME;
// const azureOpenAiEndpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
// const azureOpenAiApiKey = import.meta.env.VITE_AZURE_OPENAI_API_KEY;
const openAiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
// const credentials = JSON.parse(import.meta.env.VITE_GOOGLE_SHEET_CREDENTIALS);
// const sheetId = import.meta.env.VITE_GOOGLE_SHEET_ID;
// const sheetName = import.meta.env.VITE_GOOGLE_SHEET_NAME;

// 환경에 따라서 다른 API URL 사용 (개발, 배포 후)
// const apiUrl =
//   process.env.NODE_ENV === "production"
//     ? import.meta.env.VITE_API_URL_PROD
//     : import.meta.env.VITE_API_URL;

// Azure Search 서비스 연결
const searchClient = new SearchClient(
  searchEndpoint,
  indexName,
  new AzureKeyCredential(searchApiKey)
);

// Azure Search 문서 검색
export const searchDocuments = async (query) => {
  try {
    const response = await axios.post(
      // `${apiUrl}/indexes('${indexName}')/docs/search.post.search?api-version=2024-07-01`,
      `/api/indexes('${indexName}')/docs/search.post.search?api-version=2024-07-01`,
      {
        search: query,
      }
    );
    let documentContent = "";

    for (const result of response.data.value) {
      const content = result.content;

      const metadataStorageName = result.metadata_storage_name;

      // 특정 pdf 문서만 선택
      if (metadataStorageName === "data.pdf") {
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

// GPT-3.5 Turbo 답변 생성
// export const getAnswerFromAzureGPT = async (query, documentContent) => {
//   if (!documentContent) {
//     documentContent = "관련된 문서를 찾을 수 없습니다.";
//   }

//   const messages = [
//     { role: "system", content: "You are a helpful assistant." },
//     { role: "user", content: query },
//     { role: "assistant", content: documentContent },
//   ];

//   try {
//     const response = await axios.post(
//       `${azureOpenAiEndpoint}?api-version=2024-08-01-preview`,
//       {
//         messages: messages,
//         max_tokens: 500,
//         temperature: 0.7,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "api-key": azureOpenAiApiKey,
//         },
//       }
//     );

//     return response.data.choices[0].message.content.trim();
//   } catch (error) {
//     console.error("오류 정보:", error.response?.data);
//     throw new Error("API 호출 오류 발생: " + error.message);
//   }
// };

export const getAnswerFromOpenAiGPT = async (query, documentContent) => {
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
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openAiApiKey}`,
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("오류 정보:", error.response?.data || error.message);
    throw new Error("API 호출 오류 발생: " + error.message);
  }
};

// 구글 시트에 데이터 추가
export const appendDataToGoogleSheet = async (data) => {
  // try {
  //   // 인증 클라이언트
  //   const auth = new google.auth.GoogleAuth({
  //     keyFile: credentials,
  //     scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  //   });

  //   const sheets = google.sheets({ version: "v4", auth });

  //   const values = [[data.name, data.age, data.address, data.createTime]];

  //   // Google Sheets API 호출
  //   const response = await sheets.spreadsheets.values.append({
  //     spreadsheetId: sheetId,
  //     range: `${sheetName}!B1`,
  //     valueInputOption: "RAW",
  //     resource: {
  //       values,
  //     },
  //   });

  //   console.log("성공", response.data);
  // } catch (error) {
  //   console.error("API 호출 오류:", error.message);
  //   throw new Error("실패");
  // }
  console.log("Google Sheets API 호출");
};
