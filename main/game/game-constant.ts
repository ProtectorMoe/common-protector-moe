import { InitDataBean, ShipCardWu } from "../bean/net/init-data-bean";
import { MapToObject } from "../util/util";
const { ipcRenderer } = require("electron");
const path = require("path");
const fs = require("fs");

export class GameConstant {
    static ins: GameConstant;
    static getInstance(): GameConstant {
        if (!GameConstant.ins) {
            GameConstant.ins = new GameConstant();
        }
        return GameConstant.ins;
    }

    shipCardWu: Map<number, ShipCardWu> = new Map<number, ShipCardWu>();
    shipCard: Map<number, ShipCardWu> = new Map<number, ShipCardWu>();

    init(newJson?: string): boolean {
        if (
            !fs.existsSync(
                path.join(process.cwd(), "database", "database.json")
            ) &&
            !newJson
        ) {
            return false;
        }
        let nowJson: InitDataBean;
        if (newJson) {
            nowJson = JSON.parse(newJson);
            let file = path.join(process.cwd(), "database");
            if (!fs.existsSync(file)) {
                fs.mkdirSync(file);
                file = path.join(file, "database.json");
            }
            fs.writeFile(file, newJson);
        } else {
            nowJson = JSON.parse(
                fs.readFileSync(
                    path.join(process.cwd(), "database", "database.json")
                )
            );
        }
        nowJson.shipCardWu.forEach(value => {
            this.shipCardWu.set(value.cid, value);
        });
        nowJson.shipCard.forEach(value => {
            this.shipCard.set(value.cid, value);
        });
        ipcRenderer.send("setShipCardWu", MapToObject(this.shipCardWu));
        return true;
    }
}
