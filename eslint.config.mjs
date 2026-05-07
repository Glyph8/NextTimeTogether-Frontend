import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores([".next/**", "node_modules/**", "src/apis/generated/**"]),
  {
    rules: {
      // production 빌드에 console.log 가 새 들어가는 것을 차단.
      // 운영 의도 로그는 console.warn / console.error 로 명시할 것.
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
]);
