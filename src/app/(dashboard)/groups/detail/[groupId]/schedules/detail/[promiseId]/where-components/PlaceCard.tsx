import { PlaceBoardItem } from "@/api/where2meet";
import Checked from "@/assets/svgs/icons/checked.svg";
import Unchecked from "@/assets/svgs/icons/unchecked.svg";
import X from "@/assets/svgs/icons/x-gray.svg";
import { usePlaceVote } from "./use-place-vote";

interface PlaceCardProps {
  promiseId: string;
  placeInfo: PlaceBoardItem;
  totalMemberCount: number;
}

export const PlaceCard = ({
  promiseId,
  placeInfo,
  totalMemberCount,
}: PlaceCardProps) => {
  const { id, voting, placeName, placeAddr, isRemoved, voted } = placeInfo;

  const { vote, unvote, isPending } = usePlaceVote(promiseId);
  const handleVote = (id: number) => {
    if (isPending) return;
    vote(id);
  };

  const hanldeCancelVote = (id: number) => {
    if (isPending) return;
    unvote(id);
  };

  return (
    <div className="w-full flex-col lg:flex-row flex justify-between rounded-[20px] p-4 bg-white border-gray-3 border-1 gap-2 lg:gap-0">
      <div className="flex flex-col gap-2.5">
        <div className="flex justify-start items-center gap-2 text-base font-medium">
          <span className="text-gray-2">
            <span className="text-main">{voting}</span> / {totalMemberCount}
          </span>
          <span className="text-black-1 leading-tight">{placeName}</span>
          {isRemoved && (
            <button disabled={isPending}>
              <X className="text-gray-1" />
            </button>
          )}
        </div>
        <span className="text-gray-2 text-sm font-normal leading-tight">
          {placeAddr}
        </span>
      </div>
      {voted ? (
        <button
          type="button"
          onClick={() => hanldeCancelVote(id)}
          disabled={isPending}
          className={`${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Checked className="w-7 h-7" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => handleVote(id)}
          disabled={isPending}
          className={`${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Unchecked className="w-7 h-7" />
        </button>
      )}

    </div>
  );
};
