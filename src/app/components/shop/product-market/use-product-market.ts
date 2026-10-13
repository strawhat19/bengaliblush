import { useRef, useState, useEffect } from 'react';
import { initialMarketPreviewRecords, createPreviewResearchRecords } from '@/shared/shop/market-preview';

export const useProductMarket = (categoryId?: string, researchCounts: readonly number[] = [1, 3, 5, 10]) => {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [query, setQuery] = useState(``);
  const [notice, setNotice] = useState(``);
  const [progress, setProgress] = useState(0);
  const [researching, setResearching] = useState(false);
  const [filterCategoryId, setFilterCategoryId] = useState(`all`);
  const [researchCount, setResearchCount] = useState(researchCounts[0] ?? 1);
  const [records, setRecords] = useState(() => [...initialMarketPreviewRecords]);
  const counts = researchCounts.filter((count) => Number.isInteger(count) && count > 0 && count <= 10);
  const selectedCount = counts.includes(researchCount) ? researchCount : counts[0] ?? 1;
  const effectiveCategoryId = categoryId || (filterCategoryId === `all` ? undefined : filterCategoryId);
  const categoryRecords = records.filter((record) => !effectiveCategoryId || record.categoryId === effectiveCategoryId);
  const search = query.trim().toLocaleLowerCase();
  const matches = categoryRecords.filter((record) => `${record.name} ${record.categoryName} ${record.description}`.toLocaleLowerCase().includes(search));

  useEffect(() => () => {
    if (timerRef.current !== null) clearInterval(timerRef.current);
  }, []);

  const previewResearch = () => {
    if (timerRef.current !== null || !counts.length || !categoryRecords.length) return;
    const count = selectedCount;
    const selectedCategoryId = effectiveCategoryId;
    let percentage = 0;
    setNotice(``);
    setProgress(0);
    setResearching(true);
    timerRef.current = setInterval(() => {
      percentage = Math.min(100, percentage + 20);
      setProgress(percentage);
      if (percentage < 100) return;
      if (timerRef.current !== null) clearInterval(timerRef.current);
      timerRef.current = null;
      setRecords((current) => {
        const startNumber = current.reduce((largest, record) => Math.max(largest, record.number), 0);
        return [...current, ...createPreviewResearchRecords(count, startNumber, selectedCategoryId)];
      });
      setResearching(false);
      setNotice(`${count} Concept(s) Added For This Preview Only`);
    }, 240);
  };

  return {
    query, counts, notice, matches, progress, setQuery, researching, selectedCount,
    categoryRecords, researchCount, setResearchCount, previewResearch, filterCategoryId, setFilterCategoryId,
  };
};
