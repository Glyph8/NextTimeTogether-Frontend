// next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
  webpack(config) {
    // 기존 Next.js의 SVG asset loader 규칙을 찾습니다.
    // @ts-ignore
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg")
    );

    config.module.rules.push(
      // 찾은 규칙을 수정하여, *.svg?url 로 끝나는 파일만 asset loader가 처리하도록 합니다.
      // (예: import iconUrl from './icon.svg?url';)
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, 
      },
      // *.svg?url 로 끝나지 않는 모든 SVG 파일은 @svgr/webpack 로더가 처리하도록 규칙을 추가합니다.
      // (예: import Icon from './icon.svg';)
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: /url/ }, 
        use: ["@svgr/webpack"],
      }
    );

    // 수정된 규칙을 적용했으니, 원래 규칙은 이제 SVG 파일을 처리하지 않도록 설정합니다.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

export default nextConfig;