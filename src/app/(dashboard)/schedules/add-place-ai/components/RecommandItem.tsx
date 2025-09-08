interface RecommandItemProps {
  searchText: string;
  placeName: string;
  placeAddress: string;
}

export const RecommandItem = ({
  searchText,
  placeName,
  placeAddress,
}: RecommandItemProps) => {
  const matched = placeName.match(searchText);
  const unmatched = placeName.replace(searchText, "");
  return (
    <div className="flex flex-col gap-2 text-black-1 text-base font-medium leading-tight">
      <span>
        <span className="text-main">{matched}</span>
        <span>{unmatched}</span>
      </span>
      <span className="text-sm font-normal text-gray-2">{placeAddress}</span>
    </div>
  );
};
