<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
import { fetchAsync, MapToObject } from "../main/util/util";
export default {
    name: "app",
    mounted() {
        document.body.ondrop = function(event) {
            event.preventDefault();
            event.stopPropagation();
        };
        if (window.global) {
            this.$store.commit("init");
            const ipcRenderer = window.electron.ipcRenderer;
            [
                "updateUserResVo",
                "updateUserVo",
                "updateFleetVo",
                "updateUserShipVo",
                "updatePveExploreVo",
                "updateRepairDockVo",
                "updatePackages",
                "setLog"
            ].forEach(value => {
                ipcRenderer.removeAllListeners(value);
                ipcRenderer.on(value, (_, args) => {
                    this.$store.commit(value, args);
                });
            });
        }
        if (this.$store.state.fleetVo.size == 0) {
            (async () => {
                const userData = await fetchAsync(
                    "http://127.0.0.1:5000/api/initGame"
                );
                const fleetVo = new Map();
                const userShipVo = new Map();
                userData.fleetVo.forEach(value => fleetVo.set(value.id, value));
                userData.userShipVO.forEach(value =>
                    userShipVo.set(value.id, value)
                );
                this.$store.commit("updateFleetVo", MapToObject(fleetVo));
                this.$store.commit("updateUserShipVo", MapToObject(userShipVo));

                const shipCard = await fetchAsync(
                    "http://127.0.0.1:5000/data/shipCardWu"
                );
                const shipCardWu = new Map();
                shipCard.forEach(value => shipCardWu.set(value.cid, value));
                this.$store.commit("setShipCardWu", MapToObject(shipCardWu));

                this.$forceUpdate();
            })();
        }
        if (Object.keys(this.$store.state.pve.pveLevel).length == 0) {
            try {
                fetch("http://127.0.0.1:5000/pve/getPveData/")
                    .then(_ => _.json())
                    .then(pve => {
                        const pveNode = new Map();
                        const pveLevel = new Map();
                        const pveBuff = new Map();
                        pve.pveNode.forEach(value =>
                            pveNode.set(value.id, value)
                        );
                        pve.pveLevel.forEach(value =>
                            pveLevel.set(value.id, value)
                        );
                        pve.pveBuff.forEach(value =>
                            pveBuff.set(value.id, value)
                        );
                        this.$store.commit("updatePveData", {
                            pveNode: MapToObject(pveNode),
                            pveLevel: MapToObject(pveLevel),
                            pveBuff: MapToObject(pveBuff)
                        });
                    });
            } catch (e) {
                console.error(e);
            }
        }
    },
    data() {
        return {};
    }
};
</script>

<style>
@import "./assets/css/main.css";
@import "./assets/css/color-dark.css";
</style>
