interface TeamItemProps {
    isSelected: boolean;
    title: string;
    image: string;
}

import Image from "next/image";

export const TeamItem = ({ isSelected, title, image }: TeamItemProps) => {

    const handleClick = () => {

    }

    return (
        <button className="flex flex-col" onClick={handleClick}>
            {
                isSelected ? (
                    <>
                        <div className="w-10 h<-10 bg-stone-50 rounded-lg border border-main overflow-clip">
                            <Image src={image} 
                            width={24}
                            height={24}
                            alt="team"/>
                        </div>
                        <p className="text-center text-main text-xs font-medium leading-6">
                            {title}
                        </p>
                    </>
                ) : (
                    <>
                        <div className="w-10 h-10 bg-stone-50 rounded-lg border border-gray-3 overflow-clip">
                            <Image src={image}
                            width={24}
                            height={24}
                            alt="team"/>
                        </div>
                        <p className="text-center text-gray-2 text-xs font-medium leading-6">
                            {title}
                        </p>
                    </>
                )
            }

        </button>
    )
}