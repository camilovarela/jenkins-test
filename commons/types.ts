export class Scope {

    name: string;
    url: string;

    constructor(name: string, url: string) {
        this.name = name;
        this.url = url;
    }
}

export class App {

    appName: string;
    appFury: string;

    constructor(appName: string, appFury: string) {
        this.appName = appName;
        this.appFury = appFury;
    }
}