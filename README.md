##### **大会员登录逻辑**
* 首先从cookie中取unionid和openid, 如果能取到就直接登录进去，取不到就先向微信请求授权
* 微信授权请求的详细过程 https://mp.weixin.qq.com/wiki/17/c0f37d5704f0b64713d5d2c37b468d75.html
* 微信授权请求成功之后就会拿到用户的信息，将其中的unionid和openid存到cookie里，再跳转到登录界面
* 大会员登录成功之后，调用其他接口都需要用到unionid,通过unionid拿到tokenid和密钥，然后给密钥加密，带着tokenid和签名的密钥向后端java请求拿到数据，再进行相应的渲染

##### **大会员目录结构**
```
├─node_modules 依赖模块

└─log 应用日志服务(*如果没有则新建对应logs目录以及子目录)
    ├─clintLogs
    ├─errLogs 
    └─serverLogs 

└─public 静态资源访问目录
    ├─activity 营销活动 例如2016年会员数据服务活动
    ├─dhy 大会员入口js以及相关控制器路由
    ├─ferris_wheel 摩天轮
    ├─invitation 大会员分享所需静态资源
    ├─park 停车场静态资源
    ├─secKill 秒杀活动静态资源
    ├─static 大会员静态资源以及通用资源
    └─views SPA应用所需的ejs模版 例如大会员停车场

└─server 服务端代码目录
    ├─bin
    ├─config 环境切换配置
    ├─controllers 视图控制器
    ├─libs 函数库
    ├─routes 路由
    └─views  视图模版

├─app.js *入口配置文件(涉及开发部署环境切换)

```   

##### **开发流程**

* 注意app.js中app.set('env','development');为开发模式
* npm run dev
 
##### **发布打包流程**

* 修改app.js中app.set('env','production');为产品发布模式
* npm run push 打包发布整个项目
* linux中 npm start 启动整个应用 




