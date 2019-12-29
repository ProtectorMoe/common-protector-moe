const request = require('request');
const zlibModel = require('zlib');

interface PostmanOptions {
    url: string,
    method?: string,
    params?: {},
    body?: {},
    form?: {},
    headers?: {},
    cookies?: Array<string>,
    zlib?: boolean
}

interface PostmanReturn {
    buffer: Buffer,
    headers: Object,
    statusCode: string
}

interface CookieJar {
    saveFromResponse: (url: string, cookies: Array<string>) => void,
    loadForRequest: (url: string) => Array<string>,
}


class Postman {
    constructor() {return this;}

    private static cookieStore: Array<string> = [];
    jar: CookieJar = new class implements CookieJar {
        loadForRequest(url: string): Array<string> {
            return Postman.cookieStore;
        }
        saveFromResponse(url: string, cookies: Array<string>): void {
            Postman.cookieStore = cookies;
        };
    };

    getParamString(data) {
        let keys = Object.keys(data || {});
        if (keys.length === 0) return "";
        keys = keys.map(key => `${key}=${data[key]}`);
        return `?${keys.join("&")}`
    }

    public connect(options: PostmanOptions){
        const {
            url = "", method = "GET", body, form, params = {},
            headers = {
                "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 5.1.1; oppo a53 Build/LYZ28N)",
                "Accept-Encoding": "identity"
            },
            cookies = [], zlib = false,
        } = options;
        const defaultOption = {
            method,
            headers: {
                ...headers,
            },
            body: body !== undefined? JSON.stringify(body): undefined,
            form,
            Cookie: (cookies || this.jar.loadForRequest(url) || []).join(";")
        };
        return new Promise<PostmanReturn>((resolve, reject) => {
            const u = url + this.getParamString(params);
            const r: PostmanReturn = {
                buffer: Buffer.from([]),
                statusCode: "0",
                headers: {}
            };

            const req = request(u, defaultOption);
            req.on('data', chunk => {
                r.buffer = Buffer.concat([r.buffer, chunk]);
            });

            req.on('response', message => {
                r.headers = message.headers;
                r.statusCode = message.statusCode;
                if (r.headers["set-cookie"]) {
                    const c: Array<string> = r.headers["set-cookie"];
                    const cc: Array<string> = [];
                    c.forEach(value => {
                        value.split(";").forEach(value1 => {
                            cc.push(value1.trim())
                        })
                    });
                    this.jar.saveFromResponse(url, cc);
                }
            });

            req.on('end', () => {
                if(zlib) {
                    zlibModel.unzip(r.buffer, (error, result) => {
                        if (error) reject("unzip fail");
                        r.buffer = result;
                    })
                }
                resolve(r)
            })
        });
    }

    public setCookieJar(jar: CookieJar) {
        this.jar = jar;
        return this;
    }
}


async function test() {
    const postman = new Postman();
    const response = await postman.connect({
        url: "https://www.baidu.com/"
    });
    console.log(response)
}

test();
