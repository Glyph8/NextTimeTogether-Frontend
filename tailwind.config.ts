import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    /** glob 패턴은 **'0개 이상의 모든 하위 폴더를 의미하므로 깊이마다 설정할 필요 없음! */
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      // fontFamily를 확장하여 커스텀 폰트를 추가합니다.
      fontFamily: {
        // 'sans'는 기본 폰트를 의미
        // 별도로 클래스를 지정하지 않아도 기본 폰트가 Pretendard로 하기 위함
        sans: ['var(--font-pretendard)'],
      },
    },
  },
  plugins: [],
};
export default config;