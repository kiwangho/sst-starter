// =============================================================
// DO NOT MODIFY — managed by platform team
// Generic single-table DynamoDB store.
// Vibe coders use it via the `db` helper in api/src/_db.ts —
// see api/INSTRUCTIONS.md "Storage" section for usage patterns.
// =============================================================

export const table = new sst.aws.Dynamo("PocTable", {
  fields: {
    PK: "string",
    SK: "string",
  },
  primaryIndex: { hashKey: "PK", rangeKey: "SK" },
});
