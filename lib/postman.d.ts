/// <reference types="node" />
declare const request: any;
declare const zlibModel: any;
interface PostmanOptions {
    url: string;
    method?: string;
    params?: {};
    body?: {};
    form?: {};
    headers?: {};
    cookies?: {};
    zlib?: boolean;
}
interface PostmanReturn {
    buffer: Buffer;
    headers: Object;
}
declare class Postman {
    cookieStore: Object;
    cookieJar: Function;
    constructor(cookieJar?: any);
    getParamString(data: any): string;
    connect(options: PostmanOptions): Promise<PostmanReturn>;
    getCookieStore(): Object;
    setCookieJar(cookieJar: Function): void;
}
