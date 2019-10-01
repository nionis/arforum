import { fromMs } from "src/utils";

export const Pagination = async (
  start: number,
  fn: ({ month: number }) => Promise<any>
) => {
  const { month } = fromMs(start);

  const pDate = new Date(start);
  pDate.setUTCMonth(pDate.getUTCMonth() - 1);
  pDate.setUTCHours(0, 0, 0);
  pDate.setUTCMilliseconds(0);

  const next = async () => {
    await fn({ month });

    return Pagination(Number(pDate), fn);
  };

  return {
    next
  };
};
