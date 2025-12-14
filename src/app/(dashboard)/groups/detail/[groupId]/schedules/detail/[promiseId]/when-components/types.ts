// API Response Types
export interface TimeRange {
  startDateTime: string; // "2025-12-01"
  endDateTime: string; // "2025-12-31"
}

export interface TimeSlot {
  times: string; // "09:00:00"
  count: number;
}

export interface AvailableTime {
  date: string; // "2025-11-29"
  times: TimeSlot[];
}

export interface TimeApiResponse {
  code: number;
  message: string;
  result: {
    promiseId: string;
    timeRange: TimeRange;
    availableTimes: AvailableTime[];
  };
}

// Promise Member API Response Types
export interface PromiseMemberApiResponse {
  code: number;
  message: string;
  result: {
    userIds: string[]; // 암호화된 유저 ID 배열
  };
}

// My Schedule API Response Types
export interface MyScheduleApiResponse {
  code: number;
  message: string;
  result: {
    scheduleIds: string[]; // ["2025-11-29T09:00:00", "2025-11-29T09:30:00", ...]
  };
}

// Time Users API Response Types (특정 시간대의 가능/불가능 사용자 목록)
export interface TimeUsersApiResponse {
  code: number;
  message: string;
  result: {
    availableUsers: string[]; // 복호화된 사용자 이름 배열
    unavailableUsers: string[]; // 복호화된 사용자 이름 배열
  };
}

// Dummy data
export const dummyTimeData: TimeApiResponse = {
  code: 200,
  message: "요청에 성공했습니다.",
  result: {
    promiseId: "PROMI-001",
    timeRange: {
      startDateTime: "2025-11-29",
      endDateTime: "2025-12-05",
    },
    availableTimes: [
      {
        date: "2025-11-29", // 금요일 - 저녁 시간대 8명 모두 가능
        times: [
          { times: "18:00:00", count: 8 },
          { times: "18:30:00", count: 8 },
          { times: "19:00:00", count: 8 },
          { times: "19:30:00", count: 7 },
          { times: "20:00:00", count: 6 },
          { times: "20:30:00", count: 5 },
        ],
      },
      {
        date: "2025-11-30", // 토요일 - 오후 시간대 많이 가능
        times: [
          { times: "14:00:00", count: 7 },
          { times: "14:30:00", count: 7 },
          { times: "15:00:00", count: 7 },
          { times: "15:30:00", count: 6 },
          { times: "16:00:00", count: 6 },
          { times: "16:30:00", count: 5 },
          { times: "17:00:00", count: 4 },
        ],
      },
      {
        date: "2025-12-01", // 일요일 - 오전/오후 분산
        times: [
          { times: "10:00:00", count: 3 },
          { times: "10:30:00", count: 3 },
          { times: "11:00:00", count: 4 },
          { times: "15:00:00", count: 5 },
          { times: "15:30:00", count: 6 },
          { times: "16:00:00", count: 6 },
          { times: "16:30:00", count: 5 },
        ],
      },
      {
        date: "2025-12-02", // 월요일 - 저녁만 가능
        times: [
          { times: "19:00:00", count: 4 },
          { times: "19:30:00", count: 5 },
          { times: "20:00:00", count: 5 },
          { times: "20:30:00", count: 4 },
          { times: "21:00:00", count: 3 },
        ],
      },
      {
        date: "2025-12-03", // 화요일 - 저녁 시간대
        times: [
          { times: "18:00:00", count: 2 },
          { times: "18:30:00", count: 3 },
          { times: "19:00:00", count: 4 },
          { times: "19:30:00", count: 4 },
          { times: "20:00:00", count: 3 },
        ],
      },
      {
        date: "2025-12-04", // 수요일 - 저녁 늦은 시간
        times: [
          { times: "20:00:00", count: 3 },
          { times: "20:30:00", count: 4 },
          { times: "21:00:00", count: 4 },
          { times: "21:30:00", count: 3 },
        ],
      },
      {
        date: "2025-12-05", // 목요일 - 일부만 가능
        times: [
          { times: "18:30:00", count: 1 },
          { times: "19:00:00", count: 2 },
          { times: "19:30:00", count: 2 },
          { times: "20:00:00", count: 1 },
        ],
      },
    ],
  },
};

// Dummy data for my calendar (already scheduled times)
export const dummyMyScheduleData: MyScheduleApiResponse = {
  code: 200,
  message: "요청에 성공했습니다.",
  result: {
    scheduleIds: [
      // 11/29 (금) - 오전에 일정 있음
      "2025-11-29T09:00:00",
      "2025-11-29T09:30:00",
      "2025-11-29T10:00:00",
      "2025-11-29T10:30:00",

      // 11/30 (토) - 오후에 일정 있음
      "2025-11-30T14:00:00",
      "2025-11-30T14:30:00",
      "2025-11-30T15:00:00",
      "2025-11-30T15:30:00",
      "2025-11-30T16:00:00",
      "2025-11-30T16:30:00",

      // 12/01 (일) - 저녁에 일정 있음
      "2025-12-01T18:00:00",
      "2025-12-01T18:30:00",
      "2025-12-01T19:00:00",
      "2025-12-01T19:30:00",
      "2025-12-01T20:00:00",

      // 12/03 (화) - 점심시간에 일정 있음
      "2025-12-03T12:00:00",
      "2025-12-03T12:30:00",
      "2025-12-03T13:00:00",
      "2025-12-03T13:30:00",
    ],
  },
};

// Dummy data for promise members (전체 약속 멤버 수)
export const dummyMemberData: PromiseMemberApiResponse & {
  result: {
    userIds: string[];
    decryptedMapping: Record<string, { id: string; name: string }>;
  };
} = {
  code: 200,
  message: "요청에 성공했습니다.",
  result: {
    userIds: [
      "encUser1",
      "encUser2",
      "encUser3",
      "encUser4",
      "encUser5",
      "encUser6",
      "encUser7",
      "encUser8",
    ], // 총 8명
    decryptedMapping: {
      encUser1: { id: "user001", name: "김철수" },
      encUser2: { id: "user002", name: "이영희" },
      encUser3: { id: "user003", name: "박민수" },
      encUser4: { id: "user004", name: "정수진" },
      encUser5: { id: "user005", name: "최지훈" },
      encUser6: { id: "user006", name: "한소희" },
      encUser7: { id: "user007", name: "강동원" },
      encUser8: { id: "user008", name: "윤아름" },
    },
  },
};

// Helper: dummyTimeData를 기반으로 각 시간대의 사용자 가용성 데이터 생성
export function generateDummyTimeUsersData(): Record<
  string,
  TimeUsersApiResponse
> {
  const result: Record<string, TimeUsersApiResponse> = {};
  const allUserIds = dummyMemberData.result.userIds;
  const decryptedMapping = dummyMemberData.result.decryptedMapping;

  dummyTimeData.result.availableTimes.forEach((dayData) => {
    dayData.times.forEach((timeSlot) => {
      const key = `${dayData.date}_${timeSlot.times}`; // "2025-11-29_18:00:00"
      const availableCount = timeSlot.count;

      // count만큼 랜덤하게 사용자 선택 (deterministic하게 하기 위해 shuffle 후 slice)
      const shuffledUsers = [...allUserIds].sort(
        (a, b) => (a + key).charCodeAt(0) - (b + key).charCodeAt(0) // pseudo-random sort
      );

      const availableEncUsers = shuffledUsers.slice(0, availableCount);
      const unavailableEncUsers = shuffledUsers.slice(availableCount);

      result[key] = {
        code: 200,
        message: "요청에 성공했습니다.",
        result: {
          availableUsers: availableEncUsers.map(
            (encId) => decryptedMapping[encId].name
          ),
          unavailableUsers: unavailableEncUsers.map(
            (encId) => decryptedMapping[encId].name
          ),
        },
      };
    });
  });

  return result;
}

// Dummy data for time users (각 시간대별 가능/불가능 사용자)
export const dummyTimeUsersData = generateDummyTimeUsersData();
