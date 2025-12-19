// [Helper] 색상 매핑 함수 (컴포넌트 내부 혹은 외부에 정의)
export const mapColor = (colorKey?: string) => {
    const colorHexMap: { [key: string]: string } = {
        salmon: "#FDB0A8",
        orange: "#F9B283",
        yellow: "#FADF84",
        lightPurple: "#B8B3F9",
        darkPurple: "#8668F9",
        blue: "#77ABF8",
    };
    return colorKey ? colorHexMap[colorKey] : undefined;
};