const request = require('request');
const zlibModel = require('zlib');

interface PostmanOptions {
    url: string,
    method?: string,
    params?: {},
    body?: {},
    form?: {},
    headers?: {},
    cookies?: {},
    zlib?: boolean
}

interface PostmanReturn {
    buffer: Buffer,
    headers: Object
}

class Postman {
    cookieStore: Object;
    cookieJar: Function;

    constructor(cookieJar?) {
        this.cookieStore = {};
        this.cookieJar = cookieJar || function (url, setCookie) {
            return setCookie;
        };
    }

    getParamString(data) {
        let keys = Object.keys(data || {});
        if (keys.length === 0) return "";
        keys = keys.map(key => `${key}=${data[key]}`);
        return `?${keys.join("&")}`
    }

    public connect(options: PostmanOptions){
        const {
            url = "",
            method = "GET",
            body,
            form,
            params = {},
            headers = {
                "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 5.1.1; oppo a53 Build/LYZ28N)",
                "Accept-Encoding": "identity"
            },
            cookies = {},
            zlib = false,
        } = options;
        const defaultOption = {
            method,
            headers: {
                ...headers,
            },
            body: body !== undefined? JSON.stringify(body): undefined,
            form,
            Cookie: Object.keys(cookies || this.cookieStore).map(key => `${key}=${cookies[key]}`).join(";")
        };
        return new Promise<PostmanReturn>((resolve, reject) => {
            const getHeaders = (headers) => {
                if (headers["set-cookie"]) {
                    const cookieList = headers["set-cookie"];
                    let cookies = {};
                    cookieList.forEach(key => {
                        key.split(";").forEach(c => {
                            const [k, v] = c.split("=", 2);
                            cookies[k.trim()] = v.trim()
                        })
                    });
                    return cookies;
                } else {
                    return {};
                }
            };
            const u = url + this.getParamString(params);
            const req = request(u, defaultOption);
            this.cookieStore = this.cookieJar(u, getHeaders(req.headers));
            req.on('data', chunk => {
                if (zlib) {
                    zlibModel.unzip(chunk, (error, result) => {
                        if (error) {reject()}
                        resolve({
                            buffer: result,
                            headers: req.headers,
                        })
                    })
                }
                resolve({
                    buffer: chunk,
                    headers: req.headers,
                })
            });
            req.on('error', error => {
                reject(error)
            })
        });
    }

    public getCookieStore(): Object {
        return this.cookieStore;
    }

    public setCookieJar(cookieJar: Function): void {
        this.cookieJar = cookieJar
    }
}

module.exports = Postman;
