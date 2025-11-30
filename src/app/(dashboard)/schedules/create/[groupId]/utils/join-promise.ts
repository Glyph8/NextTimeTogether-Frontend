import { joinPromise } from "@/api/promise-invite-join";
import { encryptDataClient } from "@/utils/client/crypto/encryptClient";
import { getMasterKey } from "@/utils/client/key-storage";
import testGenerateKey from "@/utils/crypto/generate-key/key-generator";

export const invitePromiseService = async (
  userId: string,
  promiseId: string,
  groupKey: CryptoKey | null
) => {
  const masterkey = await getMasterKey();

  if (!masterkey || !groupKey) {
    return null;
  }

  // 약속 공유키 생성
  // TODO : promiseKey를 join에서 생성하는게 맞나? 그리고 그룹처럼 promiseKey를 응답하는 API가 있는 것인가?
  const promiseKey = await testGenerateKey();

  // TODO : 메일 보내기 생략. 추후 로직 정립 후 적용

  // 개인키로 암호화한 약속 아이디 - role :
  const encPromiseId = await encryptDataClient(
    promiseId,
    masterkey,
    "promise_proxy_user"
  );

  // 개인키로 암호화한 사용자의 아이디
  const encPromiseMemberId = await encryptDataClient(
    userId,
    masterkey,
    "promise_proxy_user"
  );
  // 그룹키로 암호화한 사용자의 아이디 - TODO : 그룹 키로 암호화는 게 맞나?
  const encUserId = await encryptDataClient(
    userId,
    groupKey,
    "group_sharekey"
  );
  // 개인키로 암호화한 약속 공유키
  const encPromiseKey = await encryptDataClient(
    promiseKey,
    masterkey,
    "promise_proxy_user"
  );

  const joinInfo = {
    promiseId,
    encPromiseId,
    encPromiseMemberId,
    encUserId,
    encPromiseKey,
  };

  const joinPromiseResult = await joinPromise(joinInfo);

  return joinPromiseResult;
};
