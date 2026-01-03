import { RequestResultType } from "../types/request-result.type";
declare function request<T>(url: string, method?: string, auth?: boolean, data?: any): Promise<RequestResultType<T> | null>;
export default request;
//# sourceMappingURL=http-utility.d.ts.map