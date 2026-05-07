import { getNickName } from "@/api/appointment";
import decryptDataWithCryptoKey from "@/utils/client/crypto/decryptClient";
import { useQuery } from "@tanstack/react-query";

/** 평문 userId 리스트로 닉네임을 ", " 결합한 단일 문자열 반환. */
export const usePromiseMemberNames = (userIds: string[]) => {
  return useQuery({
    queryKey: ["promiseMemberNames", "plain", userIds],
    queryFn: async () => {
      if (!userIds || userIds.length === 0) return "";

      const res = await getNickName({ userIds });
      const names = res?.userInfoDTOList
        ?.map((user) => user.userName ?? "")
        .filter((name): name is string => name.length > 0)
        .join(", ");
      return names ?? "";
    },
    enabled: !!userIds && userIds.length > 0,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * 암호화된 userId 리스트(encUserIds)를 groupKey 로 복호화한 뒤 닉네임 조회.
 * usePromiseMemberNames 와 queryKey 가 충돌하지 않도록 별도 prefix("decrypted") 사용.
 */
export const usePromiseDecryptedMemberNames = (
  encUserIds: string[],
  groupKey?: string | CryptoKey
) => {
  return useQuery({
    queryKey: ["promiseMemberNames", "decrypted", encUserIds, !!groupKey],
    queryFn: async () => {
      if (!encUserIds || encUserIds.length === 0 || !groupKey) return "";

      try {
        const decryptedUserIds = await Promise.all(
          encUserIds.map(async (encryptedId) =>
            decryptDataWithCryptoKey(encryptedId, groupKey, "group_sharekey")
          )
        );

        const res = await getNickName({ userIds: decryptedUserIds });
        const names = res?.userInfoDTOList
          ?.map((user) => user.userName ?? "")
          .filter((name): name is string => name.length > 0)
          .join(", ");

        return names ?? "";
      } catch (error) {
        console.error("[usePromiseDecryptedMemberNames] 복호화/조회 실패:", error);
        return "";
      }
    },
    enabled: !!encUserIds && encUserIds.length > 0 && !!groupKey,
    staleTime: 1000 * 60 * 5,
  });
};
