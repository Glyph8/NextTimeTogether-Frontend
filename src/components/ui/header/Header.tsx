import React from "react";

type Props = {
  title?: string | React.ReactNode;
  leftChild?: React.ReactNode;
  rightChild?: React.ReactNode;
  bgColor?: string;
  setShadow?:boolean;
};

const Header = ({
  title = <></>,
  leftChild = <></>,
  rightChild = <></>,
  bgColor = "#fff",
  setShadow = true,
}: Props) => {
  return (
    <header
      className={`w-full flex flex-row items-center px-6 py-[19px] z-50 ${setShadow && "shadow-[0px_4px_10px_0px_rgba(0,0,0,0.04)]" } `}
      style={{ background: `${bgColor}` }}
    >
      <div className="flex-1 flex justify-start">{leftChild}</div>
      <div className="flex-4 flex justify-center">
        <h1 className="text-center text-lg font-medium leading-tight">
          {title}
        </h1></div>
      <div className="flex-1 flex justify-end">{rightChild}</div>
    </header>
  );
};

export default Header;