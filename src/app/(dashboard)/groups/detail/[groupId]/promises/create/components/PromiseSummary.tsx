import { DateTimeValue, PurposeType } from "../hooks/use-create-promise";

// 필요한 데이터만 딱 받도록 Props 정의
interface PromiseSummaryProps {
  topic: string;
  purpose: PurposeType;
  schedule: {
    start: DateTimeValue;
    end: DateTimeValue;
  };
  members: string[]; // 전체 멤버 리스트
  selectedMemberIds: string[]; // 선택된 멤버 ID 리스트
}

export const PromiseSummary = ({
  topic,
  purpose,
  schedule,
  members,
  selectedMemberIds,
}: PromiseSummaryProps) => {
  
  // 요일 구하기 헬퍼
  const getDayOfWeek = (year: string, month: string, day: string) => {
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return days[date.getDay()];
  };

  // 1. 멤버 ID -> 이름 변환
  const memberNames = members
    .filter((m) => selectedMemberIds.includes(m))
    .map((m) => m)
    .join(", ");

  // 2. 목적 스타일링
  const purposeLabel = purpose;
  const purposeStyle =
    purpose === "스터디"
      ? "bg-blue-100 text-blue-600"
      : "bg-orange-100 text-orange-600";

  // 3. 날짜/시간 포맷팅
  const { start, end } = schedule;
  const startDay = getDayOfWeek(start.year, start.month, start.day);
  const endDay = getDayOfWeek(end.year, end.month, end.day);

  const dateText = `${start.month}/${start.day} (${startDay}) ~ ${end.month}/${end.day} (${endDay})`;
  const timeText = `${start.ampm} ${start.hour}:${start.minute} ~ ${end.ampm} ${end.hour}:${end.minute}`;

  return (
    <div className="w-full px-4 py-2">
      <dl className="space-y-4 text-base">
        {/* 주제 */}
        <div className="flex">
          <dt className="w-24 min-w-[6rem] text-gray-400 font-medium text-left">
            주제
          </dt>
          <dd className="flex-1 text-gray-900 font-medium text-left truncate">
            {topic || "주제 없음"}
          </dd>
        </div>

        {/* 목적 */}
        <div className="flex items-center">
          <dt className="w-24 min-w-[6rem] text-gray-400 font-medium text-left">
            목적
          </dt>
          <dd className="flex-1 text-left">
            <span
              className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold ${purposeStyle}`}
            >
              {purposeLabel}
            </span>
          </dd>
        </div>

        {/* 날짜 */}
        <div className="flex">
          <dt className="w-24 min-w-[6rem] text-gray-400 font-medium text-left">
            날짜
          </dt>
          <dd className="flex-1 text-gray-900 font-medium text-left">
            {dateText}
          </dd>
        </div>

        {/* 시간 */}
        <div className="flex">
          <dt className="w-24 min-w-[6rem] text-gray-400 font-medium text-left">
            시간
          </dt>
          <dd className="flex-1 text-gray-900 font-medium text-left">
            {timeText}
          </dd>
        </div>

        {/* 참여 인원 */}
        <div className="flex">
          <dt className="w-24 min-w-[6rem] text-gray-400 font-medium text-left">
            참여 인원
          </dt>
          <dd className="flex-1 text-gray-900 font-medium text-left break-keep">
            {memberNames || "선택된 멤버 없음"}
          </dd>
        </div>
      </dl>
      <div className="border-1 mt-8 mb-5"></div>
      <p className="text-center text-lg text-black-1">
        약속을 만드시겠어요?
      </p>
    </div>
  );
};