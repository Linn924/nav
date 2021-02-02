<template>
    <div id="detail" :style="{'backgroundColor':flag?'#1B1D1F':'#F1F5F8'}">
        <!-- 当前ID：{{id}} <br>
        当前模式：{{flag}} <br>
        登录状态：{{token}} -->
        暂无
    </div>
</template>

<script>
export default {
    props:['token','flag'],
    data(){
        return {
            id:Number
        }
    },
    created(){
        this.getNavDetail()
    },
    methods:{
        async getNavDetail(){
            let sId = location.href.split('?sId=')[1]
            this.id = sId
        }
    }
}
</script>

<style lang="less" scoped>
#detail{
    padding-top: 8vh;
    min-height: 100vh;
    box-sizing: border-box;
}
</style>