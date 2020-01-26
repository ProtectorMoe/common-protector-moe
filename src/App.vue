<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'app',
        mounted() {
            if (window.global) {
                this.$store.commit('init');
                const ipcRenderer = window.electron.ipcRenderer;
                [
                    'updateUserResVo',
                    'updateUserVo',
                    'updateFleetVo',
                    'updateUserShipVo',
                    'updatePveExploreVo',
                    'updateRepairDockVo',
                    'updatePackages'
                ].forEach(value => {
                    ipcRenderer.removeAllListeners(value);
                    (_ => {
                        ipcRenderer.on(value, (_, args) => {
                            this.$store.commit(value, args)
                        })
                    })()
                })

            }
        },
        data() {
            return {

            }
        }
    }
</script>

<style>
    @import "./assets/css/main.css";
    @import "./assets/css/color-dark.css";
</style>
