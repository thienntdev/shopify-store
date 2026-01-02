import { ReadonlyURLSearchParams } from "next/navigation";

export function ensureStartsWith(str: string, prefix: string) {
    return str.startsWith(prefix) ? str : prefix + str;
}

export function createUrl(
    pathname: string,
    params: URLSearchParams | ReadonlyURLSearchParams
  ) {
    const paramsString = params.toString();
    const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;
  
    return `${pathname}${queryString}`;
  }
  