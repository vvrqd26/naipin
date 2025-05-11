import { FreshContext, Handler, Handlers } from "$fresh/server.ts";
import { error, ok } from "../../utils/response.ts";
const kv = await Deno.openKv();

export type FeedingRecord = {
  id: string;
  date: number;
  volume: number;
  tags: string;
};

export const handler: Handlers<FeedingRecord[] | []> = {
  async GET(_req: Request, _ctx: FreshContext) {
    const records = kv.list<FeedingRecord>({ prefix: ["feeding_records"] });
    const result = [];
    const maxCount = 50;
    for await (const record of records) {
      // 最多显示maxCount条记录
      result.push(record.value);
    }

    const sortedResult = result.sort((a, b) => b.date - a.date);
    // 删除多余的记录
    if (sortedResult.length > maxCount) {
      const ids = sortedResult.slice(maxCount).map((record) => record.id);
      ids.forEach((id) => {
        kv.delete(["feeding_records", id]);
      });
    }

    return ok(sortedResult.slice(0, maxCount));
  },
  async POST(req, _ctx) {
    const record = (await req.json()) as FeedingRecord;
    if (!record.volume || !record.tags) {
      return error(null, 1, "Missing required fields");
    }

    record.id = crypto.randomUUID();
    if (!record.date) {
      record.date = Date.now();
    }
    const res = await kv.set(["feeding_records", record.id], record);
    return ok(res);
  },
  async PUT(req, _ctx) {
    const record = (await req.json()) as FeedingRecord;
    if (!record.id) {
      return error(null, 1, "Missing required fields");
    }
    const res = await kv.set(["feeding_records", record.id], record);
    return ok(res);
  },
  async DELETE(req, _ctx) {
    const record = (await req.json()) as FeedingRecord;
    if (!record.id) {
      return error(null, 1, "Missing required fields");
    }
    const res = await kv.delete(["feeding_records", record.id]);
    return ok(res);
  },
};
