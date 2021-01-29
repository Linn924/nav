<template>
    <div id="nav">

        <el-backtop><i :class="flag?'el-icon-caret-top backtopBlack':'el-icon-caret-top backtopWhite'"></i></el-backtop>

        <aside :class="flag?'switchColor enterAside':''">
            <div class="logo">
                <img src="../assets/logo.jpg">
                <transition name="logo"><span v-show="!isFold">LinnCooper</span></transition>
            </div>

            <el-menu :class="flag?'one switchColor':'one'" :collapse="isFold" :unique-opened="true">
                <el-submenu v-for="(father,fId) in asideTop" :key="fId" :index="fId">
                    <template slot="title">
                        <i :class="father.className" :style="{'margin':fId == 5 || fId == 6 ? '0 10px 0 5px': ''}"></i>
                        <span slot="title" :style="{'color':flag?'#fff':'#000'}">{{father.title}}</span>
                    </template>
                    <el-menu-item-group :class="flag?'switchColor enterAside':''">
                        <span slot="title">{{father.title}}</span>
                        <el-menu-item v-for="(son,sId) in father.children" :key="sId" :index="`${fId}-${sId}`" 
                            @click="location(fId,sId)" :style="{'color':flag?'#fff':'#000'}">{{son.title}}
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
            </el-menu>

            <el-menu :class="flag?'two switchColor':'two'" :collapse="isFold">
                <el-menu-item v-for="(item,id) in asideBottom" :key="id" :index="id" 
                    :style="{'color':flag?'#fff':'#000'}">
                    <i :class="item.className"></i>
                    <span slot="title">{{item.title}}</span>
                </el-menu-item>
            </el-menu>
        </aside>

        <!-- 蒙版 -->
        <!-- <transition name="mask">
            <div class="mask" v-show="drawer" @click="drawer = !drawer"></div>
        </transition> -->

        <!-- 移动端状态下的导航抽屉 -->
        <transition name="drawer">
            <div class="drawer" v-show="drawer">
                <div class="logo">
                    <img src="../assets/logo.jpg">
                    <transition name="logo"><span>LinnCooper</span></transition>
                </div>

                <el-menu :class="flag?'one switchColor':'one'" :unique-opened="true">
                    <el-submenu v-for="(father,fId) in asideTop" :key="fId" :index="fId">
                        <template slot="title">
                            <i :class="father.className" :style="{'margin':fId == 5 || fId == 6 ? '0 10px 0 5px': ''}"></i>
                            <span slot="title" :style="{'color':flag?'#fff':'#000'}">{{father.title}}</span>
                        </template>
                        <el-menu-item-group :class="flag?'switchColor enterAside':''">
                            <span slot="title">{{father.title}}</span>
                            <el-menu-item v-for="(son,sId) in father.children" :key="sId" :index="`${fId}-${sId}`" 
                                @click="location(fId,sId)" :style="{'color':flag?'#fff':'#000'}">{{son.title}}
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                </el-menu>

                <el-menu :class="flag?'two switchColor':'two'">
                    <el-menu-item v-for="(item,id) in asideBottom" :key="id" :index="id" 
                        :style="{'color':flag?'#fff':'#000'}">
                        <i :class="item.className"></i>
                        <span slot="title">{{item.title}}</span>
                    </el-menu-item>
                </el-menu>
            </div>
        </transition>

        <section :style="{'padding-left':isFold ?'64px':'200px'}">
            <header :class="flag?'black':'white'">
                <div class="computer">
                    <img src="../assets/logo.jpg">
                    <i class="fa fa-bars" @click="isFold = false" v-show="isFold"></i>
                    <i class="el-icon-s-data" @click="isFold = true" v-show="!isFold"></i>
                    <!-- <nav><li v-for="(item,id) in routerList" :key="id">
                            <router-link :to="item.router">
                                <span>{{item.name}}</span>
                            </router-link>
                        </li>
                    </nav> -->
                </div>
                <div class="phone">
                    <img src="../assets/logo.jpg">
                    <i class="el-icon-s-operation" @click="drawer = !drawer"></i>
                </div>
            </header>

            <main><router-view ref="Link" :flag="flag"></router-view></main>
        </section>

        <div class="weatherBox">
            <div class="weather">
                <i :class="className" 
                    @mouseenter="showWeather = true" @mouseleave="showWeather = false"></i>
                <div v-show="showWeather" @mouseenter="showWeather = true" 
                    @mouseleave="showWeather = false">
                    <header><label>{{now.city}}</label><span>简约天气</span></header>
                    <main><span>{{now.wendu}}</span><span>{{now.type}}</span>
                    </main>
                    <footer>
                        <table>
                            <tr v-for="(item,index) in weatherList" :key="index">
                                <td align="center">{{item.date}}</td>
                                <td align="center">{{item.type}}</td>
                                <td align="center">{{item.wendu}}</td>
                                <td align="center">{{item.fengxiang}}</td>
                            </tr>
                        </table>
                    </footer>
                </div>
            </div>

            <div class="toggleMode">
                <el-tooltip effect="dark" content="当前日间模式" placement="left">
                    <i :class="flag?'el-icon-sunny backtopBlack':'el-icon-sunny backtopWhite'" 
                    v-show="!flag" @click="flag = true"></i>
                </el-tooltip>
                <el-tooltip effect="dark" content="当前夜间模式" placement="left">
                    <i :class="flag?' el-icon-moon backtopBlack':'el-icon-moon backtopWhite'" 
                    v-show="flag" @click="flag = false"></i>
                </el-tooltip>
            </div>
        </div>


    </div>
</template>

<script>
export default {
    data(){
        return {
            asideTop:[//左侧导航数据1
                {
                    id:0,
                    className:'el-icon-location',
                    title:'常用站点',
                    children:[
                        {id:0,title:'阅读'},
                        {id:1,title:'购物'},
                        {id:2,title:'直播'},
                        {id:3,title:'国外'},
                        {id:4,title:'视频'},
                        {id:5,title:'工具'}
                    ]
                },
                {
                    id:1,
                    className:'el-icon-video-camera-solid',
                    title:'视频直播',
                    children:[
                        {id:0,title:'免费在线'},
                        {id:1,title:'高清下载'},
                        {id:2,title:'追剧'},
                        {id:3,title:'动漫'},
                        {id:4,title:'解析'}
                    ]
                },
                {
                    id:2,
                    className:'el-icon-zoom-in',
                    title:'资源搜索',
                    children:[
                        {id:0,title:'网盘搜索'},
                        {id:1,title:'BT搜索'},
                        {id:2,title:'磁力软件'}
                    ]
                },
                {
                    id:3,
                    className:'el-icon-s-platform',
                    title:'软件游戏',
                    children:[
                        {id:0,title:'精品软件'},
                        {id:1,title:'安卓'},
                        {id:2,title:'苹果'},
                        {id:3,title:'游戏'},
                        {id:4,title:'浏览器'}
                    ]
                },
                {
                    id:4,
                    className:'el-icon-s-order',
                    title:'阅读漫画',
                    children:[
                        {id:0,title:'阅读小说'},
                        {id:1,title:'免费漫画'}
                    ]
                },
                {
                    id:5,
                    className:'fa fa-music',
                    title:'音乐动听',
                    children:[
                        {id:0,title:'在线音乐'},
                        {id:1,title:'无损音乐'},
                        {id:2,title:'音乐软件'}
                    ]
                },
                {
                    id:6,
                    className:'fa fa-wrench',
                    title:'实用工具',
                    children:[
                        {id:0,title:'综合工具'},
                        {id:1,title:'功能类'},
                        {id:2,title:'文件处理'},
                        {id:3,title:'图片处理'}
                    ]
                },
                {
                    id:7,
                    className:'el-icon-edit',
                    title:'学习教育',
                    children:[
                        {id:0,title:'学习网站'},
                        {id:1,title:'文档学术'}
                    ]
                },
                {
                    id:8,
                    className:'el-icon-s-cooperation',
                    title:'办公素材',
                    children:[
                        {id:0,title:'PPT'},
                        {id:1,title:'图库'},
                        {id:2,title:'壁纸'},
                        {id:3,title:'图标'},
                        {id:4,title:'字体'},
                        {id:5,title:'配色'}
                    ]
                },
            ],
            asideBottom:[//左侧导航数据2
                {id:0,className:'el-icon-warning-outline',title:'关于本站'}
            ],
            routerList:[//路由导航
                {router:'/link',className:'#icon-home',name:'主页'},
                {router:'/link',className:'#icon-link',name:'友情链接'},
            ],
            weatherList:[],//最近三天天气数据
            now:{//当天天气信息
                city:'',//当前城市
                wendu:'',//当天平均温度
                type:'',//当天天气状态
            },
            imageList:[//预加载图片数据
                'https://s1.ax1x.com/2020/10/08/00iVJO.jpg'
            ],
            isFold: true,//切换模式 折叠or打开
            flag:false,//切换模式 日间or夜间
            showWeather:false,//切换天气模式 显示or隐藏
            drawer:false,//移动端状态下切换下拉框模式 下拉or隐藏
        }
    },
    computed:{
        className(){
            let className = ''
            if(!this.flag){
                if(this.now.type == '晴'){
                    className = 'el-icon-sunny ' + 'backtopWhite'
                }else if(this.type == '多云'){
                    className = 'el-icon-cloudy ' + 'backtopWhite'
                }else{
                    className = 'el-icon-heavy-rain ' + 'backtopWhite'
                }
            }else{
                if(this.now.type == '晴'){
                    className = 'el-icon-sunny ' + 'backtopBlack'
                }else if(this.type == '多云'){
                    className = 'el-icon-cloudy ' + 'backtopBlack'
                }else{
                    className = 'el-icon-heavy-rain ' + 'backtopBlack'
                }
            }
            return className
        }
    },
    created() {
        this.getLoactionCity()
        document.oncontextmenu =  () => {event.returnValue = false}
        this.preLoadImg(this.imageList)
    },
    methods: {
        // 预加载图片
        preLoadImg(arr){
            let imgList = []
            arr.forEach((item,index) => {
                imgList[index] = new Image()
                imgList[index].src = arr[index]
            })
        },
        //锚点跳转
        location(fId,sId){
            var ul = document.querySelectorAll('.item>div nav')[fId]
            window.scroll({top: ul.offsetTop - 135,behavior: 'smooth'})
            this.$refs.Link.clickNavs(fId,sId)
        },
        //获取当前地址,使用jsonp解决跨域问题 (get请求)
        async getLoactionCity(){
            const data = await this.$jsonp('https://restapi.amap.com/v3/ip?key=b30eb9c64b4094a062fa5cce3b26496e')
            this.now.city = data.city
            this.getWeather(data.city)
        },
        //根据城市获取城市天气
        async getWeather(location){
            const {data:res} = await this.$axios.get(`http://wthrcdn.etouch.cn/weather_mini?city=${location}`)
            if(res.status !== 1000) 
            return this.$message.error('获取天气数据失败')
            const value = res.data.forecast.slice(0,3)
            this.dealWeather(value)
        },
        //处理天气数据
        dealWeather(value){
            value.map( (item,index) => {
                if(index == 0){item.date = '今天';}
                else if(index == 1){item.date = '明天';}
                else{item.date = '后天';}
                item.wendu = item.low.split(' ')[1] + '/' + item.high.split(' ')[1]
            })
            this.weatherList = value
            let high = Number(value[0].high.split(' ')[1].split('').filter(item => item !== '℃' && item).join(''))
            let low = Number(value[0].low.split(' ')[1].split('').filter(item => item !== '℃' && item).join(''))
            this.now.wendu = (high + low) / 2 + '℃'
            this.now.type = value[0].type
        }
    }
}
</script>

<style lang="less" scoped>

#nav{
    display: flex;
    position: relative;
    >aside{
        height: 100vh; 
        background-color: #f9f9f9;
        position: fixed;
        display: flex;
        flex-direction: column;
    }
    .drawer{
        z-index: 999;
        top: 0;
        height: 100vh; 
        background-color: #f9f9f9;
        position: fixed;
        display: flex;
        flex-direction: column;
    }
    .mask{
        height: 100vh;
        width: 100vw;
        position: fixed;
        background-color: rgba(0,0,0, .5);
        border: 1px solid #fff;
        z-index: 998;
    }
    >section{
        width: 100vw;
        transition: all .4s;
        box-sizing: border-box;
    }
    .weatherBox{
        position: fixed;
        height: 100px;
        bottom: 10px;
        right: 25px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
    }
}

#nav>aside,.drawer{
    .logo{
        margin: 10px auto;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        img{width: 50px;height: 50px;border-radius: 50%;}
        span{margin-left: 10px;color: #2468F2;}
    }
    .one:not(.el-menu--collapse) {
        width: 200px;
        border: 0;
        max-height: 750px;
        overflow-y: auto;
        overflow-x: hidden;
        &::-webkit-scrollbar {width: 6px;}
        &::-webkit-scrollbar-thumb {background-color: #ddd;border-radius: 3px;}
        &::-webkit-scrollbar-track{background-color: #fff;}
    }
    .one,.two{border: 0;background-color: #f9f9f9;}
    .two{margin-top: auto;}
    .el-menu-item{&:hover{color: #2468F2!important;}}
}

#nav>section{
    header{
        width: 100%;
        height: 7.5vh;
        position: fixed;
        display: flex;
        align-items: center;
        z-index: 997;
        .computer{
            display: flex;
            align-items: center;
            position: relative;
            i{
                color: #909399;
                font-size: 24px;
                transition: color .25s;
                &:hover{color: #2468F2!important;}
                margin: 0 20px 0 20px;
                cursor: pointer;
                &:last-child{transform: rotate(90deg);}
            }
            img{width: 50px;height: 50px;border-radius: 50%;display: none;}
            nav{
                display: flex;
                list-style: none;
                li{margin-right: 20px;
                    a{
                        color: #000;
                        font-size: 14px;
                        transition: color .25s;
                        cursor: pointer;
                        &:hover{color: #2468F2!important;}
                        span{margin-left: 2px;}
                    }
                    
                }
            }
        }
        .phone{
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            img{width: 50px;height: 50px;border-radius: 50%;margin-left: 20px;}
            >i{
                font-size: 24px;
                color:#2468F2;
                margin: 0 20px 0 20px;
                cursor: pointer;
            }
        }
    }
}

#nav .weatherBox{
    i{
        padding: 12px 12px;
        background-color: #eee;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 10px 0 rgba(0,0,0,0.12);
        transition: color .25s;
    }
    .weather{
        position: relative;
        >div{
            position: absolute;
            top: 50px;
            left: -1px;
            transform: translate(-100%,-100%);
            width: 270px;
            height: 450px;
            border-radius: 5px;
            padding: 10px 10px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background-color: rgba(0,0,0, .2);
            backdrop-filter: blur(2px);
            background: url(https://s1.ax1x.com/2020/10/08/00iVJO.jpg) no-repeat center;
            background-size: cover;
            z-index: 999;
            header{
                display: flex;
                justify-content: space-between;
                color: #fff;
                font-size: 14px;
            }
            main{
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: #fff;
                padding-bottom:10px ;
                span:first-child{font-size: 50px;}
                span:last-child{
                    font-size: 14px;
                    background-color: #2468F2;
                    border-radius: 5px;
                    padding: 2px 5px;
                }
                border-bottom: 1px solid #fff;
            }
            footer{
                color: #fff;
                td{width: 25%;}
            }
        }
        i{margin: 10px 0;}
    }
}

.backtopBlack{background-color: #363738!important;color: #AAA!important;}
.backtopWhite{background-color: #fff!important;color: #777!important;}

.el-backtop{
    color: #777;
    font-size: 14px;
    right: 25px!important;
    bottom: 112px!important;
    width: 40px;
    height: 40px;
    i{padding: 14px 15px;border-radius: 50%;}
}
header.black{a{color: #fff!important;}}
.black::before{
    content: '';
    backdrop-filter: blur(5px);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -1;
    background-color: rgba(0,0,0, .2);
    background-attachment: fixed;
}
.white::before{
    content: '';
    backdrop-filter: blur(5px);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -1;
    background-color: rgba(253,253,253, .8);
    background-attachment: fixed;
}

@keyframes drawerShow{from{left: -200px;}to{left: 0;}}
@keyframes drawerHide{from{left: 0;}to{left: -200px;}}
.switchColor{background-color: #2C2E2F!important;}
.logo-enter,.logo-leave-to{opacity: 0;}
.logo-enter-active{transition: all 1s;}
.logo-leave-active{transition: all 0.2s;}
.drawer-enter{
    animation: drawerShow 1s linear forwards;
    opacity: 0;
}
.drawer-leave-to{
    animation: drawerHide 0.4s linear forwards;
    opacity: 0;
}
.drawer-enter-active{transition: all 1s;}
.drawer-leave-active{transition: all 0.4s;}
.mask-enter,.mask-leave-to{opacity: 0;}
.drawer-enter-active{transition: all 1s;}
.drawer-leave-active{transition: all 0.4s;}


.enterAside{
    div.el-submenu__title:hover{
        span{color: #2468F2!important;}
    }
    li.el-menu-item:hover{
        background-color: #1B1D1F!important;
        color: #2468F2!important;
    } 
} 
@media screen and (max-width: 760px) {
    #nav>aside,#nav>section>header .computer,.weatherBox{
        display: none!important;
    }
    #nav>section>header .computer>img{
        display: block;
        margin-right: 20px;
    }
    #nav>section{
        padding-left: 0!important;
    }
    #nav>.el-backtop{
        right: 18px!important;
        bottom: 20px!important;
    }
}
@media screen and (min-width: 761px) { 
    section header .phone{
        display: none!important;
    }
}
</style>