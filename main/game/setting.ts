import {SettingBean} from "../bean/game/setting-bean";
const Store = require('electron-store');

export class Setting {
    static ins: Setting;
    static getInstance() {
        if (!this.ins)
            this.ins = new Setting();
        return this.ins;
    }
    store = new Store();
    settingBean: SettingBean = new class implements SettingBean {
        dismantleEquipment: boolean;
        dismantleShip: string;
        dismantleStar: Array<string>;
        dismantleSwitch: boolean;
        dismantleType: Array<string>;
        roundaboutMax: number
    };

    init() {
        this.settingBean.dismantleEquipment = this.store.get('setting.dismantleEquipment', false);
        this.settingBean.dismantleShip = this.store.get('setting.dismantleShip', "");
        this.settingBean.dismantleStar = this.store.get('setting.dismantleStar', []);
        this.settingBean.dismantleSwitch = this.store.get('setting.dismantleSwitch', false);
        this.settingBean.dismantleType = this.store.get('setting.dismantleType', []);
        this.settingBean.roundaboutMax = this.store.get('setting.roundaboutMax', 2);
    }

    save() {
        this.store.set({'setting': this.settingBean})
    }
}
