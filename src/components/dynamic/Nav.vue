<template>
    <div id="nav" :style="{'backgroundColor':flag?'#1B1D1F':'#F1F5F8'}">
        <!-- 当前ID：{{id}} <br>
        当前模式：{{flag}} <br>
        登录状态：{{token}} -->
        暂无,请点击其他导航。
    </div>
</template>

<script>
export default {
    name:'Nav',
    props:{
        flag:{
            type:Boolean,
            required:true
        },
        token:{
            type:Boolean,
            required:true
        }
    },
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
#nav{
    padding-top: 8vh;
    min-height: 100vh;
    box-sizing: border-box;
}
</style>