<template>
    <transition name="dialog">
        <div class="dialog" :style="maskStyle" v-show="isVisible">
            <div class="dialog-container" :style="containerStyle">
                <span class="dialog-title" :style="titleStyle" v-if="title">{{title}}</span>
                <slot></slot>
                <div class="dialog-button">
                    <button @click="confirm">{{confirmTxt}}</button>
                    <button @click="cancel">{{cancelTxt}}</button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    props:{
        title:{
            type:String,
            default:''
        },
        flag:{
            type:Boolean,
            default:false
        },
        visible:{
            type:Boolean,
            default:false
        },
        mask:{
            type:Boolean,
            default:false
        },
        width:{
            type:String,
            default:'500px'
        },
        height:{
            type:String,
            default:'330px'
        },
        cancelTxt:{
            type:String,
            default:'取消'
        },
        confirmTxt:{
            type:String,
            default:'提交'
        },
    },
    data(){
        return {
            isVisible:false,
            isFlag:false
        }
    },
    methods:{
        cancel(){
            this.$emit('cancel')
        },
        confirm(){
            this.$emit('confirm')
        }
    },
    watch:{
        visible(val){
            this.isVisible = val
        },
        flag(val){
            this.isFlag = val
        }
    },
    computed:{
        containerStyle(){
            let list = {}
            if(this.width) list['width'] = this.width
            if(this.height) list['height'] = this.height
            if(this.isFlag) list['backgroundColor'] = '#2C2E2F'
            else list['backgroundColor'] = '#F1F5F8'
            return list
        },
        maskStyle(){
            let list = {}
            if(this.mask){
                list['backgroundColor'] = 'rgba(0,0,0,.5)'
                list['backdropFilter'] = 'blur(5px)'
            }
            return list
        },
        titleStyle(){
            let list = {}
            if(this.isFlag) list['color'] = '#C6C9CF'
            else list['color'] = '#282A2D'
            return list
        }
    }
}
</script>

<style lang="less" scoped>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.dialog{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    display: grid;
    height: 100vh;
    width: 100vw;
    place-content: center;
    .dialog-container{
        display: flex;
        flex-direction: column;
        align-items: center;
        box-sizing: border-box;
        padding: 20px 0;
        border-radius: 4px;
        .dialog-title{font-size: 16px;}
        .dialog-button{
            display: flex;
            justify-content: space-between;
            width: 120px;
            button{
                padding: 8px 12px;
                border: none;
                outline: none;
                border-radius: 2px;
                cursor: pointer;
                color: #fff;
                &:first-child{
                    background-color: #2468F2;
                    transition: color .15s;
                    &:hover{background-color: #14171B;}
                }
                &:last-child{
                    background-color: #14171B;
                    transition: color .15s;
                    &:hover{background-color: #2468F2;}
                }
            }
        }
    }
}

.dialog-enter-active,
.dialog-leave-active
{transition: all .25s;}
.dialog-enter,
.dialog-leave-to
{opacity: 0;}
</style>