import { ScheduleConfirmReqDTO } from "@/apis/generated/Api";
import { clientBaseApi, handleApiError } from ".";

/** promise/confirm/{groupId} */
export const createSchedule = (groupId: string, data: ScheduleConfirmReqDTO) => {
  return clientBaseApi.schedule
    .confirmSchedule(groupId, data)
    .then((response) => response.data)
    .catch(handleApiError);
};