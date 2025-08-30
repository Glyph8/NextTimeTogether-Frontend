## 타임투게더 NextJS

### 프론트 개발자 주의 사항 
- svgr 설치하여 사용 중
- `src/assets/svgs` 폴더 내부의 svg 이미지들은 `svgr` 처리되어 반드시 컴포넌트처럼 사용해야 한다.
- 그 외, 폴더의 svg들은 URL 기반으로 처리하여, `<Image>` 태그에 사용가능.
- 해당 설정은 `src/svgr.d.ts`, `next.config.ts` 참고.
- svg이미지 크기 변경 필요시, 텍스트 편집으로 width, height 속성 제거할 것. 경우가 잦을 경우 일괄 처리 예정

