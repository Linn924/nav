<template>
    <footer :style="colorStyle">
        <p>© 2021 LinnCooper</p>
    </footer>
</template>

<script>
export default {
    name:'Footer',
    props:{
        flag:{
            type:Boolean,
            default:false
        }
    },
    data(){
        return {
            isFlag:false
        }
    },
    watch:{
        flag(val){
            this.isFlag = val
        }
    },
    computed:{
        colorStyle(){
            let list = {}
            if(this.isFlag) list['color'] = '#C6C9CF'
            else list['color'] = '#282A2D'
            return list
        }
    }
}
</script>

<style lang="less" scoped>
footer{
    width: 95%;
    margin: 0 auto;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center; 
    p{margin-bottom: 5px;}  
}
</style>