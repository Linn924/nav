<template>
    <div id="nav">

        <el-backtop><i :class="flag?'el-icon-caret-top iconMoon':'el-icon-caret-top iconSunny'"></i></el-backtop>

        <aside :class="flag?'asideMoon':'asideSunny'">
            <div class="logo">
                <img src="../assets/logo.jpg">
                <transition name="logo"><span v-show="!isFold">简约导航</span></transition>
            </div>

            <el-menu :class="flag?'one asideMoon scrollbarMoon':'one asideSunny scrollbarSunny'" 
                :collapse="isFold" :unique-opened="true">
                <el-submenu v-for="(father,fId) in asideTop" :key="fId" :index="fId">
                    <template slot="title">
                        <i :class="father.className" :style="{'margin':fId == 5 || fId == 6 ? '0 10px 0 5px': ''}"></i>
                        <span slot="title" :style="{'color':flag?'#fff':'#000'}">{{father.title}}</span>
                    </template>
                    <el-menu-item-group :class="flag?'asideMoon':'asideSunny'">
                        <span slot="title">{{father.title}}</span>
                        <el-menu-item v-for="(son,sId) in father.children" :key="sId" :index="`${fId}-${sId}`" 
                            @click="location(fId,sId)" :style="{'color':flag?'#fff':'#000'}">{{son.title}}
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
            </el-menu>

            <el-menu :class="flag?'two asideMoon':'two asideSunny'" :collapse="isFold">
                <el-menu-item :style="{'color':flag?'#fff':'#000'}" index="0" @click="clickLoginBtn">
                    <i class="el-icon-user-solid"></i>
                    <span slot="title">账号登录</span>
                </el-menu-item>
                <el-menu-item :style="{'color':flag?'#fff':'#000'}" index="1" @click="logout" v-show="token">
                    <i class="el-icon-coordinate"></i>
                    <span slot="title">退出登录</span>
                </el-menu-item>
                <el-menu-item :style="{'color':flag?'#fff':'#000'}" index="2">
                    <i class="el-icon-warning-outline"></i>
                    <span slot="title">关于本站</span>
                </el-menu-item>
            </el-menu>
        </aside>

        <transition name="mask"><div class="mask" v-show="drawer" @click="drawer = !drawer"></div></transition>

        <transition name="drawer">
            <div class="drawer" v-show="drawer" :class="flag?'asideMoon':'asideSunny'">
                <div class="logo">
                    <img src="../assets/logo.jpg">
                    <transition name="logo"><span>简约导航</span></transition>
                </div>

                <el-menu :class="flag?'one asideMoon scrollbarMoon':'one asideSunny scrollbarSunny'"
                    :unique-opened="true">
                    <el-submenu v-for="(father,fId) in asideTop" :key="fId" :index="fId">
                        <template slot="title">
                            <i :class="father.className" :style="{'margin':fId == 5 || fId == 6 ? '0 10px 0 5px': ''}"></i>
                            <span slot="title" :style="{'color':flag?'#fff':'#000'}">{{father.title}}</span>
                        </template>
                        <el-menu-item-group :class="flag?'asideMoon':'asideSunny'">
                            <span slot="title">{{father.title}}</span>
                            <el-menu-item v-for="(son,sId) in father.children" :key="sId" :index="`${fId}-${sId}`" 
                                @click="location(fId,sId)" :style="{'color':flag?'#fff':'#000'}">{{son.title}}
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                </el-menu>

                <el-menu :class="flag?'two asideMoon':'two asideSunny'">
                    <el-menu-item :style="{'color':flag?'#fff':'#000'}">
                        <i class="eel-icon-warning-outline"></i>
                        <span slot="title">关于本站</span>
                    </el-menu-item>
                </el-menu>
            </div>
        </transition>

        <section :style="{'padding-left':isFold ?'64px':'200px'}">
            <header :class="flag?'hairyglassMoon':'hairyglassSunny'">
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
                    <i class="fa fa-bars" @click="drawer = !drawer"></i>
                </div>
            </header>

            <main><router-view ref="Link" :flag="flag" :token="token"></router-view></main>
        </section>

        <div class="weatherBox">
            <Weather :flag="flag"></Weather>

            <div class="toggleMode">
                <el-tooltip effect="dark" content="日间模式" placement="left">
                    <i :class="flag?'el-icon-sunny iconMoon':'el-icon-sunny iconSunny'" 
                    v-show="flag" @click="flag = false"></i>
                </el-tooltip>
                <el-tooltip effect="dark" content="夜间模式" placement="left">
                    <i :class="flag?' el-icon-moon iconMoon':'el-icon-moon iconSunny'" 
                    v-show="!flag" @click="flag = true"></i>
                </el-tooltip>
            </div>
        </div>
    </div>
</template>

<script>
import Weather from './basic/Weather'
export default {
    inject:['reload'],
    components:{
        Weather
    },
    data(){
        return {
            asideTop:[//左侧导航数据1
                {
                    id:0,
                    className:'el-icon-location',
                    title:'常用站点',
                    children:[
                        {id:0,title:'开发'},
                        {id:1,title:'影视'},
                        {id:2,title:'导航'},
                        {id:3,title:'实时信息'},
                        {id:4,title:'个人网站'},
                        {id:5,title:'直播'}
                    ]
                },
                {
                    id:1,
                    className:'el-icon-video-camera-solid',
                    title:'视频直播',
                    children:[
                        {id:0,title:'索引'},
                        {id:1,title:'在线'},
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
                        {id:0,title:'索引'},
                        {id:1,title:'常用搜索'},
                        {id:2,title:'网盘搜索'},
                        {id:3,title:'以图搜索'},
                        {id:4,title:'数据搜索'}
                    ]
                },
                {
                    id:3,
                    className:'el-icon-s-platform',
                    title:'软件游戏',
                    children:[
                        {id:0,title:'索引'},
                        {id:1,title:'综合'},
                        {id:2,title:'安卓'},
                        {id:3,title:'苹果'},
                        {id:4,title:'游戏'},
                        {id:5,title:'浏览器'}
                    ]
                },
                {
                    id:4,
                    className:'el-icon-s-order',
                    title:'阅读漫画',
                    children:[
                        {id:0,title:'索引'},
                        {id:1,title:'阅读小说'},
                        {id:2,title:'免费漫画'}
                    ]
                },
                {
                    id:5,
                    className:'fa fa-music',
                    title:'音乐动听',
                    children:[
                        {id:0,title:'索引'},
                        {id:1,title:'在线音乐'},
                        {id:2,title:'无损音乐'}
                    ]
                },
                {
                    id:6,
                    className:'fa fa-wrench',
                    title:'实用工具',
                    children:[
                        {id:0,title:'索引'},
                        {id:1,title:'综合'},
                        {id:2,title:'功能类'},
                        {id:3,title:'文件处理'},
                        {id:4,title:'图片处理'}
                    ]
                },
                {
                    id:7,
                    className:'el-icon-edit',
                    title:'学习教育',
                    children:[
                        {id:0,title:'索引'},
                        {id:1,title:'好好学习'},
                        {id:2,title:'文档学术'}
                    ]
                },
                {
                    id:8,
                    className:'el-icon-s-cooperation',
                    title:'办公素材',
                    children:[
                        {id:0,title:'索引'},
                        {id:1,title:'PPT'},
                        {id:2,title:'图库'},
                        {id:3,title:'壁纸'},
                        {id:4,title:'图标'},
                        {id:5,title:'字体'},
                        {id:6,title:'配色'}
                    ]
                },
            ],
            routerList:[//路由导航
                {router:'/home',className:'#icon-home',name:'主页'},
                {router:'/home',className:'#icon-link',name:'友情链接'},
            ],
            isFold: true,//切换模式 折叠or打开
            flag:false,//切换模式 日间or夜间
            drawer:false,//移动端状态下切换下拉框模式 下拉or隐藏
            imageList:[//预加载图片数据
                'https://s3.ax1x.com/2021/01/31/yEVgQs.png',
                'https://s3.ax1x.com/2021/01/31/yEVTW4.jpg',
                'https://s3.ax1x.com/2021/01/31/yEV6zj.jpg',
                'https://s3.ax1x.com/2020/12/04/DqicSe.jpg',
                'https://s3.ax1x.com/2021/02/02/ynl0PJ.jpg'
            ],
            token:false,//判断管理员的登录状态 登录or未登录
        }
    },
    created() {
        document.oncontextmenu =  () => {event.returnValue = false}
        this.token = sessionStorage.getItem('token') ? true : false
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
            let url = location.href
            if(url.includes('navlist')){
                var ul = document.querySelectorAll('.item>div nav')[fId]
                window.scroll({top: ul.offsetTop - 135,behavior: 'smooth'})
                this.$refs.Link.clickNavs(fId,sId)
            }else if(url.includes('navdetail')){
                this.$router.push('/home/navlist')
            }
        },
        //跳转到登录界面
        clickLoginBtn(){
            this.$router.push('/login')
        },
        //管理员登出
        logout(){
            sessionStorage.clear()
            this.reload()
        }
    }
}
</script>

<style lang="less" scoped>
#nav{
    display: flex;
    position: relative;
    aside{
        height: 100vh; 
        background-color: #f9f9f9;
        position: fixed;
        display: flex;
        flex-direction: column;
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
        i{
            padding: 13px 13px;
            background-color: #eee;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 10px 0 rgba(0,0,0,0.12);
            transition: color .25s;
        }
    }
    .drawer{
        z-index: 999;
        top: 0;
        left: 0;
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
                color: #909399;
                margin: 0 20px 0 20px;
                cursor: pointer;
                transition: color .25s;
                &:hover{color: #2468F2!important;}
            }
        }
    }
}

.el-backtop{
    color: #777;
    font-size: 14px;
    right: 25px!important;
    bottom: 112px!important;
    width: 40px;
    height: 40px;
    i{padding: 14px 14px;border-radius: 50%;}
}
.asideSunny{
    background-color: #F1F5F8!important;
    div.el-submenu__title:hover{
        span{color: #2468F2!important;}
    }
    li.el-menu-item:hover{
        background-color: #FFF!important;
        color: #2468F2!important;
    } 
}
.asideMoon{
    background-color: #1B1D1F!important;
    div.el-submenu__title:hover{
        span{color: #2468F2!important;}
    }
    li.el-menu-item:hover{
        background-color: #2C2E2F!important;
        color: #2468F2!important;
    } 
}
.hairyglassSunny::before{
    content: '';
    backdrop-filter: blur(5px);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -1;
    background-color: rgba(241,245,248, .8);
    background-attachment: fixed;
}
.hairyglassMoon::before{
    content: '';
    backdrop-filter: blur(5px);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -1;
    background-color: rgba(27,29,31, .8);
    background-attachment: fixed;
}
.iconSunny{
    background-color: #fff!important;
    color: #777!important;
    &:hover{color: #000!important;}
}
.iconMoon{
    background-color: #363738!important;
    color: #AAA!important;
    &:hover{color: #fff!important;}
}
.scrollbarSunny{
    &::-webkit-scrollbar {width: 6px;border-radius: 4px;}
    &::-webkit-scrollbar-thumb {background-color: #fff;border-radius: 4px;}
    &::-webkit-scrollbar-track{background-color: #F1F5F8;}
}
.scrollbarMoon{
    &::-webkit-scrollbar {width: 6px;border-radius: 4px;}
    &::-webkit-scrollbar-thumb {background-color: #2C2E2F;border-radius: 4px;}
    &::-webkit-scrollbar-track{background-color: #1B1D1F;}
}

.logo-enter,
.logo-leave-to{opacity: 0;}
.logo-enter-active{transition: all 1s;}
.logo-leave-active{transition: all 0.2s;}

.drawer-enter,
.drawer-leave-to,
.mask-enter,
.mask-leave-to{opacity: 0;}
.drawer-enter-active,
.drawer-leave-active,
.mask-enter-active
.mask-leave-active{transition: all 1s;} 

@media screen and (max-width: 960px) {
    #nav>aside,#nav>section>header .computer{
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
        bottom: 60px!important;
    }
    #nav .weatherBox{
        height: 40px;
        bottom: 10px;
    }
}
@media screen and (min-width: 961px) { 
    section header .phone{
        display: none!important;
    }
}
</style>