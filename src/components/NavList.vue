<template>
    <div id="link" :style="{'backgroundColor':flag?'#1B1D1F':'#F1F5F8'}">
        <Search></Search>

        <section>
            <div class="item" v-for="(father,fId) in navList" :key="fId">
                <label>
                    <i :class="father.className" :style="{'color':flag?'#888':'#555',
                        'fontSize':fId == 5 || fId == 6 ?'18px':''}"></i>
                    <span :style="{'color':flag?'#888':'#555'}">{{father.name}}</span>
                </label>

                <div>
                    <nav :class="flag?'bgColorMoon':'bgColorSunny'">
                        <li class="back"></li>
                        <li v-for="(son,sId) in father.one" :key="sId" 
                            :class="sId == 0 ?'currentLi':''" @click="clickNavs(fId,sId)" 
                            @mouseenter="enterNavs(fId,sId)" @mouseleave="leaveNavs(fId)">
                            {{son.name}}
                        </li>
                    </nav>
                </div>

                <nav v-for="(son,sId) in father.two" :key="sId" v-show="sId  === clickIndex[fId].cIndex">
                    <li v-for="(grandson,grandsId) in son.children" :key="grandsId" 
                        :class="fId != 0 && sId == 0 ? className + ' indexLi' : className" 
                        @mouseenter="up(fId,sId,grandsId)" @mouseleave="down(fId,sId,grandsId)">

                        <a :href="grandson.url" target="_blank">
                            <img class="img" :src="loging" :data-src="grandson.logo">
                            <div>
                                <strong :class="flag?'colorMoon':'colorSunny'">{{grandson.name}}</strong>
                                <span>{{grandson.title}}</span>
                            </div>
                        </a>

                        <div class="icon" v-show="token">
                            <i class="fa fa-chevron-circle-left" v-show="clickLiIndex !== grandson.id" 
                                @click="clickLiIndex = grandson.id"></i>
                            <i class="fa fa-chevron-circle-right" v-show="clickLiIndex === grandson.id" 
                                @click="clickLiIndex = 0"></i>
                        </div>

                        <div class="editNavs" v-show="clickLiIndex === grandson.id">
                            <i class="el-icon-setting" :class="flag?'colorMoon':'colorSunny'" 
                                @click="clickEditBtn(grandson)"></i>
                            <i class="el-icon-delete" :class="flag?'colorMoon':'colorSunny'" 
                                @click="clickDeleteBtn(grandson.id)"></i>
                        </div>

                    </li>
                    
                    <li :class="fId != 0 && sId == 0 ? className + ' indexLastLi' : className" 
                        title="自定义网站" v-show="token" @click="clickAddBtn(father.id,son.id)">
                        <i class="el-icon-plus" :class="flag?'colorMoon':'colorSunny'"></i>
                    </li>
                </nav>
            </div>
        </section>

        <Footer :flag="flag"></Footer>

        <Dialog title="添加自定义网站" cancelTxt="取消" confirmTxt="添加" 
            :mask="true" :flag="flag" :visible="postDialogVisible" 
            @cancel="postDialogVisible = false" @confirm="postNavs">
            <div class="dialog-forms">
                <input :class="flag?'bgColorMoon':'bgColorSunny'" type="text" 
                    placeholder="网站Logo" v-model="postNavsForm.logo">
                <input :class="flag?'bgColorMoon':'bgColorSunny'" type="text" 
                    placeholder="网站名称" v-model="postNavsForm.name">
                <input :class="flag?'bgColorMoon':'bgColorSunny'" type="text" 
                    placeholder="网站网址" v-model="postNavsForm.url">
                <textarea :class="flag?'bgColorMoon':'bgColorSunny'" placeholder="描述点什么吧！" 
                    v-model="postNavsForm.title"></textarea>
            </div>
        </Dialog>

        <Dialog title="修改自定义网站" cancelTxt="取消" confirmTxt="修改" 
            :mask="true" :flag="flag" :visible="putDialogVisible" 
            @cancel="cancelPutNavs" @confirm="putNavs">
            <div class="dialog-forms">
                <input :class="flag?'bgColorMoon':'bgColorSunny'" type="text" 
                    placeholder="网站Logo" v-model="putNavsForm.logo">
                <input :class="flag?'bgColorMoon':'bgColorSunny'" type="text" 
                    placeholder="网站名称" v-model="putNavsForm.name">
                <input :class="flag?'bgColorMoon':'bgColorSunny'" type="text" 
                    v-model="putNavsForm.url">
                <textarea :class="flag?'bgColorMoon':'bgColorSunny'" placeholder="描述点什么吧！" 
                    v-model="putNavsForm.title"></textarea>
            </div>
        </Dialog>

        <Dialog cancelTxt="取消" confirmTxt="删除" width="200px" height="70px"
            :mask="true" :flag="flag" :visible="deleteDialogVisible" 
            @cancel="cancelDeleteNavs" @confirm="deleteNavs">
        </Dialog>

    </div>
</template>

<script>
import Dialog from './basic/Dialog'
import Search from './function/Search'
import Footer from './basic/Footer'
export default {
    inject:['reload'],
    props:['flag','token'],
    components:{
        Dialog,
        Search,
        Footer
    },
    data(){
        return {
            isClick:false,//是否点击蓝色背景导航
            blueBgIndex:[],//记录蓝色背景的位置，默认都为1
            blueBgPosition:[],//记录蓝色背景距离左边的距离，默认都为3
            clickIndex:[],//记录点击的导航的下标以及设置蓝色背景的宽度与下标为0的导航宽度相同，默认分别都为0,1
            navList:[],//所有导航数据
            postNavsForm:{//自定义导航添加表单
                parentsId:Number,
                brothersId:Number,
                logo:'',
                name:'',
                title:'',
                url:''
            },
            putNavsForm:{//自定义导航修改表单
                id:Number,
                logo:'',
                name:'',
                title:'',
                url:''
            },
            postDialogVisible:false,//添加自定义网站对话框 显示or隐藏
            putDialogVisible:false,//修改自定义网站对话框 显示or隐藏
            deleteDialogVisible:false,//删除自定义网站对话框 显示or隐藏
            clickLiIndex:0,//右键点击的导航网站
            deleteLiIndex:0,//即将删除的导航网站下标
            loging:require('../assets/loging.gif'),//默认图标
            timer:null,//滚动事件定时器
            initFlag:false,//页面加载时调用滚动和图片加载事件 执行了or未执行
        }
    },
    computed:{
        className(){
            let className = ''
            if(this.flag){
                className = 'liMoon'

            }else{
                className = 'liSunny'
            }
            return className
        }
    },
    created() {
        this.getNavs()
    },
    updated(){
        if(!this.initFlag){
            this.isLoad()
            this.isScroll()
        }
    },
    methods: {
        //获取导航数据
        async getNavs(){
            const {data:res} = await this.$axios.get('navs')
            if(res.code != 200) 
            return this.$message({message:'获取数据失败',type:'error'})
            this.navList = res.data
            this.dealNavs(this.navList.length)
        },
        //根据获取的导航数据初始化数组
        dealNavs(number){
            this.blueBgIndex = Array.from({length:number},() => 1)
            this.blueBgPosition = Array.from({length:number},() => 3)
            this.clickIndex = Array.from({length:number},() => ({cIndex:0,bIndex:1}))
        },
        //鼠标移入导航
        enterNavs(fId,sId){
            var lis = document.querySelectorAll('.item>div nav')[fId].children
            this.isClick = false
            lis[0].style.left = lis[sId + 1].offsetLeft + 'px'
            lis[0].style.width = lis[sId + 1].offsetWidth - 20 + 'px'
            this.removeClass(lis,sId + 1)
        },
        //鼠标移出导航
        leaveNavs(fId){
            if(!this.isClick){
                var lis = document.querySelectorAll('.item>div nav')[fId].children
                lis[0].style.left = this.blueBgPosition[fId] + 'px'
                lis[0].style.width = lis[this.clickIndex[fId].bIndex].offsetWidth - 20 + 'px'
                this.removeClass(lis,this.blueBgIndex[fId])
            }
        },
        //点击导航
        clickNavs(fId,sId){
            var lis = document.querySelectorAll('.item>div nav')[fId].children
            this.blueBgPosition[fId] = lis[sId + 1].offsetLeft
            lis[0].style.left = lis[sId + 1].offsetLeft + 'px'
            lis[0].style.width = lis[sId + 1].offsetWidth - 20 + 'px'
            this.removeClass(lis,sId + 1)
            this.isClick = true
            this.blueBgIndex[fId] = sId + 1
            this.clickIndex[fId].cIndex = sId
            this.clickIndex[fId].bIndex = sId + 1
        },
        //清除样式
        removeClass(dom,i){
            dom.forEach( item => item.classList.remove('currentLi'))
            dom[i].className = 'currentLi'
        },
        //导航上浮动画
        up(fId,sId,grandsId){
            var li = document.querySelectorAll('.item')[fId].querySelectorAll('nav')[sId + 1].children[grandsId]
            li.classList.remove('down')
            li.classList.add('up')
        },
        //导航下降动画
        down(fId,sId,grandsId){
            var li = document.querySelectorAll('.item')[fId].querySelectorAll('nav')[sId + 1].children[grandsId]
            li.classList.remove('up')
            li.classList.add('down')
            setTimeout(() => {li.classList.remove('down')},160)
        },
        //点击添加自定义网站方块
        clickAddBtn(fId,sId){
            this.postNavsForm.parentsId = fId
            this.postNavsForm.brothersId = sId
            this.postDialogVisible = true
        },
        //添加自定义网站
        async postNavs(){
            const {data:res} = await this.$axios.post('navs',this.postNavsForm)
            if(res.code != 200) return this.$message({message:`${res.tips}`,type:'error'})
            this.$message({message:`${res.tips}`,type:'success'})
            this.postDialogVisible = false
            this.reload()
        },
        clickEditBtn(navs){
            this.putNavsForm.id = navs.id
            this.putNavsForm.logo = navs.logo ? navs.logo : 'https://api.iowen.cn/favicon/'
            this.putNavsForm.name = navs.name
            this.putNavsForm.title = navs.title
            this.putNavsForm.url = navs.url
            this.putDialogVisible = true
        },
        //取消修改自定义网站
        cancelPutNavs(){
            this.putDialogVisible = false
            this.clickLiIndex = 0
        },
        //修改自定义网站
        async putNavs(){
            const {data:res} = await this.$axios.put('navs',this.putNavsForm)
            if(res.code != 200) return this.$message({message:`${res.tips}`,type:'error'})
            this.$message({message:`${res.tips}`,type:'success'})
            this.putDialogVisible = false
            this.reload()
        },
        clickDeleteBtn(id){
            this.deleteLiIndex = id
            this.deleteDialogVisible = true
        },
        //取消删除自定义网站
        cancelDeleteNavs(){
            this.deleteDialogVisible = false
            this.clickLiIndex = 0
        },
        //删除自定义网站
        async deleteNavs(){
            const {data:res} = await this.$axios.delete('navs',{params:{id:this.deleteLiIndex}})
            if(res.code != 200) return this.$message({message:`${res.tips}`,type:'error'})
            this.$message({message:`${res.tips}`,type:'success'})
            this.deleteDialogVisible = false
            this.reload()
        },
        //加载图片
        isLoad(){
            //已加载的图片过滤
            let imgs = Array.from(document.querySelectorAll('.img:not([data-isloaded])'))
            imgs.forEach( item => {
                if(this.isShow(item)){
                    this.isLazy(item)
                }
            })
            this.initFlag = true
        },
        //页面滚动事件
        isScroll(){
            window.addEventListener('scroll',() => {
                if(this.timer) return 
                setTimeout(() => {
                    this.isLoad()
                    this.timer = null
                },200)
            })
        },
        //懒加载图片核心原理
        isLazy(img){
            img.src = img.dataset.src
            img.setAttribute('data-isLoaded', true) //已加载过的图片做标记(下次不获取加载过的元素)
            img.classList.add('fadeIn') //图片出现加载过度动画
        },
        //是否展示(元素距离顶部的高度 <= 窗口高度 + 窗口滚动高度)
        isShow(img){
            let clientHeight = document.documentElement.clientHeight || document.body.clientHeight
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
            return img.offsetTop <= clientHeight + scrollTop
        }
    }
}
</script>

<style lang="less" scoped>
#link{
    width: 100%;
    min-height: 100vh;
    min-width: 375px;
    section{
        width: 95%;
        margin: 25px auto;
    }
}

section{
    .item{
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        >label{
            display: flex;
            align-items: center;
            font-size: 18px;
            font-weight: bold;
            i{
                margin-right: 10px;
                font-size: 22px;
                color: #909399;
            }
        }
        >div{
            margin: 14px 0 22px 0;
            display: flex;
            justify-content: space-between;
            nav{
                list-style: none;
                display: flex;
                height: 30px;
                padding: 0 3px;
                box-sizing: border-box;
                border-radius: 15px;
                cursor: pointer;
                position: relative;
                li{
                    line-height: 30px;
                    font-size: 14px;
                    color: #888;
                    padding: 0 10px;
                    z-index: 2;
                    transition: color .4s;
                }
                .back{
                    position: absolute;
                    width: 28px;
                    top: 50%;
                    left: 3px;
                    height: 24px;
                    transform: translateY(-50%);
                    border-radius: 12px;
                    background-color: #2468F2;
                    z-index: 1;
                    transition: all .2s;
                }
            }
            span{
                &:hover{color: #2468F2;}
                cursor: pointer;
                font-size: 14px;
                color: #909399;
            }
        }
        >nav{
            display: flex;
            flex-flow: row wrap;
            list-style: none;
            li{
                height: 70px;
                box-sizing: border-box;
                border-radius: 3px;
                display: flex;
                padding-right: 5px;
                a{
                    flex: 1;
                    height: inherit;
                    box-sizing: border-box;
                    display: flex;
                    align-items: center;
                    padding-left:5px;
                    img{
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        margin-right: 10px;
                    }
                    div{
                        flex: 1;
                        height: inherit;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        font-size: 12px;
                        box-sizing: border-box;
                        width: 0;
                        strong{
                            margin-bottom: 5px;
                            color:#000;
                            transition: color .25s;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        span{
                            color: #6C757D;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                    }
                }
                .icon{
                    height: inherit;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    transition: color .25s;
                }
                .editNavs{
                    width: 40px;
                    height: inherit;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    justify-content: space-around;
                    i{
                        transition: color .25s;
                        font-size: 22px;
                        cursor: pointer;
                        &:hover{color: #2468F2!important;}
                    }
                }
                &:hover{strong{color: #2468F2!important;}}
            }
            li:last-child{
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 24px;
                cursor: pointer;
            }
        }
    }
}

.dialog-forms{
    width: inherit;
    margin: 30px 0 20px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    input{
        width: 465px;
        height: 35px;
        border: none;
        outline: none;
        border-radius: 4px;
        padding-left: 5px;
        font-size: 15px;
        color: #AAA;
        &:nth-child(2){margin: 10px 0;}
    }
    textarea{
        width: 465px;
        height: 50px;
        resize: none;
        border: none;
        outline: none;
        border-radius: 4px;
        padding-left: 5px;
        font-size: 15px;
        color: #AAA;
        font-family: Helvetica;
        &:nth-child(4){margin-top: 10px;}
        &::-webkit-scrollbar {width: 3px;border-radius: 2px;}
        &::-webkit-scrollbar-thumb {background-color: rgb(177, 175, 175);border-radius: 4px;}
        &::-webkit-scrollbar-track{background-color: #bdbdbd;}
    }
}

.currentLi{color: #FFF!important;}
.indexLi{
    a{padding-left: 8px!important;}
    a img{
        border-radius: 0!important;
        height: inherit!important;
        width: 115px!important;
        margin-right: 20px!important;
        border-radius: 2px!important;
    }
    a strong{
        font-size: 16px;
        margin-bottom: 10px!important;
    }
}
.indexLastLi{
    width: 412px!important;
    height: 85px!important;
}
.up{animation: up .15s linear forwards;} 
.down{animation: down .15s linear forwards;} 
.colorSunny{color: #282A2D!important;}
.colorMoon{color:#C6C9CF!important;}
.bgColorSunny{background-color: #FFF!important;}
.bgColorMoon{background-color: #363738!important;}
.liSunny{
    background-color: #fff!important;
    .icon>i{color: #E7E9EA!important;}
    &:hover{.icon>i{color: #2c2e2f!important;}}
}
.liMoon{
    background-color: #2c2e2f!important;
    .icon>i{color: #343739!important;}
    &:hover{.icon>i{color: #fff!important;}}
}
.fadeIn{
    animation: fadeIn 1s ease forwards;
}
@keyframes fadeIn {
    0%{opacity: 0}
    100%{opacity: 1}
}
@keyframes up {
  from{
      transform: translateY(0);
  }
  to{
      transform: translateY(-10px);
  }                  
}
@keyframes down {
  from{
      transform: translateY(-10px);
  }
  to{
      transform: translateY(0);
  }                  
}

@media screen and (min-width: 1921px) {
    section .item>nav li{
        margin: 0 30px 30px 0;
        width: 270px;
    }
    section .item>nav li.indexLi{
        margin: 0 30px 30px 0;
        height: 85px;
        width: 410px;
    }
}
@media screen and (min-width: 1681px) and (max-width: 1920px) {
    section .item>nav li{
        margin: 0 2% 30px 0;
        width: 15%;
        &:nth-child(6n){margin-right: 0;}
    }
    section .item>nav li.indexLi{
        margin: 0 2% 30px 0;
        width: 23.5%;
        height: 85px;
        &:nth-child(4n){margin-right: 0;}
    }
}
@media screen and (min-width: 1201px) and (max-width: 1680px) {
    section .item>nav li{
        margin: 0 1% 30px 0;
        width: 19.2%;
        &:nth-child(5n){margin-right: 0;}
    }
    section .item>nav li.indexLi{
        margin: 0 2% 30px 0;
        width: 32%;
        height: 6vw;
        &:nth-child(3n){margin-right: 0;}
    }
}
@media screen and (min-width: 961px) and (max-width: 1200px) {
    section .item>nav li{
        margin: 0 2% 30px 0;
        width: 23.5%;
        &:nth-child(4n){margin-right: 0;}
    }
    section .item>nav li.indexLi{
        margin: 0 2% 30px 0;
        width: 32%;
        height: 8vw;
        &:nth-child(3n){margin-right: 0;}
    }
}
@media screen and (min-width: 761px) and (max-width: 960px) {
    section .item>nav li{
        margin: 0 2% 30px 0;
        width: 32%;
        &:nth-child(3n){margin-right: 0;}
    }
    section .item>nav li.indexLi{
        margin: 0 2% 30px 0;
        width: 49%;
        height: 9vw;
        &:nth-child(2n){margin-right: 0;}
    }
}
@media screen and (max-width: 960px) {
    section .item>nav li .icon{
        display: none;
    }
    section .item>nav li:last-child{
        display: none;
    }
}
@media screen and (max-width: 760px) {
    section .item>nav li{
        margin: 0 2% 30px 0;
        width: 49%;
        &:nth-child(2n){margin-right: 0;}
    }
    section .item>nav li.indexLi{
        margin: 0 2% 30px 0;
        width: 49%;
        height: 10vw;
        &:nth-child(2n){margin-right: 0;}
    }
}
@media screen and (max-width: 540px) {
    section .item>nav li.indexLi{
        margin-bottom:30px;
        width: 99%;
        height: 85px;
        margin-right: 0;
    }
}

</style>