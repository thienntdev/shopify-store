export interface ShopifyErrorLike {
    status: number;
    message: string;
    cause?: string;
}

export function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function findError<T extends object>(error: T) : boolean {
    if (Object.prototype.toString.call(error) !== "[object Object]") return true;
    const prototype = Object.getPrototypeOf(error) as T || null;
    return prototype == null ? false : findError(prototype);
}


export function isShopifyError(error: unknown): error is ShopifyErrorLike{
    if (!isObject(error)) return false;

    if (error instanceof Error) return true;
    return findError(error);
}
