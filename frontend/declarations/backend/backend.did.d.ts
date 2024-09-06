import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : bigint } |
  { 'err' : string };
export interface SignatureRequest {
  'id' : bigint,
  'link' : string,
  'name' : string,
  'createdAt' : Time,
  'notes' : [] | [string],
  'signed' : boolean,
}
export type Time = bigint;
export interface _SERVICE {
  'addSignatureRequest' : ActorMethod<
    [string, [] | [string], string],
    Result_1
  >,
  'getSignatureRequests' : ActorMethod<[], Array<SignatureRequest>>,
  'updateSignatureStatus' : ActorMethod<[bigint, boolean], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
