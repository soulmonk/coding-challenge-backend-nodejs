import { ConnectionContext } from 'subscriptions-transport-ws';
import WebSocket = require('ws');

export async function handleGraphQLContext(context: any): Promise<any> {
  return null;
}

export async function handleGraphQLSubscriptionContext(
  connectionParams: object, websocket: WebSocket, context: ConnectionContext): Promise<any> {
  return null;
}
