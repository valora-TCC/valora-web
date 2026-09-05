import { useState } from 'react';
import { MARKET_LIST_LIMIT } from '@/features/home/constants';

export function useShowMore<T>(items: T[] | undefined, limit = MARKET_LIST_LIMIT) {
  const [expanded, setExpanded] = useState(false);
  const list = items ?? [];
  const hasMore = list.length > limit;
  const visible = expanded || !hasMore ? list : list.slice(0, limit);
  const hiddenCount = hasMore && !expanded ? list.length - limit : 0;

  return {
    visible,
    expanded,
    hiddenCount,
    toggle: () => setExpanded((value) => !value),
  };
}
