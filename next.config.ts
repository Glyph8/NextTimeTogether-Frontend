import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    // 1. Next.js 13+ 권장 방식
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        //pathname: '/600x400', // 특정 경로만 허용하고 싶다면 추가
      },
    ],
    // 2. 구 버전 방식 (여전히 작동함)
    // domains: ['placehold.co'],
  },

  // TurboPack 설정
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  // webpack 설정
  webpack: (config) => {
    // 기본 SVG 로더에서 제외
    // @ts-expect-error 타입 무시
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg')
    );
    fileLoaderRule.exclude = /\.svg$/i;

    // 특정 폴더(src/assets/svgs) → svgr 처리
    config.module.rules.push({
      test: /\.svg$/i,
      include: path.resolve(__dirname, "src/assets/svgs"),
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            typescript: true,
            expandProps: "end",
            replaceAttrValues: {
              "#000": "currentColor",
              "#000000": "currentColor",
            },
          },
        },
      ],
    });

    // 그 외 svg → URL 기반 처리 (<Image> 등에 사용할 예정)
    config.module.rules.push({
      test: /\.svg$/i,
      exclude: path.resolve(__dirname, "src/assets/svgs"),
      type: "asset/resource",
    });

    return config;
  },
};

export default nextConfig;
