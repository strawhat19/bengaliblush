export type RecordPaginationIndex = { totalRows: number; pageSize: number; cursors: readonly (number | undefined)[] };

export const createRecordPaginationIndex = (numbers: readonly number[], pageSize: number): RecordPaginationIndex => {
  if (!Number.isSafeInteger(pageSize) || pageSize < 1 || pageSize > 50) throw new Error(`Choose A Valid Page Size`);
  if (numbers.some((number) => !Number.isSafeInteger(number) || number < 1) || new Set(numbers).size !== numbers.length) throw new Error(`Saved Record Numbers Need Attention`);
  const sortedNumbers = [...numbers].sort((first, second) => first - second);
  const cursors = Array.from({ length: Math.max(1, Math.ceil(sortedNumbers.length / pageSize)) }, (_, page) => page ? sortedNumbers?.[page * pageSize - 1] : undefined);
  return { cursors, pageSize, totalRows: sortedNumbers.length };
};
