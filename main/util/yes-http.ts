const request = require('request');
const zlibModel = require('zlib');

export interface YesHttpOptions {
    url: string,
    method?: string,
    params?: {},
    body?: {},
    form?: {},
    headers?: {},
    cookies?: Array<string>,
    zlib?: boolean
}

export interface YesHttpReturn {
    buffer: Buffer,
    headers: Object,
    statusCode: string
}

export interface CookieJar {
    saveFromResponse: (url: string, cookies: Array<string>) => void,
    loadForRequest: (url: string) => Array<string>,
}

export interface Interceptor {
    onRequest: (url: string, options) => any;
}


export class YesHttp {
    private static cookieStore: Array<string> = [];
    jar: CookieJar = new class implements CookieJar {
        loadForRequest(url: string): Array<string> {
            return YesHttp.cookieStore;
        }
        saveFromResponse(url: string, cookies: Array<string>): void {
            YesHttp.cookieStore = cookies;
        };
    };
    interceptor: Interceptor = new class implements Interceptor {
        onRequest: (url, options) => any = (utl, options) => options;
    };

    getParamString(data) {
        let keys = Object.keys(data || {});
        if (keys.length === 0) return "";
        keys = keys.map(key => `${key}=${data[key]}`);
        return `?${keys.join("&")}`
    }

    public connect(options: YesHttpOptions){
        const {
            url = "", method = "GET", body, form, params = {}, zlib = false,
            headers = {
                "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 5.1.1; oppo a53 Build/LYZ28N)",
                "Accept-Encoding": "identity"
            },
        } = options;
        const defaultOption = {
            method,form,
            headers: {...headers, cookie: this.jar.loadForRequest(url)},
            body: body !== undefined? JSON.stringify(body): undefined,
        };
        return new Promise<YesHttpReturn>((resolve, reject) => {
            const u = url + this.getParamString(params);
            this.interceptor.onRequest(u, defaultOption);
            const response: YesHttpReturn = {
                buffer: Buffer.from([]),
                statusCode: "0",
                headers: {}
            };
            const req = request(u, defaultOption);
            req.on('data', chunk => {
                response.buffer = Buffer.concat([response.buffer, chunk]);
            });
            req.on('response', message => {
                response.headers = message.headers;
                response.statusCode = message.statusCode;
                if (response.headers["set-cookie"]) {
                    const headersArray: Array<string> = response.headers["set-cookie"];
                    this.jar.saveFromResponse(url, headersArray);
                }
            });
            req.on('end', () => {
                if(zlib) {
                    zlibModel.unzip(response.buffer, (error, result) => {
                        if (error) throw new Error(`Unzip fail path:${url}`);
                        response.buffer = result;
                        resolve(response)
                    })
                } else {
                    resolve(response)
                }
            })
        });
    }

    public setCookieJar(jar: CookieJar) {
        this.jar = jar;
        return this;
    }

    public setInterceptor(interceptor: Interceptor) {
        this.interceptor = interceptor;
        return this;
    }
}


async function test() {
    const yesHttp = new YesHttp();
    const response = await yesHttp.connect({
        url: "https://www.baidu.com/"
    });
}
