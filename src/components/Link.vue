<template>
    <div id="link" :style="{'backgroundColor':flag?'#1B1D1F':'#f9f9f9'}">

        <header>
            <nav id="navTop">
                <li v-for="item in navTop" :key="item.id" 
                    :class="item.id == 0 ? 'currentLi':''" @click="switchUl(item.id)">
                    {{item.title}}
                </li>
            </nav>

            <div class="line"></div>

            <div class="search">
                <input type="text" :placeholder="value" ref="search" 
                    v-model="searchValue" @keyup.enter.native="search">
                <button @click="search"><i class="el-icon-search"></i></button>
            </div>

            <nav id="navBottom" v-for="(item,index) in navBottom" :key="index" 
                v-show="index == searchIndex">
                <li v-for="i in item.children" :key="i.id" 
                    :class="i.id == 0 ? 'currentLi':''" @click="switchLi(i.id,i.path)">
                    {{i.title}}
                </li>
            </nav>
        </header>

        <main>
            <section>
                <div class="item" v-for="(father,fId) in navList" :key="fId">
                    <label><i :class="father.className"></i><span>{{father.name}}</span></label>

                    <div><nav>
                            <li class="back"></li>
                            <li v-for="(son,sId) in father.one" :key="sId" 
                                :class="sId == 0 ?'currentLi':''" @click="clickNavs(fId,sId)" 
                                @mouseenter="enterNavs(fId,sId)" @mouseleave="leaveNavs(fId)">
                                {{son.name}}
                            </li>
                        </nav><span>more+</span>
                    </div>

                    <nav v-for="(son,sId) in father.two" :key="sId" v-show="sId === clickIndex[fId].index">
                        <li v-for="(grandson,grandsId) in son.children" :key="grandsId" 
                            :class="flag?'liBlack':'liWhite'" @mouseenter="up(fId,sId,grandsId)" 
                            @mouseleave="down(fId,sId,grandsId)">
                            <a :href="grandson.url" target="_blank">
                                <img src="../assets/logo.jpg" alt="" v-show="true">
                                <div><strong>{{grandson.name}}</strong><span>{{grandson.title}}</span></div>
                            </a>
                        </li>
                    </nav>
                </div>
            </section>
            <footer><section>
                    <p>© 2020 - 2021 Simon 版权所有</p><p>苏ICP备20023864号</p>
                </section>
            </footer>
        </main>
    </div>
</template>

<script>
export default {
    props:['flag'],
    data(){
        return {
            navTop:[
                {id:0,title:'搜索'},
                {id:1,title:'网盘'},
                {id:2,title:'软件'},
                {id:3,title:'书籍'},
                {id:4,title:'菜谱'}
            ],
            navBottom:[
                {
                    children:[
                        {id:0,title:'百度',path:'https://www.baidu.com/s?wd='},
                        {id:1,title:'Google',path:'http://www.google.com/search?q='},
                        {id:2,title:'秘迹',path:'https://www.mijisou.com/?q='},
                        {id:3,title:'多吉',path:'https://www.dogedoge.com/results?q='},
                        {id:4,title:'Magi',path:'https://magi.com/search?q='},
                        {id:5,title:'Bing',path:'https://cn.bing.com/search?q='}
                    ]    
                },
                {
                    children:[
                        {id:0,title:'云盘精灵',path:'https://www.yunpanjingling.com/search/'},
                        {id:1,title:'大力盘',path:'https://www.dalipan.com/search?keyword='},
                        {id:2,title:'如风搜',path:'http://www.rufengso.net/s/name/'},
                        {id:3,title:'小可搜搜',path:'https://www.xiaokesoso.com/s/search?q='},
                        {id:4,title:'小昭来了',path:'https://www.xiaozhaolaila.com/s/search?q='},
                        {id:5,title:'史莱姆',path:'http://www.slimego.cn/search.html?q='}
                    ]    
                },
                {
                    children:[
                        {id:0,title:'胡萝卜周',path:'http://www.carrotchou.blog/?s='},
                        {id:1,title:'ZD423',path:'https://www.zdfans.com/search.asp?keyword='},
                        {id:2,title:'机锋论坛',path:'http://bbs.gfan.com/search?q='},
                        {id:3,title:'果壳剥壳',path:'https://www.ghpym.com/?s='}
                    ]    
                },
                {
                    children:[
                        {id:0,title:'i-BOOK',path:'https://book.tstrs.me/find?q='},
                        {id:1,title:'熊猫搜书',path:'https://ebook.huzerui.com/#/result?keyword='},
                        {id:2,title:'LoreFree',path:'https://ebook2.lorefree.com/site/index?s='},
                        {id:3,title:'SoBook',path:'https://sobooks.cc/search/'}
                    ]    
                },
                {
                    children:[
                        {id:0,title:'下厨房',path:'http://www.xiachufang.com/search/?keyword='},
                        {id:1,title:'香哈菜谱',path:'https://www.xiangha.com/so/?q=caipu&s='}
                    ]    
                },
                
            ],
            searchIndex:0,//当前指向navTop的下标
            value:'百度',//初始搜索框中的内容
            searchValue:'',//输入的内容
            searchUrl:'https://www.baidu.com/s?wd=',//初始搜索框的地址值
            isClick:false,//是否点击蓝色背景导航
            blueBgIndex:[],//记录蓝色背景的位置，默认都为1
            blueBgPosition:[],//记录蓝色背景距离左边的距离，默认都为3
            clickIndex:[],//记录点击的导航的下标，默认都为1
            navList:[],//所有导航数据
        }
    },
    created() {
        this.getNavs()
    },
    mounted() {
        this.$refs.search.focus()
    },
    updated() {
        for(let i = 0; i < this.navList.length; i++){this.leaveNavs(i)}
    },
    methods: {
        //获取导航数据
        async getNavs(){
            const {data:res} = await this.$http.get('navs')
            if(res.code != 200) 
            return this.$message({message:'获取数据失败',type:'error',duration:1000})
            this.navList = res.data
            this.dealNavs(this.navList.length)
        },
        //根据获取的导航数据初始化数组
        dealNavs(number){
            this.blueBgIndex = Array.from({length:number},() => 1)
            this.blueBgPosition = Array.from({length:number},() => 3)
            this.clickIndex = Array.from({length:number},() => ({index:1}))
        },
        //点击切换ulTwo的值
        switchUl(index){
            var lis = document.querySelectorAll('#navTop>li')
            var uls = document.querySelectorAll('#navBottom')
            var line = document.querySelector('.line')
            this.removeClass(lis,index)
            line.style.marginLeft = -273 + 136*index + 'px'
            this.searchIndex = index
            this.value = uls[index].children[0].innerHTML
            this.navBottom.some( (item,i) => {
                if(i == index){
                    this.switchLi(0,item.children[0].path)//重置回最初始的状态
                    return true
                }
            })
            this.$refs.search.focus()
        },
        //点击切换ulTwo的li
        switchLi(index,path){
            var lis = document.querySelectorAll('#navBottom')[this.searchIndex].children
            this.removeClass(lis,index)
            this.value = lis[index].innerHTML
            this.searchUrl = path
            this.$refs.search.focus()
        },
        //搜索
        search(){
            if((this.searchValue.trim()) == '') 
            return this.$message({type:'error',duration:1000,message:'请输入内容'})
            window.open(this.searchUrl + this.searchValue)
            this.searchValue = ''
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
                lis[0].style.width = lis[this.clickIndex[fId].index].offsetWidth - 20 + 'px'
                this.removeClass(lis,this.blueBgIndex[fId])
            }
        },
        //点击导航
        clickNavs(fId,sId){
            var lis = document.querySelectorAll('.item>div nav')[fId].children
            this.isClick = true
            this.blueBgPosition[fId] = lis[sId + 1].offsetLeft
            lis[0].style.left = lis[sId + 1].offsetLeft + 'px'
            lis[0].style.width = lis[sId + 1].offsetWidth - 20 + 'px'
            this.removeClass(lis,sId + 1)
            this.blueBgIndex[fId] = sId + 1
            this.clickIndex[fId].index = sId
        },
        //清除样式
        removeClass(dom,i){
            dom.forEach( item => item.classList.remove('currentLi'))
            dom[i].className = 'currentLi'
        },
        //导航上浮动画
        up(fId,sId,grandsId){
            var li = document.querySelectorAll('.item')[fId].querySelectorAll('nav')[sId + 1].children[grandsId]
            if(!this.flag){
                li.classList.remove('downWhite')
                li.classList.add('upWhite')
            }else{
                li.classList.remove('downBlack')
                li.classList.add('upBlack')
            }
        },
        //导航下降动画
        down(fId,sId,grandsId){
            var li = document.querySelectorAll('.item')[fId].querySelectorAll('nav')[sId + 1].children[grandsId]
            if(!this.flag){
                li.classList.remove('upWhite')
                li.classList.add('downWhite')
            }else{
                li.classList.remove('upBlack')
                li.classList.add('downBlack')
            }
        }
    }
}
</script>

<style lang="less" scoped>
#link{
    width: 100%;
    min-height: 100vh;
    min-width: 375px;
    background-color: #F9F9F9;
    transition: color .25s;
    >header{
        height: 450px;
        background-color: rgb(7,7,27);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    >main{
        >section{
            width: 95%;
            margin: 25px auto;
        }
        >footer{
            width: 95%;
            margin: 0 auto;
            font-size: 12px;
            section{
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center; 
                p{
                    margin-bottom: 5px;
                }  
            }
        }
    }
}

#link>header{
    nav{
        list-style: none;
        display: flex;
        li{
            margin-right: 40px;
            color: #84848E;
            font-size: 14px;
            cursor: pointer;
            transition: color .4s;
            &:hover{color: #fff;}
            &:last-child{margin-right: 0;}
        }
    }
    .line{
        width: 32px;
        height: 4px;
        transition: all .4s;
        margin-left: -273px;
        border-radius: 2px;
        background-color: #fff;
    }
    .search{
        display: flex;
        justify-content: center;
        margin: 20px 0;
        position: relative;
        input{
            width: 800px;
            height: 50px;
            border: 0;
            border-radius: 25px;
            background-color: #000;
            color: #fff;
            padding-left: 20px;
            margin: 0 auto;
            &:focus{outline: none;}
            &::placeholder{font-size: 16px;}
        }
        button{
            position: absolute;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            background-color: #000;
            border: 0;
            cursor: pointer;
            i{color: #fff;font-size: 20px;}
            &:focus{outline: none;}
        }
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
                background-color: #E0E0E0;
                border-radius: 15px;
                cursor: pointer;
                position: relative;
                li{
                    line-height: 30px;
                    font-size: 14px;
                    color: #888;
                    padding: 0 10px;
                    z-index: 2;
                    transition: all .4s;
                }
                .back{
                    position: absolute;
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
                background-color: #fff;
                box-sizing: border-box;
                a{
                    display: block;
                    width: 100%;
                    height: 100%;
                    padding: 15px 15px;
                    box-sizing: border-box;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                img{
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    margin-right: 10px;
                }
                div{
                    width: 80%;
                    display: flex;
                    flex-direction: column;
                    font-size: 12px;
                    strong{
                        margin-bottom: 5px;
                        color:#000;
                        transition: color .25s;
                    }
                    span{
                        color: #6C757D;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                }
                transition: all .25s;
                &:hover{strong{color: #2468F2!important;}}
            }
        }
    }
}

.currentLi{color: #fff!important;}
.upWhite{animation: upWhite .25s linear forwards;} 
.downWhite{animation: downWhite .25s linear forwards;} 
.upBlack{animation: upBlack .25s linear forwards;} 
.downBlack{animation: downBlack .25s linear forwards;} 
.liWhite{
    box-shadow: 6px 8px 12px #e2dede,-6px 8px 12px #e2dede!important;
    background-color: #fff!important;
}
.liBlack{
    box-shadow: 6px 8px 12px rgba(0,0,0, .2),-6px 8px 12px rgba(0,0,0, .2)!important;
    background-color: #2c2e2f!important;
}
@keyframes upWhite {
  from{
      transform: translateY(0);
      box-shadow: 2px 2px 2px #e2dede,-2px -2px 2px #e2dede;
  }
  to{
      transform: translateY(-10px);
      box-shadow: 6px 8px 12px #e2dede,-6px 8px 12px #e2dede;
  }                  
}
@keyframes downWhite {
  from{
      transform: translateY(-10px);
      box-shadow: 2px 2px 2px #e2dede,-2px -2px 2px #e2dede;
  }
  to{
      transform: translateY(0);
      box-shadow: 6px 8px 12px #e2dede,-6px 8px 12px #e2dede;
  }                  
}
@keyframes upBlack {
  from{
      transform: translateY(0);
      box-shadow: 2px 2px 2px rgba(0,0,0, .2),-2px -2px 2px rgba(0,0,0, .2);
  }
  to{
      transform: translateY(-10px);
      box-shadow: 6px 8px 12px rgba(0,0,0, .2),-6px 8px 12px rgba(0,0,0, .2);
  }                  
}
@keyframes downBlack {
  from{
      transform: translateY(-10px);
      box-shadow: 2px 2px 2px  rgba(0,0,0, .2),-2px -2px 2px  rgba(0,0,0, .2);
  }
  to{
      transform: translateY(0);
      box-shadow: 6px 8px 12px  rgba(0,0,0, .2),-6px 8px 12px  rgba(0,0,0, .2);
  }                  
}

@media screen and (min-width: 1920px) {
    section .item>nav li{
        margin: 0 30px 30px 0;
        width: 270px;
    }
}
@media screen and (min-width: 1680px) and (max-width: 1920px) {
    section .item>nav li{
        margin: 0 2% 30px 0;
        width: 15%;
        &:nth-child(6n){margin-right: 0;}
    }
}
@media screen and (min-width: 1200px) and (max-width: 1680px) {
    section .item>nav li{
        margin: 0 2% 30px 0;
        width: 18.4%;
        &:nth-child(5n){margin-right: 0;}
    }
}
@media screen and (min-width: 960px) and (max-width: 1200px) {
    section .item>nav li{
        margin: 0 2% 30px 0;
        width: 23.5%;
        &:nth-child(4n){margin-right: 0;}
    }
}
@media screen and (min-width: 760px) and (max-width: 960px) {
    section .item>nav li{
        margin: 0 2% 30px 0;
        width: 32%;
        &:nth-child(3n){margin-right: 0;}
    }
    .search input{
        width: 600px!important;
    }
}
@media screen and (max-width: 760px) {
    section .item>nav li{
        margin: 0 2% 30px 0;
        width: 48%;
        &:nth-child(2n){margin-right: 0;}
    }
    .search input{
        width: 500px!important;
    }
}
@media screen and (max-width: 600px) { 
    header{
        height: 7.5vh!important;
    }
    header nav,header .line,header .search{
        display: none!important;
    }
}
</style>