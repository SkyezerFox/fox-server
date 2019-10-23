export declare type GatewayEventType = "HEARTBEAT" | "HEARTBEAT_ACK" | "IDENTIFY";
export declare const GatewayEvents: {
    [x: string]: GatewayEventType;
};
export interface GatewayEvent {
    op: number;
    d?: {};
    t?: GatewayEventType;
}
export interface HeartbeatEvent extends GatewayEvent {
    d: {};
    t: "HEARTBEAT";
}
export interface HeartbeatACKEvent extends GatewayEvent {
    d: {};
    t: "HEARTBEAT_ACK";
}
export interface IdentifyEvent extends GatewayEvent {
    d: {
        token: string;
    };
    t: "IDENTIFY";
}
