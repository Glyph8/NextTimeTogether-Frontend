import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    // 1. Next.js 13+ 권장 방식
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },

  // TurboPack 설정 - 배포 환경에서 이미지 오류로 추가
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: [{
            loader: '@svgr/webpack',
            options: {
              typescript: true,
              expandProps: "end",
              // dimensions를 true로 변경하여 기본 크기 유지
              dimensions: true,
              svgo: true,
              svgoConfig: {
                plugins: [
                  {
                    name: 'preset-default',
                    params: {
                      overrides: {
                        // 기본 프리셋의 removeViewBox와 removeDimensions 규칙을 비활성화합니다.
                        removeViewBox: false,
                        // removeDimensions: false,
                      },
                    },
                  },
                   { name: "removeAttrs", params: { attrs: "(width|height)" } }
                ],
              },
              replaceAttrValues: {
                "#000": "currentColor",
                "#000000": "currentColor",
              },
            },
          }],
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
            // CSS/props로 크기 제어
            dimensions: false,
            svgo: true,
            svgoConfig: {
              plugins: [
                { name: "removeViewBox", active: false },
                { name: "removeAttrs", params: { attrs: "(width|height)" } }
              ]
            },
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
