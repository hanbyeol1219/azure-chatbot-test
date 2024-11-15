import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

const searchEndpoint = process.env.VITE_AZURE_SEARCH_ENDPOINT;
const searchApiKey = process.env.VITE_AZURE_SEARCH_API_KEY;

app.use(cors());

app.use(
  "/api",
  (req, res, next) => {
    console.log("프록시 요청이 들어왔습니다:", req.originalUrl);
    next();
  },
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
    onProxyReq: (proxyReq, req, res) => {
      console.log("프록시 요청 URL:", proxyReq.path);
    },
    onError(err, req, res) {
      console.error("프록시 오류:", err);
      res.status(500).send("서버 오류가 발생했습니다.");
    },
  })
);

app.listen(port, () => {
  console.log(`Server: http://localhost:${port}`);
});
