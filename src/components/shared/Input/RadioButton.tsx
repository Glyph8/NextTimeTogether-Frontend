interface RadioButtonProps {
    id: string;
    name: string;
    value: string;
    label: string;
    checked: boolean;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function RadioButton({ id, name, value, label, checked, handleChange }: RadioButtonProps) {
    return (
        <div className="flex items-center space-x-2">
            <input
                type="radio"
                id={id}
                name={name}
                value={value}
                checked={checked} // 부모의 state와 연결
                onChange={handleChange}   // 부모의 핸들러와 연결
                className="peer hidden" // 1. 라디오 버튼을 숨기고 peer로 지정
            />

            {/* 2. label을 꾸미고, peer-checked를 사용하여 상태에 따라 스타일 변경 */}

            <label
                htmlFor={id}
                className="
          flex items-center justify-center
        space-x-2
          w-4 h-4 outline-1 outline-offset-[-1px] outline-gray-3 rounded-full cursor-pointer
          peer-checked:outline-main
          transition-all duration-200 peer-checked:[&>span]:bg-main
        "
            >
                {/* 선택되었을 때 나타나는 내부 원 */}
                <span className="w-2.5 h-2.5 bg-white peer-checked:bg-main rounded-full transition-all duration-200"></span>
            </label>
            <span className="text-gray-1 text-base font-medium cursor-pointer leading-tight">
                {label}
            </span>
        </div>
    );
}