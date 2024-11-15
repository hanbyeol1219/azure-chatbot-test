import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";

dotenv.config();

const searchEndpoint = process.env.VITE_AZURE_SEARCH_ENDPOINT;
const searchApiKey = process.env.VITE_AZURE_SEARCH_API_KEY;

export default (req, res) => {
  if (!searchEndpoint || !searchApiKey) {
    res.status(500).send("환경 변수가 설정되지 않았습니다.");
    return;
  }
  const proxy = createProxyMiddleware({
    target: searchEndpoint,
    changeOrigin: true,
    secure: true,
    pathRewrite: { "^/api": "" },
    headers: { "api-key": searchApiKey },
    onError(err) {
      console.error("프록시 오류:", err);
      res.status(500).send("서버 오류가 발생했습니다.");
    },
  });
  return proxy(req, res);
};
