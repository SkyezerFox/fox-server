export type GatewayEventType = "HEARTBEAT" | "HEARTBEAT_ACK" | "IDENTIFY";

export const GatewayEvents: { [x: string]: GatewayEventType } = {
	HEARTBEAT: "HEARTBEAT",
	HEARTBEAT_ACK: "HEARTBEAT_ACK",
	IDENTIFY: "IDENTIFY",
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
