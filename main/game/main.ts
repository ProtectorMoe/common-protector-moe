import { TaskBean } from "main/bean/game/task-bean";
import { TaskManager } from "./task-manager";
import { GameFunction } from "./game-function";
import { Delay } from "main/util/util";

const taskManager: TaskManager = TaskManager.getInstance();
const gameFunction: GameFunction = GameFunction.getInstance();

export class Main {
    static ins: Main;
    static run: boolean;
    static getInstance(): Main {
        if (!Main.ins) {
            Main.ins = new Main();
        }
        return Main.ins;
    }

    async mainThread() {
        while (true) {
            const taskBean: TaskBean = taskManager.getAvailableTask();
            if (taskBean) {
                switch (taskBean.type) {
                    case "challenge":
                        break;
                }
            }
            await gameFunction.checkExplore();
            await Delay(2000);
        }
    }
}
