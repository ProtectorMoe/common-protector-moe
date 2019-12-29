class NetSender {
    private static ins: NetSender;
    private postman: Postman;

    static cookieStore: Array<string> = [];

    private constructor() {
        this.postman = new Postman()
            .setCookieJar(new class implements CookieJar {
                saveFromResponse: (url: string, cookies: Array<string>) => void = (url, cookies) => {
                    if (url.indexOf("login") > 0) {
                        NetSender.cookieStore = cookies;
                    }
                };
                loadForRequest: (url: string) => Array<string> = (url => {
                    if (url.indexOf("passport") > 0 || url.indexOf('login') > 0) {
                        return [];
                    }
                    return NetSender.cookieStore
                });
            });
    };
    public static getInstance():NetSender {
        if (!NetSender.ins) {NetSender.ins = new NetSender()}
        return NetSender.ins;
    }

    async getGameVersion() {

    }


}
