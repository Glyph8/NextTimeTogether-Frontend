import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
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
            expandProps: "start", // className을 마지막에 적용하기
            // ext: "tsx",
            // icon: true, // 추가됨
            svgo: true, // SVG 최적화 켜기
            svgoConfig: {
              plugins: [
                "preset-default",
                {
                  name: "removeAttrs",
                  params: {
                    attrs: "(width|height|fill|stroke)", // 하드코딩된 속성 제거
                  },
                },
              ],
            },
            replaceAttrValues: {
              "#000": "currentColor", // 색상 Tailwind로 설정 가능하게 변환
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
