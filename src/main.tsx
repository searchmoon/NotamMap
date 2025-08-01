import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { registerSW } from "virtual:pwa-register";

// ✅ 서비스 워커 등록 (최상단에서)
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("새 버전이 있습니다. 새로고침할까요?")) {
      updateSW(true); //service worker를 강제로 적용하고 페이지를 새로고침하는 함수
    }
  },
  onOfflineReady() {
    console.log("✅ 오프라인 사용 준비 완료");
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
