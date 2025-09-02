import type { NextConfig } from "next";
import type { Configuration, RuleSetRule } from "webpack";
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
                  { name: "removeViewBox", active: false },
                  // width/height 제거하지 않고 유지
                  { name: "removeDimensions", active: false }
                ]
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
  webpack: (config: Configuration) => {
    // RuleSetRule 타입 사용
    const fileLoaderRule = config.module?.rules?.find((rule): rule is RuleSetRule => {
      if (typeof rule !== 'object' || !rule) return false;
      if (rule.test instanceof RegExp) {
        return rule.test.test('.svg');
      }
      return false;
    });

    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    // SVGR 룰 추가
    const svgrRule: RuleSetRule = {
      test: /\.svg$/i,
      include: path.resolve(__dirname, "src/assets/svgs"),
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            typescript: true,
            expandProps: "end",
            dimensions: true,
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      removeViewBox: false,
                      removeDimensions: false,
                    },
                  },
                },
              ],
            },
            replaceAttrValues: {
              "#000": "currentColor",
              "#000000": "currentColor",
            },
          },
        },
      ],
    };

    config.module?.rules?.push(svgrRule);
    
    // 나머지 SVG 처리
    const assetRule: RuleSetRule = {
      test: /\.svg$/i,
      exclude: path.resolve(__dirname, "src/assets/svgs"),
      type: "asset/resource",
    };

     config.module?.rules?.push(assetRule);

    return config;
  },
};

export default nextConfig;
