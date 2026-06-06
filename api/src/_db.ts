// =============================================================
// DO NOT MODIFY — managed by platform team
// Thin DynamoDB wrapper over the SST-linked `PocTable`.
// Vibe coders import `db` from this file and call get/put/query/delete.
// See api/INSTRUCTIONS.md "Storage" for the access-pattern cookbook.
// =============================================================

import { Resource } from "sst";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TableName = Resource.PocTable.name;

export type Item = { PK: string; SK: string } & Record<string, unknown>;

export const db = {
  async get<T extends Item = Item>(PK: string, SK: string): Promise<T | null> {
    const r = await client.send(new GetCommand({ TableName, Key: { PK, SK } }));
    return (r.Item as T | undefined) ?? null;
  },

  async put<T extends Item>(item: T): Promise<T> {
    await client.send(new PutCommand({ TableName, Item: item }));
    return item;
  },

  async query<T extends Item = Item>(
    PK: string,
    opts?: { skBeginsWith?: string; limit?: number; reverse?: boolean },
  ): Promise<T[]> {
    const r = await client.send(
      new QueryCommand({
        TableName,
        KeyConditionExpression: opts?.skBeginsWith
          ? "PK = :pk AND begins_with(SK, :sk)"
          : "PK = :pk",
        ExpressionAttributeValues: {
          ":pk": PK,
          ...(opts?.skBeginsWith ? { ":sk": opts.skBeginsWith } : {}),
        },
        Limit: opts?.limit,
        ScanIndexForward: !opts?.reverse,
      }),
    );
    return (r.Items as T[] | undefined) ?? [];
  },

  async delete(PK: string, SK: string): Promise<void> {
    await client.send(new DeleteCommand({ TableName, Key: { PK, SK } }));
  },
};
