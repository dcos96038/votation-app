import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import prettierConfigRecommended from "eslint-plugin-prettier/recommended";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const config = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  prettierConfigRecommended,
  {
    rules: {
      "prettier/prettier": ["warn", {}, { usePrettierrc: true }],
    },
  },
];

export default config;
