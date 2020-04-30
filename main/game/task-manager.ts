import { TaskBean } from "main/bean/game/task-bean";
const Store = require("electron-store");
const store = new Store();

const TAG = "TaskManager";

export class TaskManager {
    
    static ins: TaskManager;
    static getInstance(): TaskManager {
        if (!TaskManager.ins) {
            TaskManager.ins = new TaskManager();
        }
        return TaskManager.ins;
    }

    constructor() {
        this.taskList = store.get("taskList", []);
    }

    taskList: Array<TaskBean> = [];

    addTask(taskBean: TaskBean): void {
        this.taskList.push(taskBean);
        store.set("taskList", this.taskList);
    }

    getAvailableTask(): TaskBean | undefined {
        try {
            // 解冻任务
            this.taskList.forEach(value => {
                if (value.locked != -1 && new Date().getTime() > value.locked) {
                    value.locked = -1;
                }
            });
            // 做完的任务
            this.taskList.forEach(v => {
                if (v.num >= v.numMax) {
                    v.finish();
                }
            });
            // 剔除任务
            this.taskList = this.taskList.filter(value => !value.isFinish);
            return this.taskList.filter(v => v.locked == -1 && v.switch)[0];
        } catch (e) {
            console.error(TAG, e);
            return null;
        }
    }
}
