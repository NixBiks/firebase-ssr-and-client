import { object, string, nullable, type Output } from "valibot";

const identity = object({
  lei: nullable(string()),
  name: string(),
  ticker: string(),
  id: string(),
  isin: string(),
});

const company = object({
  identity,
  id: string(),
});

type Company = Output<typeof company>;

export { company, type Company };
