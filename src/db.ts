import "dotenv/config";
import { Temporal } from "@js-temporal/polyfill";
import postgres from "@prisma/orm-postgres/runtime";

import type { Contract } from "../prisma/contract";
import contractJson from "../prisma/contract.json" with { type: "json" };

if (!("Temporal" in globalThis)) {
  Object.assign(globalThis, { Temporal });
}

export const db = postgres<Contract>({
    url: process.env.DATABASE_URL!,
    contractJson,
});