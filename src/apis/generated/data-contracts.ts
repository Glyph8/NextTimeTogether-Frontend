/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface TimeSlotReqDTO {
  /** @format date */
  date?: string;
  time?: string;
  userIds?: string[];
}

export interface BaseResponseObject {
  /** @format int32 */
  code?: number;
  message?: string;
  result?: any;
}

export interface UserTimeSlotDTO {
  /** @format date */
  date?: string;
  day?:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";
  times?: string[];
}

export interface UserTimeSlotReqDTO {
  dateTime?: UserTimeSlotDTO[];
}

export interface BaseResponseString {
  /** @format int32 */
  code?: number;
  message?: string;
  result?: string;
}

export interface ScheduleConfirmReqDTO {
  promiseId?: string;
  scheduleId?: string;
  /** @format int32 */
  placeId?: number;
  title?: string;
  purpose?: string;
}

export interface PromiseView4Request {
  sheduleIdList?: string[];
}

export interface BaseResponse {
  /** @format int32 */
  code?: number;
  message?: string;
  result?: any;
}

export interface ErrorResponse {
  /** @format int32 */
  code?: number;
  message?: string;
}

export interface PromiseView3Request {
  encPromiseKeyList?: string[];
}

export interface Promiseview2Request {
  promiseIdList?: string[];
}

export interface JoinPromise1Request {
  promiseId?: string;
  encPromiseId?: string;
  encPromiseMemberId?: string;
  encUserId?: string;
  encPromiseKey?: string;
}

export interface JoinPromise1Response {
  message?: string;
}

export interface InvitePromise1Request {
  whichUserIdIn?: Record<string, number>[];
}

export interface InvitePromise1Response {
  whichEmailIn?: string[];
}

export interface GetPromiseBatchReqDTO {
  scheduleIdList?: string[];
}

export interface CreatePromise4Request {
  groupId?: string;
  title?: string;
  type?: string;
  promiseImg?: string;
  managerId?: string;
  /** @format date */
  startDate?: string;
  /** @format date */
  endDate?: string;
}

export interface CreatePromise3Request {
  groupId?: string;
}

export interface CreatePromise2Request {
  groupId?: string;
  encGroupMemberId?: string;
}

export interface CreatePromise1Request {
  encGroupId?: string;
}

export interface PlaceRegisterDTO {
  placeName: string;
  placeAddress: string;
  placeId?: string;
  placeInfo?: string;
  aiPlace?: boolean;
}

export interface UserAIInfoReqDTO {
  /** @format double */
  latitude?: number;
  /** @format double */
  longitude?: number;
  preferredCategories?: string[];
}

export interface UserSignUpDTO {
  userId: string;
  email: string;
  password: string;
  nickname: string;
  wrappedDEK: string;
  telephone?: string;
  age?: string;
  gender?: "MALE" | "FEMALE";
}

export interface OAuth2LoginReqDTO {
  provider: string;
  code: string;
  redirectUri: string;
}

export interface OAuth2LoginDetailReqDTO {
  userId?: string;
  telephone?: string;
  age: string;
  gender: "MALE" | "FEMALE";
  wrappedDEK: string;
}

export interface LoginReqDTO {
  userId: string;
  password: string;
}

export interface UserIdDTO {
  userId: string;
}

export interface ViewGroup3Request {
  /**
   * 그룹 식별자
   * @minLength 1
   * @example "grp_12345"
   */
  groupId: string;
}

export interface ViewGroup2Request {
  /**
   * 그룹 식별자
   * @minLength 1
   * @example "grp_12345"
   */
  groupId: string;
  /**
   * 암호화된 encUserId
   * @minLength 1
   * @example "BASE64-encUserId=="
   */
  encGroupMemberId: string;
}

export interface CreateGroup2Request {
  groupId?: string;
  encGroupId?: string;
  encencGroupMemberId?: string;
  encUserId?: string;
  encGroupKey?: string;
}

export interface CreateGroup1Request {
  groupName?: string;
  groupExplain?: string;
  groupImg?: string;
  explain?: string;
}

export interface LeaveGroup2Request {
  isManager?: boolean;
  encGroupId?: string;
}

export interface LeaveGroup1Response {
  groupId?: string;
  message?: string;
  isManager?: boolean;
}

export interface LeavGroup1Request {
  groupId?: string;
  encGroupId?: string;
}

export interface JoinGroupRequest {
  encryptedValue?: string;
  groupId?: string;
  encGroupId?: string;
  encGroupKey?: string;
  encUserId?: string;
  encencGroupMemberId?: string;
}

export interface JoinGroupResponse {
  result?: string;
}

export interface InviteGroup3Request {
  encryptedValue?: string;
  encryptedEmail?: string;
}

export interface InviteGroup3Response {
  inviteCode?: string;
  explain?: string;
}

export interface InviteGroup2Request {
  encUserId?: string;
  groupId?: string;
}

export interface InviteGroup2Response {
  encGroupKey?: string;
}

export interface InviteGroup1Request {
  groupId?: string;
  encGroupId?: string;
}

export interface InviteGroup1Response {
  encencGroupMemberId?: string;
}

export interface EditGroup3Request {
  /**
   * 그룹 식별자
   * @minLength 1
   * @example "grp_12345"
   */
  groupId: string;
}

export interface EditGroup2Request {
  /**
   * 그룹 식별자
   * @minLength 1
   * @example "grp_12345"
   */
  groupId: string;
  /**
   * 그룹 내 사용자 식별자(복호화 결과)
   * @minLength 1
   * @example "BASE64-encUserId=="
   */
  encUserId: string;
}

export interface EditGroup1Request {
  /**
   * 그룹 식별자
   * @minLength 1
   * @example "grp_12345"
   */
  groupId: string;
  /**
   * 암호화된 그룹 ID
   * @minLength 1
   * @example "BASE64-encGroupId=="
   */
  encGroupId: string;
  /**
   * 수정할 그룹 이름
   * @example "새 그룹명"
   */
  groupName?: string;
  /**
   * 수정할 그룹 이미지 URL
   * @example "https://example.com/image.png"
   */
  groupImg?: string;
  /**
   * 그룹 설명
   * @example "스터디 그룹입니다."
   */
  description?: string;
}

export interface CalendarViewRequest2 {
  scheduleIdList?: string[];
}

export interface BaseResponseListCalendarViewResponse2 {
  /** @format int32 */
  code?: number;
  message?: string;
  result?: CalendarViewResponse2[];
}

export interface CalendarViewResponse2 {
  title?: string;
  content?: string;
  encStartTimeAndEndTime?: string;
}

export interface CalendarViewRequest1 {
  encPromiseKeyList?: string[];
}

export interface BaseResponseCalendarViewResponse1 {
  /** @format int32 */
  code?: number;
  message?: string;
  result?: CalendarViewResponse1;
}

export interface CalendarViewResponse1 {
  scheduleIdList?: string[];
}

export interface CalendarRewriteRequest1 {
  encStartTimeEndTime?: string;
  title?: string;
  content?: string;
  purpose?: string;
  placeName?: string;
  placeAddr?: string;
  encPromiseKey?: string;
  encUserId?: string;
}

export interface BaseResponseCalendarRewriteResponse1 {
  /** @format int32 */
  code?: number;
  message?: string;
  result?: CalendarRewriteResponse1;
}

export interface CalendarRewriteResponse1 {
  encStartTimeAndEndTime?: string;
  title?: string;
  content?: string;
  purpose?: string;
  placeName?: string;
  placeAddr?: string;
}

export interface CalendarCreateRequest1 {
  title?: string;
  content?: string;
  purpose?: string;
  placeName?: string;
  placeAddr?: string;
  encStartTimeAndEndTime?: string;
  encPromiseKey?: string;
  encUserId?: string;
}

export interface BaseResponseCalendarCreateResponse1 {
  /** @format int32 */
  code?: number;
  message?: string;
  result?: CalendarCreateResponse1;
}

export interface CalendarCreateResponse1 {
  scheduleId?: string;
  title?: string;
  content?: string;
  encStartTimeAndEndTime?: string;
}

export interface UserIdsResDTO {
  userIds?: string[];
}

export interface ExitPromiseReqDTO {
  encPromiseId?: string;
  encPromiseKey?: string;
}

export interface TestDTO {
  result?: string;
}

export interface LeaveGroup3Request {
  groupId?: string;
  isManager?: boolean;
  encUserId?: string;
  encencGroupMemberId?: string;
}

export interface LeaveGroup3Response {
  message?: string;
}
