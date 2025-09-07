
// // svgr 폴더는 React 컴포넌트 취급
// declare module '@/assets/svgs/**/*.svg' {
//   import * as React from 'react';
//   const SVGComponent: React.FunctionComponent<
//     React.SVGProps<SVGSVGElement> & {
//       className?: string,
//       width?: number | string,
//       height?: number | string,
//     }
//   >;
//   export default SVGComponent;
// }
// declare module '*/assets/svgs/**/*.svg' {
//   import * as React from 'react';
//   const SVGComponent: React.FunctionComponent<
//     React.SVGProps<SVGSVGElement> & { className?: string }
//   >;
//   export default SVGComponent;
// }
// // declare module '*.svg' {
// //   const src: string;
// //   export default src;
// // }
