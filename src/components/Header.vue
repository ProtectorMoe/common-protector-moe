<template>
    <div class="header">
        <div class="logo">
            <img style="vertical-align: middle; margin-top: -6px" src="../assets/img/icon.png" width="45" height="45">
            <span>护萌宝</span>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
        };
    },
    computed: {
    },
};
</script>
<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #fff;
}
.header .logo {
    float: left;
    margin-left: 10px;
    width: 250px;
    line-height: 70px;
}

.logo span {
    margin-left: 10px;
}

.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

</style>
