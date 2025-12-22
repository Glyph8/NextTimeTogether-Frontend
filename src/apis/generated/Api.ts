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

export interface TimestampReqDTO {
  dates?: string[];
}

export interface BaseResponse {
  /**
   * 결과 코드
   * @format int32
   * @example 200
   */
  code?: number;
  /**
   * 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  result?: any;
}

export interface TimeSlotReqDTO {
  /** @format date */
  date?: string;
  time?: string;
  userIds?: string[];
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

export interface ConfirmDateReqDTO {
  dateTime?: string;
}

export interface ErrorResponse {
  /** @format int32 */
  code?: number;
  message?: string;
}

export interface BaseResponseString {
  /**
   * 결과 코드
   * @format int32
   * @example 200
   */
  code?: number;
  /**
   * 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  result?: string;
}

export interface ScheduleConfirmReqDTO {
  promiseId?: string;
  scheduleId?: string;
  encTimeStamp?: string;
  /** @format date */
  timeStampInfo?: string;
  /** @format int32 */
  placeId?: number;
  title?: string;
  purpose?: string;
  userList?: string[];
}

export interface PromiseView4Request {
  /**
   * 스케줄 ID 리스트
   * @example ["61a4c8e6-ea48-47d3-9523-9cf09dd6aae4"]
   */
  scheduleIdList?: string[];
}

export interface PromiseView4Response {
  /**
   * 약속 확정 여부
   * @example true
   */
  isConfirmed?: boolean;
  /**
   * 스케줄 ID
   * @example "61a4c8e6-ea48-47d3-9523-9cf09dd6aae4"
   */
  scheduleId?: string;
  /**
   * 확정된 시간
   * @example "20251129T1430-20251129T1630"
   */
  confirmedDateTime?: string;
  /**
   * 제목
   * @example "61a4c8e6-ea48-47d3-9523-9cf09dd6aae4"
   */
  title?: string;
  /**
   * 내용
   * @example "초콜릿다음엔?"
   */
  content?: string;
  /**
   * 목적
   * @example "초콜릿초콜릿"
   */
  purpose?: string;
  /**
   * 장소 이름
   * @example "독서실"
   */
  placeName?: string;
  /**
   * 장소 정보
   * @example "공부하는곳"
   */
  placeInfo?: string;
  /**
   * 그룹 ID
   * @example "d71ac3eb-fc61-4cff-92c7-478a0e092936"
   */
  groupId?: string;
}

export interface PromiseView3Request {
  /**
   * 약속 ID 리스트
   * @example ["e3f971e9-0e41-48b2-bb2e-b7594b98e170"]
   */
  promiseIdList?: string[];
}

export interface PromiseView3Response {
  /**
   * 스케줄 ID
   * @example "61a4c8e6-ea48-47d3-9523-9cf09dd6aae4"
   */
  scheduleId?: string;
}

export interface Promiseview2Request {
  /**
   * 그룹 아이디
   * @example "d71ac3eb-fc61-4cff-92c7-478a0e092936"
   */
  groupId?: string;
  /**
   * 조회할 약속 아이디 리스트
   * @example ["e3f971e9-0e41-48b2-bb2e-b7594b98e170"]
   */
  promiseIdList?: string[];
}

export interface PromiseView2Response {
  /**
   * 약속 확정 여부
   * @example false
   */
  isConfirmed?: boolean;
  /**
   * 약속 ID
   * @example "e3f971e9-0e41-48b2-bb2e-b7594b98e170"
   */
  promiseId?: string;
  /**
   * 약속 제목
   * @example "초콜릿모임"
   */
  title?: string;
  /**
   * 약속 타입
   * @example "스터디"
   */
  type?: string;
  /**
   * 시작 날짜
   * @example "2025-11-14"
   */
  startDate?: string;
  /**
   * 종료 날짜
   * @example "2025-11-19"
   */
  endDate?: string;
  /**
   * 약속 생성자 ID
   * @example "makerid"
   */
  managerId?: string;
  /**
   * 약속 대표 이미지
   * @example "빼빼로만들기-초콜릿"
   */
  promiseImg?: string;
}

export interface PromiseSearchReqDTO {
  pseudoId?: string;
}

export interface GetPromiseRequest {
  promiseId?: string;
  encUserId?: string;
}

export interface GetPromiseKey2 {
  encPromiseKey?: string;
}

export interface GetPromiseKey1 {
  encPromiseIdList?: string[];
}

export interface UserIdsResDTO {
  userIds?: string[];
}

export interface UserInfoDTO {
  userId?: string;
  userName?: string;
  userImg?: string;
}

export interface UserInfoListResDTO {
  userInfoDTOList?: UserInfoDTO[];
}

export interface UserInfoResDTO {
  promiseManager?: string;
  users?: UserInfoDTO[];
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
  message?: string;
}

export interface GetPromiseBatchReqDTO {
  scheduleIdList?: string[];
  pseudoId?: string;
}

export interface PromiseListResDTO {
  promiseResDTOList?: PromiseResDTO[];
}

export interface PromiseResDTO {
  scheduleId?: string;
  title?: string;
  purpose?: string;
  isRated?: boolean;
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

export interface CreatePromise4Response {
  promiseId?: string;
}

export interface CreatePromise3Request {
  groupId?: string;
}

export interface CreatePromise3Response {
  groupId?: string;
  groupName?: string;
  groupImg?: string;
  managerId?: string;
  encUserId?: string[];
}

export interface CreatePromise2Request {
  groupId?: string;
  encGroupMemberId?: string;
}

export interface CreatePromise2Response {
  encGroupKey?: string;
}

export interface CreatePromise1Request {
  encGroupId?: string;
}

export interface CreatePromise1Response {
  encGroupId?: string;
  encencGroupMemberId?: string;
}

export interface PlaceRegisterDTO {
  placeName: string;
  placeAddress: string;
  placeInfo?: string;
  aiPlace?: boolean;
  /** @format int32 */
  aiPlaceId?: number;
}

export interface UserBoardReqDTO {
  pseudoId?: string;
  /** @format int32 */
  rating?: number;
}

export interface BaseResponseObject {
  /**
   * 결과 코드
   * @format int32
   * @example 200
   */
  code?: number;
  /**
   * 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
  result?: any;
}

export interface UserAIInfoReqDTO {
  pseudoId?: string;
  purpose?: string;
  /** @format double */
  latitude?: number;
  /** @format double */
  longitude?: number;
}

export interface UserSignUpDTO {
  userId: string;
  email: string;
  password: string;
  nickname: string;
  imgIv: string;
  emailIv: string;
  phoneIv: string;
  telephone?: string;
  age?: string;
  gender?: "MALE" | "FEMALE";
}

export interface OAuth2LoginReqDTO {
  provider: string;
  code: string;
  redirectUri: string;
}

export interface LoginReqDTO {
  userId: string;
  password: string;
}

export interface OAuth2LoginDetailReqDTO {
  userId?: string;
  telephone?: string;
  age?: string;
  gender?: "MALE" | "FEMALE";
  img?: string;
  imgIv?: string;
  emailIv?: string;
  phoneIv?: string;
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
}

export interface SaveGroupMemberRequest {
  groupId?: string;
  encGroupKey?: string;
  encUserId?: string;
  encGroupId?: string;
  encencGroupMemberId?: string;
}

export interface JoinGroupResponse {
  message?: string;
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

export interface CalendarViewRequest1 {
  timeStampInfoList?: string[];
}

export interface CalendarRewriteRequest1 {
  encStartTimeEndTime?: string;
  title?: string;
  content?: string;
  purpose?: string;
  placeName?: string;
  placeAddr?: string;
  placeInfo?: string;
  encPromiseKey?: string;
  encUserId?: string;
}

export interface BaseResponseCalendarRewriteResponse1 {
  /**
   * 결과 코드
   * @format int32
   * @example 200
   */
  code?: number;
  /**
   * 메시지
   * @example "요청에 성공했습니다."
   */
  message?: string;
  /** 응답 데이터 */
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

export interface CalendarCreateRequest2 {
  encStartTimeAndEndTime?: string;
  /** @format date */
  timeStampInfo?: string;
}

export interface CalendarCreateRequest1 {
  title?: string;
  content?: string;
  purpose?: string;
  placeName?: string;
  placeAddr?: string;
  placeInfo?: string;
}

export interface PromiseView1Response {
  /**
   * 개인키로 암호화된 약속 아이디
   * @example "0cL0PM....=="
   */
  encPromiseId?: string;
}

export interface TestDTO {
  result?: string;
}

export interface GetGroupJoinEmailResponse {
  message?: string;
}

export interface ExitPromiseReqDTO {
  encPromiseId?: string;
  encPromiseKey?: string;
}

export interface DispersePromiseReqDTO {
  promiseId?: string;
  userIds?: string[];
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

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "https://meetnow.duckdns.org",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title 타임투게더 API
 * @version 1.0.0
 * @baseUrl https://meetnow.duckdns.org
 *
 * 개인정보 보호 및 사용자 맞춤형 일정 관리 서비스
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  timestamp = {
    /**
     * @description 타임스탬프를 조회한다
     *
     * @tags 타임스탬프
     * @name GetTimeStampList
     * @summary 타임스탬프 조회
     * @request POST:/timestamp/get
     * @secure
     */
    getTimeStampList: (data: TimestampReqDTO, params: RequestParams = {}) =>
      this.request<BaseResponse, any>({
        path: `/timestamp/get`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  time = {
    /**
     * @description 약속의 시간을 확인한다
     *
     * @tags 시간
     * @name ViewTimeBoard
     * @summary 시간보드
     * @request GET:/time/{promiseId}
     * @secure
     */
    viewTimeBoard: (promiseId: string, params: RequestParams = {}) =>
      this.request<BaseResponse, ErrorResponse>({
        path: `/time/${promiseId}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description 약속 시간을 선택했을때 가능한 / 불가능한 사람을 확인한다
     *
     * @tags 시간
     * @name ViewUsersByTime
     * @summary 가능한 시간 조회
     * @request POST:/time/{promiseId}
     * @secure
     */
    viewUsersByTime: (
      promiseId: string,
      data: TimeSlotReqDTO,
      params: RequestParams = {},
    ) =>
      this.request<BaseResponse, any>({
        path: `/time/${promiseId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 약속에 내 시간을 업데이트한다
     *
     * @tags 시간
     * @name UpdateUserTime
     * @summary 내 시간표 업데이트
     * @request POST:/time/my/{promiseId}
     * @secure
     */
    updateUserTime: (
      promiseId: string,
      data: UserTimeSlotReqDTO,
      params: RequestParams = {},
    ) =>
      this.request<BaseResponse, any>({
        path: `/time/my/${promiseId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 시간을 확정했는지 확인한다
     *
     * @tags 시간
     * @name ConfirmedTimeCheck
     * @summary 시간 확정 확인
     * @request GET:/time/confirm/{promiseId}
     * @secure
     */
    confirmedTimeCheck: (promiseId: string, params: RequestParams = {}) =>
      this.request<BaseResponse, ErrorResponse>({
        path: `/time/confirm/${promiseId}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description 약속 시간을 확정한다
     *
     * @tags 시간
     * @name ConfirmDateTime
     * @summary 약속 시간 확정
     * @request POST:/time/confirm/{promiseId}
     * @secure
     */
    confirmDateTime: (
      promiseId: string,
      data: ConfirmDateReqDTO,
      params: RequestParams = {},
    ) =>
      this.request<BaseResponse, ErrorResponse>({
        path: `/time/confirm/${promiseId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 개인 시간표로부터 스케줄을 로드한다(스케쥴 아이디 반환)
     *
     * @tags 시간
     * @name LoadUserSchedule
     * @summary 스케줄 로드
     * @request GET:/time/my/schedule/{promiseId}
     * @secure
     */
    loadUserSchedule: (promiseId: string, params: RequestParams = {}) =>
      this.request<BaseResponse, ErrorResponse>({
        path: `/time/my/schedule/${promiseId}`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  status = {
    /**
     * No description
     *
     * @tags test-controller
     * @name GetPromiseView
     * @request POST:/status/health
     */
    getPromiseView: (params: RequestParams = {}) =>
      this.request<BaseResponseString, any>({
        path: `/status/health`,
        method: "POST",
        ...params,
      }),
  };
  schedule = {
    /**
     * @description 약속 일정을 확정한다
     *
     * @tags 약속 확정
     * @name ConfirmSchedule
     * @summary 약속 일정 확정
     * @request POST:/schedule/confirm/{groupId}
     * @secure
     */
    confirmSchedule: (
      groupId: string,
      data: ScheduleConfirmReqDTO,
      params: RequestParams = {},
    ) =>
      this.request<BaseResponse, ErrorResponse>({
        path: `/schedule/confirm/${groupId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  promise = {
    /**
     * @description 사용자가 속한 그룹 내 확정 완료된 약속(=스케줄)의 scheduleId 조회 - 요청: 사용자 인증 (UserPrincipal) + ScheduleIdListRequest - 처리: 스케줄 ID로 확정된 약속 정보 조회 - 반환: 확정된 약속 정보 리스트
     *
     * @tags 약속
     * @name View4
     * @summary 약속 디테일 - Step4
     * @request POST:/promise/view4
     * @secure
     */
    view4: (data: PromiseView4Request, params: RequestParams = {}) =>
      this.request<PromiseView4Response, ErrorResponse>({
        path: `/promise/view4`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 사용자가 속한 그룹 내 약속별 scheduleId 조회 - 요청: 사용자 인증 (UserPrincipal) + promiseIdList - 처리: PromiseShareKey에서 encPromiseKey로 scheduleId 조회 - 반환: scheduleId 리스트 - 이후 작업: 다음 요청에서 scheduleId 리스트 필요함
     *
     * @tags 약속
     * @name View3
     * @summary 약속 디테일 - Step3
     * @request POST:/promise/view3
     * @secure
     */
    view3: (data: PromiseView3Request, params: RequestParams = {}) =>
      this.request<PromiseView3Response, ErrorResponse>({
        path: `/promise/view3`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 사용자가 속한 그룹 내 정하는 중인 약속 정보를 조회합니다. - 요청: 사용자 인증 (UserPrincipal) + groupId, promiseIdList - 처리: Promise, PromiseCheck 테이블에서 약속 확정 여부 조회 - 반환: 정하는 중인 약속이 존재하면, 해당 약속 정보 반환 - 이후 작업: 반환된 약속 정보중 promiseId를 리스트 형태로 이후에 요청해야함
     *
     * @tags 약속
     * @name View2
     * @summary 약속 디테일 - Step2
     * @request POST:/promise/view2
     * @secure
     */
    view2: (data: Promiseview2Request, params: RequestParams = {}) =>
      this.request<PromiseView2Response, ErrorResponse>({
        path: `/promise/view2`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 약속일정을 검색한다
     *
     * @tags 약속일정 및 히스토리 조회
     * @name SearchPromiseView
     * @summary 약속일정 검색
     * @request POST:/promise/search
     * @secure
     */
    searchPromiseView: (
      query: {
        query: string;
      },
      data: PromiseSearchReqDTO,
      params: RequestParams = {},
    ) =>
      this.request<BaseResponse, any>({
        path: `/promise/search`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description encPromiseIdList의 각 원소들을 개인키로 복호화한 후, 요청하고 싶은 promise_id를 고르기. - 요청: promiseId, encUserId(그룹키로 암호화한 사용자 아이디) 로 요청 - 응답: promise_id에 해당하는 enc_promise_key (개인키로 암호화한 promise_key) 반환받음
     *
     * @tags 약속
     * @name GetPromiseKey2
     * @summary promisekey를 획득하는 과정 - step2
     * @request POST:/promise/promisekey2
     * @secure
     */
    getPromiseKey2: (data: GetPromiseRequest, params: RequestParams = {}) =>
      this.request<GetPromiseKey2, ErrorResponse>({
        path: `/promise/promisekey2`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description promise_proxy_user 테이블에 있는 enc_promise_id (개인키로 암호화한 promise_id) 리스트 반환
     *
     * @tags 약속
     * @name GetPromiseKey1
     * @summary promisekey를 획득하는 과정 - step1
     * @request POST:/promise/promisekey1
     * @secure
     */
    getPromiseKey1: (params: RequestParams = {}) =>
      this.request<GetPromiseKey1, ErrorResponse>({
        path: `/promise/promisekey1`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description 약속원에 대한 정보를 조회한다
     *
     * @tags 약속
     * @name GetUsersByPromiseTime3
     * @summary 약속원 정보 조회(전체)
     * @request POST:/promise/mem/s2
     * @secure
     */
    getUsersByPromiseTime3: (data: UserIdsResDTO, params: RequestParams = {}) =>
      this.request<UserInfoListResDTO, any>({
        path: `/promise/mem/s2`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 약속원에 대한 정보를 조회한다
     *
     * @tags 약속
     * @name GetUsersByPromiseTime2
     * @summary 약속원 정보 조회(약속아이디)
     * @request POST:/promise/mem/s2/{promiseId}
     * @secure
     */
    getUsersByPromiseTime2: (
      promiseId: string,
      data: UserIdsResDTO,
      params: RequestParams = {},
    ) =>
      this.request<UserInfoResDTO, any>({
        path: `/promise/mem/s2/${promiseId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 사용자가 약속에 참여합니다. - 요청: 사용자 인증 (UserPrincipal) + JoinPromise1Request - 처리: 참여 횟수 확인 후 참여 처리 - 예외: 참여 횟수가 5회를 초과하면 JoinLimitExceededException 발생
     *
     * @tags 약속
     * @name JoinPromise1
     * @summary 약속 참여 - Step1
     * @request POST:/promise/join1
     * @secure
     */
    joinPromise1: (data: JoinPromise1Request, params: RequestParams = {}) =>
      this.request<JoinPromise1Response, BaseResponse>({
        path: `/promise/join1`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 사용자를 약속에 초대합니다. - 요청: 사용자 인증 (UserPrincipal) + InvitePromise1Request - 처리: GroupProxyUser 테이블에서 encGroupMemberId 조회 후 반환 - 반환: encGroupKey 리스트 (InvitePromise1Response)
     *
     * @tags 약속
     * @name InvitePromise1
     * @summary 약속 초대 - Step1
     * @request POST:/promise/invite1
     * @secure
     */
    invitePromise1: (data: InvitePromise1Request, params: RequestParams = {}) =>
      this.request<InvitePromise1Response, BaseResponse>({
        path: `/promise/invite1`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 약속일정을 조회한다
     *
     * @tags 약속일정 및 히스토리 조회
     * @name GetPromiseView1
     * @summary 약속일정 조회
     * @request POST:/promise/get
     * @secure
     */
    getPromiseView1: (
      data: GetPromiseBatchReqDTO,
      params: RequestParams = {},
    ) =>
      this.request<PromiseListResDTO, any>({
        path: `/promise/get`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 그룹별 약속일정을 조회한다
     *
     * @tags 약속일정 및 히스토리 조회
     * @name GetPromiseView2
     * @summary 그룹별 약속일정 조회
     * @request POST:/promise/get/{groupId}
     * @secure
     */
    getPromiseView2: (
      groupId: string,
      data: GetPromiseBatchReqDTO,
      params: RequestParams = {},
    ) =>
      this.request<BaseResponse, ErrorResponse>({
        path: `/promise/get/${groupId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 개인키로 암호화한 그룹키를 복호화 후 이전 저장한 그룹 아이디 기준으로 GroupShareKey 레코드 리스트 조회 (최종 단계). - 요청: 사용자 인증 (UserPrincipal) + CreatePromise4Request - 처리: 그룹 내 그룹원 정보 조회 - 반환: 그룹원 리스트
     *
     * @tags 약속
     * @name CreatePromise4
     * @summary 약속 만들기 - Step4
     * @request POST:/promise/create4
     * @secure
     */
    createPromise4: (data: CreatePromise4Request, params: RequestParams = {}) =>
      this.request<CreatePromise4Response, ErrorResponse>({
        path: `/promise/create4`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 개인키로 암호화한 그룹키를 복호화 후 이전 저장한 그룹 아이디 기준으로 GroupShareKey 레코드 리스트 조회. - 요청: CreatePromise3Request - 처리: 그룹 내 그룹원 정보 조회 - 반환: 그룹원 리스트
     *
     * @tags 약속
     * @name CreatePromise3
     * @summary 약속 만들기 - Step3
     * @request POST:/promise/create3
     * @secure
     */
    createPromise3: (data: CreatePromise3Request, params: RequestParams = {}) =>
      this.request<CreatePromise3Response, ErrorResponse>({
        path: `/promise/create3`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 개인키로 암호화된 그룹 아이디와 사용자 고유 아이디를 복호화하여 GroupShareKey 정보를 조회합니다. - 요청: 사용자 인증 (UserPrincipal) + CreatePromise2Request - 처리: 그룹 아이디, 사용자 고유 아이디 기준으로 GroupShareKey 조회 - 반환: 개인키로 암호화한 그룹키 리스트
     *
     * @tags 약속
     * @name CreatePromise2
     * @summary 약속 만들기 - Step2
     * @request POST:/promise/create2
     * @secure
     */
    createPromise2: (data: CreatePromise2Request, params: RequestParams = {}) =>
      this.request<CreatePromise2Response, ErrorResponse>({
        path: `/promise/create2`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 사용자 개인키로 암호화된 그룹 정보를 조회하는 단계입니다. - 요청: 사용자 인증 (UserPrincipal) + CreatePromise1Request - 처리: GroupProxyUser에서 userId 기반 그룹 정보 조회 - 반환: 개인키로 암호화된 그룹 아이디와 그룹키로 암호화된 사용자 고유 아이디 리스트
     *
     * @tags 약속
     * @name CreatePromise1
     * @summary 약속 만들기 - Step1
     * @request POST:/promise/create1
     * @secure
     */
    createPromise1: (data: CreatePromise1Request, params: RequestParams = {}) =>
      this.request<CreatePromise1Response, ErrorResponse>({
        path: `/promise/create1`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 로그인한 사용자가 속한 약속 아이디를 모두 조회합니다. - 요청: accesstoken -> 사용자 인증 (UserPrincipal) - 처리: PromiseProxyUser에서 encPromiseId(개인키로 암호화된 약속 아이디) 조회 - 반환: 개인키로 암호화된 약속 아이디 리스트 - 이후 작업: 개인키로 복호화해 약속 아이디 리스트 얻음
     *
     * @tags 약속
     * @name View1
     * @summary 약속 디테일 - Step1
     * @request GET:/promise/view1
     * @secure
     */
    view1: (
      query?: {
        groupId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PromiseView1Response, ErrorResponse>({
        path: `/promise/view1`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description 암호화된 약속원들의 아이디를 조회한다
     *
     * @tags 약속
     * @name GetUsersByPromiseTime1
     * @summary 암호화된 약속원들의 아이디 조회
     * @request GET:/promise/mem/s1/{promiseId}
     * @secure
     */
    getUsersByPromiseTime1: (promiseId: string, params: RequestParams = {}) =>
      this.request<UserIdsResDTO, any>({
        path: `/promise/mem/s1/${promiseId}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description 약속일정을 상세 조회한다
     *
     * @tags 약속일정 및 히스토리 조회
     * @name GetPromiseDetailView
     * @summary 약속일정 상세 조회
     * @request GET:/promise/get/{scheduleId}/detail
     * @secure
     */
    getPromiseDetailView: (scheduleId: string, params: RequestParams = {}) =>
      this.request<BaseResponse, ErrorResponse>({
        path: `/promise/get/${scheduleId}/detail`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description 약속을 나갈 경우 약속관련 테이블을 삭제한다
     *
     * @tags 약속
     * @name ExitPromise
     * @summary 약속 나가기
     * @request DELETE:/promise/exit
     * @secure
     */
    exitPromise: (data: ExitPromiseReqDTO, params: RequestParams = {}) =>
      this.request<BaseResponse, any>({
        path: `/promise/exit`,
        method: "DELETE",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 약속을 해산할 경우 약속관련 테이블을 모두 삭제한다
     *
     * @tags 약속
     * @name DispersePromise
     * @summary 약속 해산하기
     * @request DELETE:/promise/disperse
     * @secure
     */
    dispersePromise: (
      data: DispersePromiseReqDTO,
      params: RequestParams = {},
    ) =>
      this.request<BaseResponse, any>({
        path: `/promise/disperse`,
        method: "DELETE",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  place = {
    /**
     * @description 공유된 장소를 투표한다(무조건 1번 가능)
     *
     * @tags 장소
     * @name VotePlace
     * @summary 공유된 장소 투표
     * @request POST:/place/vote/{promiseId}/{placeId}
     * @secure
     */
    votePlace: (
      promiseId: string,
      placeId: number,
      params: RequestParams = {},
    ) =>
      this.request<BaseResponse, ErrorResponse>({
        path: `/place/vote/${promiseId}/${placeId}`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description 장소를 등록한다
     *
     * @tags 장소
     * @name RegisterPlace
     * @summary 장소 등록
     * @request POST:/place/register/{promiseId}
     * @secure
     */
    registerPlace: (
      promiseId: string,
      data: PlaceRegisterDTO[],
      params: RequestParams = {},
    ) =>
      this.request<BaseResponse, ErrorResponse>({
        path: `/place/register/${promiseId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 사용자의 장소 평점을 업데이트한다
     *
     * @tags 장소
     * @name UpdatePlaceRating
     * @summary 장소 평점 업데이트
     * @request POST:/place/rating/{placeId}
     * @secure
     */
    updatePlaceRating: (
      placeId: number,
      data: UserBoardReqDTO,
      params: RequestParams = {},
    ) =>
      this.request<BaseResponse, ErrorResponse>({
        path: `/place/rating/${placeId}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 방장일 시 장소를 확정한다
     *
     * @tags 장소
     * @name ConfirmedPlace
     * @summary 장소 확정
     * @request POST:/place/confirm/{promiseId}/{placeId}
     * @secure
     */
    confirmedPlace: (
      promiseId: string,
      placeId: number,
      query?: {
        /** @format int32 */
        aiPlaceId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<BaseResponse, ErrorResponse>({
        path: `/place/confirm/${promiseId}/${placeId}`,
        method: "POST",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description 개발 환경에서만 AI 학습을 수동으로 트리거한다
     *
     * @tags 장소
     * @name TrainPlace
     * @summary [DEV ONLY] AI 학습 트리거
     * @request POST:/place/ai/train
     * @secure
     */
    trainPlace: (params: RequestParams = {}) =>
      this.request<BaseResponseObject, any>({
        path: `/place/ai/train`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description 사용자 맞춤형 장소를 추천한다
     *
     * @tags 장소
     * @name RecommendPlace
     * @summary AI로 장소 추천
     * @request POST:/place/ai/recommend
     * @secure
     */
    recommendPlace: (data: UserAIInfoReqDTO, params: RequestParams = {}) =>
      this.request<BaseResponse, ErrorResponse>({
        path: `/place/ai/recommend`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 공유된 장소를 확인한다
     *
     * @tags 장소
     * @name ViewPlaceBoard
     * @summary 장소보드
     * @request GET:/place/{promiseId}/{page}
     * @secure
     */
    viewPlaceBoard: (
      promiseId: string,
      page: number,
      params: RequestParams = {},
    ) =>
      this.request<BaseResponse, ErrorResponse>({
        path: `/place/${promiseId}/${page}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description 장소를 확정했는지 확인한다
     *
     * @tags 장소
     * @name ConfirmedPlaceCheck
     * @summary 장소 확정 확인
     * @request GET:/place/confirm/{promiseId}
     * @secure
     */
    confirmedPlaceCheck: (promiseId: string, params: RequestParams = {}) =>
      this.request<BaseResponse, ErrorResponse>({
        path: `/place/confirm/${promiseId}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description 내가 공유한 장소를 삭제한다
     *
     * @tags 장소
     * @name DeletePlace
     * @summary 공유된 장소 삭제
     * @request DELETE:/place/{placeId}
     * @secure
     */
    deletePlace: (placeId: number, params: RequestParams = {}) =>
      this.request<BaseResponse, ErrorResponse>({
        path: `/place/${placeId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description 공유된 장소에 대한 투표를 취소한다
     *
     * @tags 장소
     * @name CancelVotePlace
     * @summary 공유된 장소 투표 취소
     * @request DELETE:/place/vote/{placeId}
     * @secure
     */
    cancelVotePlace: (placeId: number, params: RequestParams = {}) =>
      this.request<BaseResponse, ErrorResponse>({
        path: `/place/vote/${placeId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  auth = {
    /**
     * @description 회원가입을 진행한다
     *
     * @tags 인증
     * @name SignUp
     * @summary 회원가입
     * @request POST:/auth/sign-up
     */
    signUp: (data: UserSignUpDTO, params: RequestParams = {}) =>
      this.request<BaseResponse, ErrorResponse>({
        path: `/auth/sign-up`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 액세스 토큰을 재발급한다
     *
     * @tags 인증
     * @name ReissueToken
     * @summary 액세스 토큰 재발급
     * @request POST:/auth/refresh
     * @secure
     */
    reissueToken: (params: RequestParams = {}) =>
      this.request<BaseResponse, ErrorResponse>({
        path: `/auth/refresh`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description 소셜 로그인을 진행한다
     *
     * @tags 인증
     * @name Login
     * @summary 소셜 로그인
     * @request POST:/auth/oauth2/login
     */
    login: (data: OAuth2LoginReqDTO, params: RequestParams = {}) =>
      this.request<BaseResponse, ErrorResponse>({
        path: `/auth/oauth2/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 로그아웃한다
     *
     * @tags 인증
     * @name Logout
     * @summary 로그아웃
     * @request POST:/auth/logout
     * @secure
     */
    logout: (params: RequestParams = {}) =>
      this.request<BaseResponse, ErrorResponse>({
        path: `/auth/logout`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description 일반 로그인을 진행한다
     *
     * @tags 인증
     * @name Login1
     * @summary 일반 로그인
     * @request POST:/auth/login
     */
    login1: (data: LoginReqDTO, params: RequestParams = {}) =>
      this.request<BaseResponse, ErrorResponse>({
        path: `/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 소셜 로그인 시 사용자의 추가정보를 입력한다
     *
     * @tags 인증
     * @name SignUp1
     * @summary 소셜 로그인 회원가입
     * @request POST:/auth/login/detail
     */
    signUp1: (data: OAuth2LoginDetailReqDTO, params: RequestParams = {}) =>
      this.request<BaseResponse, ErrorResponse>({
        path: `/auth/login/detail`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth-check-controller
     * @name CheckDuplicateId
     * @request POST:/auth/check/id
     */
    checkDuplicateId: (data: UserIdDTO, params: RequestParams = {}) =>
      this.request<BaseResponseString, any>({
        path: `/auth/check/id`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags 인증
     * @name RestDocsTestApi
     * @request GET:/auth/restDocsTest
     */
    restDocsTestApi: (params: RequestParams = {}) =>
      this.request<TestDTO, any>({
        path: `/auth/restDocsTest`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 인증
     * @name RestDocsTestParameterApi
     * @request GET:/auth/restDocsTest/{id}
     */
    restDocsTestParameterApi: (id: number, params: RequestParams = {}) =>
      this.request<TestDTO, any>({
        path: `/auth/restDocsTest/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 액세스 토큰을 재발급을 위해 아이디를 검증한다
     *
     * @tags auth-check-controller
     * @name ReissueToken1
     * @summary 액세스 토큰 재발급 가능 확인
     * @request GET:/auth/check/refresh
     * @secure
     */
    reissueToken1: (params: RequestParams = {}) =>
      this.request<BaseResponse, ErrorResponse>({
        path: `/auth/check/refresh`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  api = {
    /**
     * @description 개인키로 암호화된 그룹키를 이용하여 그룹 레코드 및 그룹 정보를 조회하는 단계입니다. - 요청: List<ViewGroup3Request> (이전 단계에서 저장한 그룹 ID 및 그룹키) - 처리: 해당 그룹 ID에 대한 레코드 및 그룹 정보 조회 - 반환: List<ViewGroup3Response> (그룹 정보 및 레코드 리스트)
     *
     * @tags 그룹
     * @name ViewGroup3
     * @summary 그룹 메인 보기 - Step3
     * @request POST:/api/v1/group/view3
     * @secure
     */
    viewGroup3: (data: ViewGroup3Request[], params: RequestParams = {}) =>
      this.request<BaseResponse, ErrorResponse>({
        path: `/api/v1/group/view3`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 암호화된 그룹 ID와 그룹키로 암호화한 사용자 고유 아이디를 기반으로 그룹키 정보를 조회하는 단계입니다. - 요청: List<ViewGroup2Request> (암호화된 그룹 ID 및 사용자 ID) - 처리: GroupShareKey 테이블에서 개인키로 암호화한 그룹키 조회 - 반환: List<ViewGroup2Response> (개인키로 암호화된 그룹키)
     *
     * @tags 그룹
     * @name ViewGroup2
     * @summary 그룹 메인 보기 - Step2
     * @request POST:/api/v1/group/view2
     * @secure
     */
    viewGroup2: (data: ViewGroup2Request[], params: RequestParams = {}) =>
      this.request<BaseResponse, ErrorResponse>({
        path: `/api/v1/group/view2`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 그룹 키 및 암호화 정보를 포함하여 그룹을 최종 생성하는 단계입니다. - 요청: GroupId, 개인키/그룹키로 암호화한 사용자 아이디 등(CreateGroup2Request) - 처리: GroupProxyUser, Group, GroupShareKey 테이블에 저장 - 반환: 생성 결과(CreateGroup2Response)
     *
     * @tags 그룹
     * @name CreateGroup2
     * @summary 그룹 만들기 - Step2
     * @request POST:/api/v1/group/new2
     * @secure
     */
    createGroup2: (data: CreateGroup2Request, params: RequestParams = {}) =>
      this.request<BaseResponse, ErrorResponse>({
        path: `/api/v1/group/new2`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 예비 방장이 그룹 정보를 생성하는 단계입니다. - 요청: 그룹 정보(CreateGroup1Request) - 처리: Group 테이블에 요청 기반으로 그룹 저장 - 반환: 생성된 Group의 아이디를 포함한 CreateGroup1Response
     *
     * @tags 그룹
     * @name CreateGroup1
     * @summary 그룹 만들기 - Step1
     * @request POST:/api/v1/group/new1
     * @secure
     */
    createGroup1: (data: CreateGroup1Request, params: RequestParams = {}) =>
      this.request<BaseResponse, ErrorResponse>({
        path: `/api/v1/group/new1`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 가공된 정보들을 받아 GroupProxyUser와 GroupShareKey 테이블에 저장합니다. 그룹 참여가 완료되면 성공 메시지를 반환합니다.
     *
     * @tags 그룹
     * @name SaveGroupMember
     * @summary 그룹 멤버 저장
     * @request POST:/api/v1/group/member/save
     * @secure
     */
    saveGroupMember: (
      data: SaveGroupMemberRequest,
      params: RequestParams = {},
    ) =>
      this.request<JoinGroupResponse, ErrorResponse>({
        path: `/api/v1/group/member/save`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 서버에서 그룹에서 나가겠냐는 메시지를 반환합니다. 사용자 확인 후, 나가기 전 메시지를 안내합니다.
     *
     * @tags 그룹
     * @name LeaveGroup2
     * @summary 그룹 나가기 - Step1
     * @request POST:/api/v1/group/leave2
     * @secure
     */
    leaveGroup2: (data: LeaveGroup2Request, params: RequestParams = {}) =>
      this.request<LeaveGroup1Response, ErrorResponse>({
        path: `/api/v1/group/leave2`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 서버에서 그룹에서 나가겠냐는 메시지를 반환합니다. 사용자 확인 후, 나가기 전 메시지를 안내합니다.
     *
     * @tags 그룹
     * @name LeaveGroup1
     * @summary 그룹 나가기 - Step1
     * @request POST:/api/v1/group/leave1
     * @secure
     */
    leaveGroup1: (data: LeavGroup1Request, params: RequestParams = {}) =>
      this.request<LeaveGroup1Response, ErrorResponse>({
        path: `/api/v1/group/leave1`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 개인키로 encencGroupMemberId를 복호화하여 encUserId를 획득 후, encUserId와 groupId로 encGroupKey를 요청합니다.
     *
     * @tags 그룹
     * @name InviteGroup2
     * @summary 그룹 초대 - Step2
     * @request POST:/api/v1/group/invite2
     * @secure
     */
    inviteGroup2: (data: InviteGroup2Request, params: RequestParams = {}) =>
      this.request<InviteGroup2Response, ErrorResponse>({
        path: `/api/v1/group/invite2`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 그룹원이 groupId와 개인키로 암호화한 그룹 아이디를 서버에 전송하면, 서버는 GroupProxyUser 테이블에서 encencGroupMemberId를 반환합니다.
     *
     * @tags 그룹
     * @name InviteGroup1
     * @summary 그룹 초대 - Step1
     * @request POST:/api/v1/group/invite1
     * @secure
     */
    inviteGroup1: (data: InviteGroup1Request, params: RequestParams = {}) =>
      this.request<InviteGroup1Response, ErrorResponse>({
        path: `/api/v1/group/invite1`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description - 요청: 클라이언트가 개인키로 encGroupKey 를 복호화한 후 그룹키 저장 및 groupId 전송 - 처리: GroupShareKey 테이블에서 해당 groupId로 encUserId 리스트 조회 후 그룹 정보 반환
     *
     * @tags 그룹
     * @name EditGroup3
     * @summary 그룹 정보 수정 - Step3
     * @request POST:/api/v1/group/edit3
     * @secure
     */
    editGroup3: (data: EditGroup3Request, params: RequestParams = {}) =>
      this.request<any, ErrorResponse>({
        path: `/api/v1/group/edit3`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description - 요청: 클라이언트가 encencGroupMemberId 를 복호화해 얻은 encUserId 와 groupId 전송 - 처리: GroupShareKey 테이블에서 groupId, encUserId 에 해당하는 encGroupKey 반환
     *
     * @tags 그룹
     * @name EditGroup2
     * @summary 그룹 정보 수정 - Step2
     * @request POST:/api/v1/group/edit2
     * @secure
     */
    editGroup2: (data: EditGroup2Request, params: RequestParams = {}) =>
      this.request<BaseResponse, ErrorResponse>({
        path: `/api/v1/group/edit2`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 방장이 그룹 정보를 수정하는 단계입니다. - 요청: 방장이 userId와 개인키로 암호화한 그룹 아이디(encGroupId), 그룹 아이디, 수정하려는 request - 처리: Group 내 managerId == userId 인 경우 수정 요청을 반영하여 저장 - 반환: GroupProxyUser 테이블에서 userId, encGroupId 에 해당하는 encencGroupMemberId
     *
     * @tags 그룹
     * @name EditGroup1
     * @summary 그룹 정보 수정 - Step1
     * @request POST:/api/v1/group/edit1
     */
    editGroup1: (data: EditGroup1Request, params: RequestParams = {}) =>
      this.request<BaseResponse, ErrorResponse>({
        path: `/api/v1/group/edit1`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description scheduleId 리스트로 스케줄 정보와 장소 정보를 조회한다
     *
     * @tags 캘린더 관리
     * @name ViewCalendar2
     * @summary 개인 일정 조회 Step2
     * @request POST:/api/v1/calendar/view2
     * @secure
     */
    viewCalendar2: (data: CalendarViewRequest2, params: RequestParams = {}) =>
      this.request<BaseResponse, any>({
        path: `/api/v1/calendar/view2`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description timeStampInfo 리스트로 encTimeStamp 리스트를 조회한다
     *
     * @tags 캘린더 관리
     * @name ViewCalendar1
     * @summary 개인 일정 조회 Step1
     * @request POST:/api/v1/calendar/view1
     * @secure
     */
    viewCalendar1: (data: CalendarViewRequest1, params: RequestParams = {}) =>
      this.request<BaseResponse, any>({
        path: `/api/v1/calendar/view1`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 캘린더 관리
     * @name RewriteCalendar1
     * @request POST:/api/v1/calendar/rewrite1
     * @secure
     */
    rewriteCalendar1: (
      data: CalendarRewriteRequest1,
      params: RequestParams = {},
    ) =>
      this.request<BaseResponseCalendarRewriteResponse1, any>({
        path: `/api/v1/calendar/rewrite1`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 개인 일정의 시간 정보(encStartTimeAndEndTime, timeStampInfo)를 저장한다
     *
     * @tags 캘린더 관리
     * @name CreateCalendar2
     * @summary 일정 등록 Step2
     * @request POST:/api/v1/calendar/create2
     * @secure
     */
    createCalendar2: (
      data: CalendarCreateRequest2,
      params: RequestParams = {},
    ) =>
      this.request<BaseResponse, any>({
        path: `/api/v1/calendar/create2`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 일정 기본 정보(제목, 내용, 목적, 장소)를 등록한다
     *
     * @tags 캘린더 관리
     * @name CreateCalendar1
     * @summary 일정 등록 Step1
     * @request POST:/api/v1/calendar/create1
     * @secure
     */
    createCalendar1: (
      data: CalendarCreateRequest1,
      params: RequestParams = {},
    ) =>
      this.request<BaseResponse, any>({
        path: `/api/v1/calendar/create1`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 사용자 개인키로 암호화된 그룹 정보를 조회하는 단계입니다. - 요청: 사용자 인증 (UserPrincipal) - 처리: GroupProxyUser에서 userId 기반 그룹 정보 조회 - 반환: 개인키로 암호화된 그룹 아이디와 그룹키로 암호화된 사용자 고유 아이디 리스트
     *
     * @tags 그룹
     * @name ViewGroup1
     * @summary 그룹 메인 보기 - Step1
     * @request GET:/api/v1/group/view1
     * @secure
     */
    viewGroup1: (params: RequestParams = {}) =>
      this.request<BaseResponse, ErrorResponse>({
        path: `/api/v1/group/view1`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description 그룹 참가 URL에 접속한 후 로그인한 사용자의 이메일을 반환합니다.
     *
     * @tags 그룹
     * @name GetGroupJoinEmail
     * @summary 그룹 참가 - 이메일 조회
     * @request GET:/api/v1/group/join/{groupId}
     * @secure
     */
    getGroupJoinEmail: (groupId: string, params: RequestParams = {}) =>
      this.request<GetGroupJoinEmailResponse, ErrorResponse>({
        path: `/api/v1/group/join/${groupId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description 서버에서 사용자의 퇴장 처리 혹은 방장인 경우 그룹 전체 삭제 처리합니다.
     *
     * @tags 그룹
     * @name LeaveGroup3
     * @summary 그룹 나가기 - Step3
     * @request DELETE:/api/v1/group/leave3
     * @secure
     */
    leaveGroup3: (data: LeaveGroup3Request, params: RequestParams = {}) =>
      this.request<LeaveGroup3Response, ErrorResponse>({
        path: `/api/v1/group/leave3`,
        method: "DELETE",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
