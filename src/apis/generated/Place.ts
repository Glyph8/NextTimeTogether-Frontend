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



import { HttpClient, RequestParams, ContentType, HttpResponse } from "./http-client";
import { TimeSlotReqDTO, BaseResponseObject, UserTimeSlotDTO, UserTimeSlotReqDTO, BaseResponseString, ScheduleConfirmReqDTO, PromiseView4Request, BaseResponse, ErrorResponse, PromiseView3Request, Promiseview2Request, JoinPromise1Request, JoinPromise1Response, InvitePromise1Request, InvitePromise1Response, GetPromiseBatchReqDTO, CreatePromise4Request, CreatePromise3Request, CreatePromise2Request, CreatePromise1Request, PlaceRegisterDTO, UserAIInfoReqDTO, UserSignUpDTO, OAuth2LoginReqDTO, OAuth2LoginDetailReqDTO, LoginReqDTO, UserIdDTO, ViewGroup3Request, ViewGroup2Request, CreateGroup2Request, CreateGroup1Request, LeaveGroup2Request, LeaveGroup1Response, LeavGroup1Request, JoinGroupRequest, JoinGroupResponse, InviteGroup3Request, InviteGroup3Response, InviteGroup2Request, InviteGroup2Response, InviteGroup1Request, InviteGroup1Response, EditGroup3Request, EditGroup2Request, EditGroup1Request, CalendarViewRequest2, BaseResponseListCalendarViewResponse2, CalendarViewResponse2, CalendarViewRequest1, BaseResponseCalendarViewResponse1, CalendarViewResponse1, CalendarRewriteRequest1, BaseResponseCalendarRewriteResponse1, CalendarRewriteResponse1, CalendarCreateRequest1, BaseResponseCalendarCreateResponse1, CalendarCreateResponse1, UserIdsResDTO, ExitPromiseReqDTO, TestDTO, LeaveGroup3Request, LeaveGroup3Response } from "./data-contracts"

export class Place<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor (http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

            /**
 * No description
 *
 * @tags place-controller
 * @name VotePlace
 * @request POST:/place/vote/{promiseId}/{placeId}
 */
votePlace: (promiseId: string, placeId: number, params: RequestParams = {}) =>
    this.http.request<BaseResponseObject, any>({
        path: `/place/vote/${promiseId}/${placeId}`,
        method: 'POST',
                                                ...params,
    }),            /**
 * No description
 *
 * @tags place-controller
 * @name RegisterPlace
 * @request POST:/place/register/{promiseId}
 */
registerPlace: (promiseId: string, data: (PlaceRegisterDTO)[], params: RequestParams = {}) =>
    this.http.request<BaseResponseObject, any>({
        path: `/place/register/${promiseId}`,
        method: 'POST',
                body: data,                type: ContentType.Json,                ...params,
    }),            /**
 * No description
 *
 * @tags place-controller
 * @name ConfirmedPlace
 * @request POST:/place/confirm/{promiseId}/{placeId}
 */
confirmedPlace: (promiseId: string, placeId: number, params: RequestParams = {}) =>
    this.http.request<BaseResponseObject, any>({
        path: `/place/confirm/${promiseId}/${placeId}`,
        method: 'POST',
                                                ...params,
    }),            /**
 * No description
 *
 * @tags place-controller
 * @name CheckAiPlace
 * @request POST:/place/check/ai/{promiseId}
 */
checkAiPlace: (promiseId: string, data: UserAIInfoReqDTO, params: RequestParams = {}) =>
    this.http.request<BaseResponseObject, any>({
        path: `/place/check/ai/${promiseId}`,
        method: 'POST',
                body: data,                type: ContentType.Json,                ...params,
    }),            /**
 * No description
 *
 * @tags place-controller
 * @name ViewPlaceBoard
 * @request GET:/place/{promiseId}/{page}
 */
viewPlaceBoard: (promiseId: string, page: number, params: RequestParams = {}) =>
    this.http.request<BaseResponseObject, any>({
        path: `/place/${promiseId}/${page}`,
        method: 'GET',
                                                ...params,
    }),            /**
 * No description
 *
 * @tags place-controller
 * @name DeletePlace
 * @request DELETE:/place/{placeId}
 */
deletePlace: (placeId: number, params: RequestParams = {}) =>
    this.http.request<BaseResponseObject, any>({
        path: `/place/${placeId}`,
        method: 'DELETE',
                                                ...params,
    }),            /**
 * No description
 *
 * @tags place-controller
 * @name CancelVotePlace
 * @request DELETE:/place/vote/{placeId}
 */
cancelVotePlace: (placeId: number, params: RequestParams = {}) =>
    this.http.request<BaseResponseObject, any>({
        path: `/place/vote/${placeId}`,
        method: 'DELETE',
                                                ...params,
    }),    }
