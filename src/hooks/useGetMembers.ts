import { getNickName } from "@/api/appointment";
import decryptDataWithCryptoKey from "@/utils/client/crypto/decryptClient";
import { useQuery } from "@tanstack/react-query";

// 평문 userId 받아서 닉네임을 1개 문자열로 가져오는 커스텀 훅
export const usePromiseMemberNames = (userIds: string[]) => {
    return useQuery({
        queryKey: ["promiseMemberNames", userIds],
        queryFn: async () => {
            if (!userIds || userIds.length === 0) return "";

            const res = await getNickName({ userIds });
            // 응답에서 닉네임만 추출하여 콤마로 연결된 문자열 생성
            // API 응답 구조에 따라 userInfoDTOList가 없을 수도 있으므로 옵셔널 체이닝 사용
            const names = res?.userInfoDTOList?.map((user: any) => user.userName).join(", ");
            return names;
        },
        // ID가 있을 때만 쿼리 실행
        enabled: !!userIds && userIds.length > 0,
        staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    });
};

export const usePromiseDecryptedMemberNames = (
    encUserIds: string[],
    groupKey?: string | CryptoKey
) => {
    return useQuery({
        // 1. queryKey에 groupKey의 존재 여부를 포함시켜 키가 생기면 다시 캐싱/실행되도록 유도 (선택 사항이나 안전함)
        queryKey: ["promiseMemberNames", encUserIds, !!groupKey],

        queryFn: async () => {
            if (!encUserIds || encUserIds.length === 0 || !groupKey) return "";

            try {
                const decryptedUserIds = await Promise.all(
                    encUserIds.map(async (encryptedId) => {
                        // 2. 수정: encUserIds는 이미 string[]이므로 .userId 접근 제거
                        return await decryptDataWithCryptoKey(
                            encryptedId, // user.userId (X) -> encryptedId (O)
                            groupKey,
                            "group_sharekey"
                        );
                    })
                );

                const res = await getNickName({ userIds: decryptedUserIds });

                // 3. 닉네임 추출 및 결합
                const names = res?.userInfoDTOList
                    ?.map((user: any) => user.userName)
                    .join(", ");

                return names || "";
            } catch (error) {
                console.error("Decryption or Fetching failed:", error);
                return "";
            }
        },

        // 4. 핵심 수정: ID 배열이 있고, "groupKey도 존재해야만" 쿼리 실행
        enabled: !!encUserIds && encUserIds.length > 0 && !!groupKey,
        staleTime: 1000 * 60 * 5,
    });
};