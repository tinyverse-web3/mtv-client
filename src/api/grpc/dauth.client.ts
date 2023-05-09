// @generated by protobuf-ts 2.9.0
// @generated from protobuf file "dauth.proto" (package "proto", syntax proto3)
// tslint:disable
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { Dauth } from "./dauth";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { DauthReply } from "./dauth";
import type { VerifyRequest } from "./dauth";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service proto.Dauth
 */
export interface IDauthClient {
    /**
     * @generated from protobuf rpc: Verify(proto.VerifyRequest) returns (proto.DauthReply);
     */
    verify(input: VerifyRequest, options?: RpcOptions): UnaryCall<VerifyRequest, DauthReply>;
}
/**
 * @generated from protobuf service proto.Dauth
 */
export class DauthClient implements IDauthClient, ServiceInfo {
    typeName = Dauth.typeName;
    methods = Dauth.methods;
    options = Dauth.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * @generated from protobuf rpc: Verify(proto.VerifyRequest) returns (proto.DauthReply);
     */
    verify(input: VerifyRequest, options?: RpcOptions): UnaryCall<VerifyRequest, DauthReply> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<VerifyRequest, DauthReply>("unary", this._transport, method, opt, input);
    }
}
