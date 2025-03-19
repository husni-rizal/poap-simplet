import type { PaginationProps } from 'naive-ui';
import { PageSize, PAGINATION_LIMIT } from '../values/general.values';
import { PoapStatus } from '../types/poap';
import dayjs from 'dayjs';

export function sleep(timeMs = 1000) {
  return new Promise(resolve => setTimeout(resolve, timeMs));
}

export function delay(fn: Function, delay = 500) {
  setTimeout(fn, delay);
}

export const placeholderPixel =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP88x8AAv0B/cfFKfIAAAAASUVORK5CYII=';

/**
 * min/max inclusive
 */
export function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getEncodedPathAndQuery(route: any) {
  const query = !route.query
    ? ''
    : Object.keys(route.query)
        .map(x => `${x}${route.query[x] ? `=${route.query[x]}` : ''}`)
        .join('&');

  return encodeURIComponent(`${route.path.replace(/\/+$/, '')}/?${query || ''}`);
}

export function getDecodedPathAndQuery(routeStr: string) {
  if (!routeStr || typeof routeStr !== 'string') {
    return '';
  }

  const parts = decodeURIComponent(routeStr).split('?');

  if (parts.length > 1 && !!parts[1]) {
    // Path + query
    const queryStrings = parts[1].split('&');
    const query = {} as any;
    queryStrings.forEach(x => {
      if (x) {
        const sides = x.split('=');
        if (sides.length > 1) {
          query[sides[0]] = sides[1];
        }
      }
    });
    return { path: parts[0], query };
  } else {
    // Just path
    return parts[0];
  }
}

export function areArraysEqual(a1: any, a2: any, sorted = false) {
  if (!a1 || !a2 || !Array.isArray(a1) || !Array.isArray(a2) || a1.length !== a2.length) {
    return false;
  }

  if (sorted) {
    a1 = [...a1].sort();
    a2 = [...a2].sort();
  }

  for (let i = 0; i < a1.length; i++) {
    if (a1[i] !== a2[i]) {
      return false;
    }
  }

  return true;
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

/**
 * Enum
 */
export function enumKeys(E: any): string[] {
  return Object.keys(E).filter(k => isNaN(Number(k)));
}
export function enumValues(E: any): string[] | number[] {
  return enumKeys(E).map(k => E[k as any]);
}
export function enumKeyValues(E: any): KeyValue[] {
  return enumKeys(E).map(k => {
    return { key: k, label: k, value: E[k as any] };
  });
}

export function createPagination(remote = true) {
  return {
    itemCount: remote ? 0 : undefined,
    page: remote ? 1 : undefined,
    pageSize: PAGINATION_LIMIT,
    showSizePicker: true,
    pageSizes: enumValues(PageSize) as number[],
    prefix({ itemCount }: { itemCount: number }) {
      return `${itemCount} total`;
    },
  } as PaginationProps;
}

export function getPoapStatus(start: string, end: string) {
  const currDate = dayjs(new Date());
  const startTime = dayjs(start);
  const endTime = dayjs(end);

  return currDate >= startTime && currDate > endTime
    ? PoapStatus.FINISHED
    : currDate >= startTime
      ? PoapStatus.IN_PROGRESS
      : PoapStatus.WAITING;
}
