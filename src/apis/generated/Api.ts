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
    securityData: SecurityDataType | null
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
    params2?: AxiosRequestConfig
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
          isFileType ? formItem : this.stringifyFormItem(formItem)
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
  SecurityDataType extends unknown
> extends HttpClient<SecurityDataType> {
  time = {
    /**
     * No description
     *
     * @tags time-controller
     * @name ViewTimeBoard
     * @request GET:/time/{promiseId}
     */
    viewTimeBoard: (promiseId: string, params: RequestParams = {}) =>
      this.request<BaseResponseObject, any>({
        path: `/time/${promiseId}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags time-controller
     * @name ViewUsersByTime
     * @request POST:/time/{promiseId}
     */
    viewUsersByTime: (
      promiseId: string,
      data: TimeSlotReqDTO,
      params: RequestParams = {}
    ) =>
      this.request<BaseResponseObject, any>({
        path: `/time/${promiseId}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags time-controller
     * @name UpdateUserTime
     * @request POST:/time/my/{promiseId}
     */
    updateUserTime: (
      promiseId: string,
      data: UserTimeSlotReqDTO,
      params: RequestParams = {}
    ) =>
      this.request<BaseResponseObject, any>({
        path: `/time/my/${promiseId}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags time-controller
     * @name ConfirmDateTime
     * @request POST:/time/confirm/{promiseId}
     */
    confirmDateTime: (
      promiseId: string,
      data: string,
      params: RequestParams = {}
    ) =>
      this.request<BaseResponseObject, any>({
        path: `/time/confirm/${promiseId}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags time-controller
     * @name LoadUserSchedule
     * @request GET:/time/my/schedule/{promiseId}
     */
    loadUserSchedule: (promiseId: string, params: RequestParams = {}) =>
      this.request<BaseResponseObject, any>({
        path: `/time/my/schedule/${promiseId}`,
        method: "GET",
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
     * No description
     *
     * @tags schedule-controller
     * @name ConfirmSchedule
     * @request POST:/schedule/confirm/{groupId}
     */
    confirmSchedule: (
      groupId: string,
      data: ScheduleConfirmReqDTO,
      params: RequestParams = {}
    ) =>
      this.request<BaseResponseObject, any>({
        path: `/schedule/confirm/${groupId}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
  promise = {
    /**
     * @description 사용자가 속한 그룹 내 확정 완료된 약속별 scheduleId 조회 - 요청: 사용자 인증 (UserPrincipal) + PromiseView4Request (encPromiseKey 리스트) - 처리: PromiseShareKey에서 encPromiseKey로 scheduleId 조회 - 반환: scheduleId 리스트
     *
     * @tags 약속
     * @name View4
     * @summary 약속 디테일 - Step4
     * @request POST:/promise/view4
     * @secure
     */
    view4: (data: PromiseView4Request, params: RequestParams = {}) =>
      this.request<BaseResponse, ErrorResponse>({
        path: `/promise/view4`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 사용자가 속한 그룹 내 (정하는중 + 확정완료) 약속별 scheduleId 조회 - 요청: 사용자 인증 (UserPrincipal) + PromiseView3Request (encPromiseKey 리스트) - 처리: PromiseShareKey에서 encPromiseKey로 scheduleId 조회 - 반환: scheduleId 리스트
     *
     * @tags 약속
     * @name View3
     * @summary 약속 디테일 - Step3
     * @request POST:/promise/view3
     * @secure
     */
    view3: (data: PromiseView3Request, params: RequestParams = {}) =>
      this.request<BaseResponse, ErrorResponse>({
        path: `/promise/view3`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 사용자가 속한 그룹 내 (정하는중) 약속 정보를 조회합니다. - 요청: 사용자 인증 (UserPrincipal) + Promiseview2Request (encPromiseId 리스트) - 처리: Promise, PromiseCheck 테이블에서 약속 확정 여부 조회 - 반환: 약속 정보 리스트
     *
     * @tags 약속
     * @name View2
     * @summary 약속 디테일 - Step2
     * @request POST:/promise/view2
     * @secure
     */
    view2: (data: Promiseview2Request, params: RequestParams = {}) =>
      this.request<BaseResponse, ErrorResponse>({
        path: `/promise/view2`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
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
     * No description
     *
     * @tags schedule-query-controller
     * @name GetPromiseView1
     * @request POST:/promise/get
     */
    getPromiseView1: (
      data: GetPromiseBatchReqDTO,
      params: RequestParams = {}
    ) =>
      this.request<BaseResponseObject, any>({
        path: `/promise/get`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags schedule-query-controller
     * @name GetPromiseView2
     * @request POST:/promise/get/{groupId}
     */
    getPromiseView2: (
      groupId: string,
      data: GetPromiseBatchReqDTO,
      params: RequestParams = {}
    ) =>
      this.request<BaseResponseObject, any>({
        path: `/promise/get/${groupId}`,
        method: "POST",
        body: data,
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
      this.request<BaseResponse, ErrorResponse>({
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
      this.request<BaseResponse, ErrorResponse>({
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
      this.request<BaseResponse, ErrorResponse>({
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
      this.request<BaseResponse, ErrorResponse>({
        path: `/promise/create1`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 로그인한 사용자가 속한 그룹 내 약속을 조회합니다. - 요청: 사용자 인증 (UserPrincipal) - 처리: PromiseProxyUser에서 encPromiseId(개인키로 암호화된 약속 아이디) 조회 - 반환: 개인키로 암호화된 약속 아이디 리스트
     *
     * @tags 약속
     * @name View1
     * @summary 약속 디테일 - Step1
     * @request GET:/promise/view1
     * @secure
     */
    view1: (params: RequestParams = {}) =>
      this.request<BaseResponse, ErrorResponse>({
        path: `/promise/view1`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags schedule-query-controller
     * @name SearchPromiseView
     * @request GET:/promise/search
     */
    searchPromiseView: (
      query: {
        query: string;
        filter?: string[];
      },
      params: RequestParams = {}
    ) =>
      this.request<BaseResponseObject, any>({
        path: `/promise/search`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags 약속
     * @name GetUsersByPromiseTime2
     * @request GET:/promise/mem/s2/{promiseId}
     */
    getUsersByPromiseTime2: (
      promiseId: string,
      data: UserIdsResDTO,
      params: RequestParams = {}
    ) =>
      this.request<BaseResponseObject, any>({
        path: `/promise/mem/s2/${promiseId}`,
        method: "GET",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags 약속
     * @name GetUsersByPromiseTime1
     * @request GET:/promise/mem/s1/{promiseId}
     */
    getUsersByPromiseTime1: (promiseId: string, params: RequestParams = {}) =>
      this.request<BaseResponseObject, any>({
        path: `/promise/mem/s1/${promiseId}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags schedule-query-controller
     * @name GetPromiseDetailView
     * @request GET:/promise/get/{scheduleId}/detail
     */
    getPromiseDetailView: (scheduleId: string, params: RequestParams = {}) =>
      this.request<BaseResponseObject, any>({
        path: `/promise/get/${scheduleId}/detail`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags 약속
     * @name ExitPromise
     * @request GET:/promise/exit
     */
    exitPromise: (data: ExitPromiseReqDTO, params: RequestParams = {}) =>
      this.request<BaseResponseObject, any>({
        path: `/promise/exit`,
        method: "GET",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
  place = {
    /**
     * No description
     *
     * @tags place-controller
     * @name VotePlace
     * @request POST:/place/vote/{promiseId}/{placeId}
     */
    votePlace: (
      promiseId: string,
      placeId: number,
      params: RequestParams = {}
    ) =>
      this.request<BaseResponseObject, any>({
        path: `/place/vote/${promiseId}/${placeId}`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags place-controller
     * @name RegisterPlace
     * @request POST:/place/register/{promiseId}
     */
    registerPlace: (
      promiseId: string,
      data: PlaceRegisterDTO[],
      params: RequestParams = {}
    ) =>
      this.request<BaseResponseObject, any>({
        path: `/place/register/${promiseId}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags place-controller
     * @name ConfirmedPlace
     * @request POST:/place/confirm/{promiseId}/{placeId}
     */
    confirmedPlace: (
      promiseId: string,
      placeId: number,
      params: RequestParams = {}
    ) =>
      this.request<BaseResponseObject, any>({
        path: `/place/confirm/${promiseId}/${placeId}`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags place-controller
     * @name CheckAiPlace
     * @request POST:/place/check/ai/{promiseId}
     */
    checkAiPlace: (
      promiseId: string,
      data: UserAIInfoReqDTO,
      params: RequestParams = {}
    ) =>
      this.request<BaseResponseObject, any>({
        path: `/place/check/ai/${promiseId}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags place-controller
     * @name ViewPlaceBoard
     * @request GET:/place/{promiseId}/{page}
     */
    viewPlaceBoard: (
      promiseId: string,
      page: number,
      params: RequestParams = {}
    ) =>
      this.request<BaseResponseObject, any>({
        path: `/place/${promiseId}/${page}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags place-controller
     * @name DeletePlace
     * @request DELETE:/place/{placeId}
     */
    deletePlace: (placeId: number, params: RequestParams = {}) =>
      this.request<BaseResponseObject, any>({
        path: `/place/${placeId}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags place-controller
     * @name CancelVotePlace
     * @request DELETE:/place/vote/{placeId}
     */
    cancelVotePlace: (placeId: number, params: RequestParams = {}) =>
      this.request<BaseResponseObject, any>({
        path: `/place/vote/${placeId}`,
        method: "DELETE",
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
     * @description 소셜 로그인 시 사용자의 추가정보를 입력한다
     *
     * @tags 인증
     * @name SignUp1
     * @summary 소셜 로그인 회원가입
     * @request POST:/auth/oauth2/login/detail
     */
    signUp1: (data: OAuth2LoginDetailReqDTO, params: RequestParams = {}) =>
      this.request<BaseResponse, ErrorResponse>({
        path: `/auth/oauth2/login/detail`,
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
     * @description 초대코드를 사용하여 그룹에 참여합니다. 서버는 Redis에서 초대코드 유효성을 확인하고, 시도 횟수를 1 증가시킵니다. 검증 후 데이터베이스에 그룹 참여 정보를 저장합니다.
     *
     * @tags 그룹
     * @name JoinGroup
     * @summary 그룹 초대받기 - Step1
     * @request POST:/api/v1/group/join
     * @secure
     */
    joinGroup: (data: JoinGroupRequest, params: RequestParams = {}) =>
      this.request<JoinGroupResponse, ErrorResponse>({
        path: `/api/v1/group/join`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 개인키로 그룹키를 획득 후, 그룹키, 그룹아이디, 랜덤 UUID, 초대할 유저 이메일을 랜덤 6자리 초대암호로 암호화하여 서버에 전달합니다. 서버는 Redis에 TTL 적용 후 저장하며, 초대 링크 유효성을 확인할 수 있습니다.
     *
     * @tags 그룹
     * @name InviteGroup3
     * @summary 그룹 초대 - Step3
     * @request POST:/api/v1/group/invite3
     * @secure
     */
    inviteGroup3: (data: InviteGroup3Request, params: RequestParams = {}) =>
      this.request<InviteGroup3Response, ErrorResponse>({
        path: `/api/v1/group/invite3`,
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
     * No description
     *
     * @tags calendar-manage-controller
     * @name ViewCalendar2
     * @request POST:/api/v1/calendar/view2
     */
    viewCalendar2: (data: CalendarViewRequest2, params: RequestParams = {}) =>
      this.request<BaseResponseListCalendarViewResponse2, any>({
        path: `/api/v1/calendar/view2`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags calendar-manage-controller
     * @name ViewCalendar1
     * @request POST:/api/v1/calendar/view1
     */
    viewCalendar1: (data: CalendarViewRequest1, params: RequestParams = {}) =>
      this.request<BaseResponseCalendarViewResponse1, any>({
        path: `/api/v1/calendar/view1`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags calendar-manage-controller
     * @name RewriteCalendar1
     * @request POST:/api/v1/calendar/rewrite1
     */
    rewriteCalendar1: (
      data: CalendarRewriteRequest1,
      params: RequestParams = {}
    ) =>
      this.request<BaseResponseCalendarRewriteResponse1, any>({
        path: `/api/v1/calendar/rewrite1`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags calendar-manage-controller
     * @name CreateCalendar1
     * @request POST:/api/v1/calendar/create1
     */
    createCalendar1: (
      data: CalendarCreateRequest1,
      params: RequestParams = {}
    ) =>
      this.request<BaseResponseCalendarCreateResponse1, any>({
        path: `/api/v1/calendar/create1`,
        method: "POST",
        body: data,
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
