import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

const searchEndpoint = process.env.VITE_AZURE_SEARCH_ENDPOINT;
const searchApiKey = process.env.VITE_AZURE_SEARCH_API_KEY;

// cors() 미들웨어 사용으로 CORS 활성화
app.use(cors());

app.use(
  "/api",
  createProxyMiddleware({
    target: searchEndpoint,
    changeOrigin: true,
    secure: true,
    pathRewrite: {
      "^/api": "",
    },
    headers: {
      "api-key": searchApiKey,
    },
    onError(err, req, res) {
      console.error("프록시 오류:", err);
      res.status(500).send("서버 오류가 발생했습니다.");
    },
  })
);

app.listen(port);
