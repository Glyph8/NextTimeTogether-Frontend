import XWhite from "@/assets/svgs/icons/x-white.svg";

interface TextInputProps {
  label: string;
  data: string;
  setData: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
  isPassword?: boolean;
}

export const TextInput = ({
  label,
  data,
  setData,
  placeholder,
  isPassword = false,
}: TextInputProps) => {
  return (
    <div>
      <span className="text-gray-1 text-sm font-normal leading-tight">
        {label}
      </span>
      <div className="w-full flex justify-between relative">
        <input
          type={`${isPassword ? "password" : "text"}`}
          placeholder={placeholder}
          className="w-full py-2.5 text-black-1 text-base font-medium leading-tight border-b-1 focus:border-b-main"
          onChange={(e) => setData(e.target.value)}
          value={data}
        />

        {data !== "" && (
          <button
            className="absolute right-1 top-3 w-5 h-5 bg-gray-3 rounded-full flex justify-center items-center"
            onClick={() => setData("")}
          >
            <XWhite />
          </button>
        )}
      </div>
    </div>
  );
};
