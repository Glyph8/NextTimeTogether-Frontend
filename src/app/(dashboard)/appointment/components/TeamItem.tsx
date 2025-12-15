interface TeamItemProps {
  isSelected: boolean;
  title: string;
  image: string;
}

import { CldImage } from "next-cloudinary";

export const TeamItem = ({ isSelected, title, image }: TeamItemProps) => {
  const handleClick = () => { };


  return (
    <button className="flex flex-col items-center justify-center" onClick={handleClick}>
      {isSelected ? (
        <>
          <div className="w-10 h<-10 bg-stone-50 rounded-lg border border-main overflow-clip">
            {/* <Image src={image} 
                            width={24}
                            height={24}
                            alt="team"/> */}
            <CldImage
              src={image} // 전체 URL을 넣어도 되고, 파일 ID만 넣어도 됨
              alt="image"
              width="40" // 문자열로 넣어도 됨
              height="40"
              className="border-gray-1 rounded-[8px] object-cover"
            />
          </div>
          <p className="text-center text-main text-xs font-medium leading-6">
            {title}
          </p>
        </>
      ) : (
        <>
          <div className="w-10 h-10 bg-stone-50 rounded-lg border border-gray-3 overflow-clip">
            {/* <Image src={image} width={24} height={24} alt="team" /> */}
            <CldImage
              src={image} // 전체 URL을 넣어도 되고, 파일 ID만 넣어도 됨
              alt="image"
              width="40" // 문자열로 넣어도 됨
              height="40"
              className="border-gray-1 rounded-[8px]"
            />
          </div>
          <p className="text-center text-gray-2 text-xs font-medium leading-6">
            {title}
          </p>
        </>
      )}
    </button>
  );
};
