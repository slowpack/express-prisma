// 引入所需的依赖包
import express from 'express'

// import { getMirror } from "./getMirror.js";
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import bodyParser from 'body-parser'
// 创建一个Express应用
const app = express()
app.use(cors())
app.use(bodyParser.text({limit: '20mb'}))

const prisma = new PrismaClient()

// 定义一个GET请求处理程序，当接收到"/menu"的GET请求时触发
app.get('/menu', async (req, res) => {
  const getMenus = prisma.$extends({
    result: {
      menus: {
        params: {
          needs: { url: true },
          compute(menus) { return { url: menus.url } },
        }
      },
    }
  })
  const menus = await getMenus.menus.findMany()
  const menu = {
    status: 1,
    error: '',
    data: [
      {
        'title': '文本生成',
        'icon': 'icons8-goodnotes',
        'children': [
          { 'title': 'GPT镜像', 'icon': 'icons8-chatgpt', 'children': menus, },
          {
            'title': 'GPT4镜像',
            'icon': 'icons8-chatgpt',
            'children': [
              {
                'title': 'lv',
                'windowName': 'GPT4-1',
                'params': { 'url': 'https://www.gpt-lv.com/' },
              },
              {
                'title': 'ai',
                'windowName': 'GPT4-2',
                'params': { 'url': 'https://www.gpt-lv.com/' },
              }
            ]
          },
          {
            'title': '商业大模型',
            'icon': 'sidebar-window',
            'children': [
              {
                'title': '讯飞星火',
                'windowName': 'SparkDesk',
                'params': { 'url': 'https://xinghuo.xfyun.cn/desk' },
              },
              {
                'title': 'Claude',
                'windowName': 'Claude',
                'params': { 'url': 'https://app.slack.com/client/T053QA6LHFS/C059PD1PYBS' },
              },
              {
                'title': 'google-bard',
                'windowName': 'https://bard.google.com/',
              },
              {
                'title': 'Claude2',
                'windowName': 'https://claude.ai/chats',
              },
              {
                'title': 'Bing',
                'windowName': 'Bing',
                'params': { 'url': 'https://bing-vercel.vcanbb.top/web/#/' },
              },
              {
                'title': '360智脑',
                'windowName': '360',
                'params': { 'url': 'https://chat.360.cn/?src=ai_360_cn' },
              },
              {
                'title': '通义千问',
                'windowName': 'QianWen',
                'params': { 'url': 'https://qianwen.aliyun.com/' },
              },
              {
                'title': '文心一言',
                'windowName': 'Yiyan',
                'params': { 'url': 'https://yiyan.baidu.com/welcome' },
              }
            ],
          }
        ],
      },
      {
        'title': '绘画',
        'icon': 'sidebar-default',
        'children': [
          {
            'title': 'AI绘画',
            'icon': 'sidebar-window',
            'children': [
              {
                'title': '造梦日记',
                'windowName': 'https://printidea.art/print',
              },

            ],
          },
          {
            'title': '原型->网站',
            'icon': 'sidebar-window',
            'children': [
              {
                'title': 'framer AI',
                'windowName': 'https://framer.com/projects/folder/recent?team=96fcdc88-3bec-3eac-b200-10e94d00f08a',
              },

            ],
          }
        ],
      },
      {
        'title': '资源整合',
        'icon': 'sidebar-default',
        'children': [
          {
            'title': '实用工具',
            'icon': 'sidebar-default',
            'children': [
              {
                'title': '提示词收集',
                'icon': 'sidebar-default',
                'windowName': 'https://www.aishort.top/'
              },
              {
                'title': '聊天记录转PDF',
                'icon': 'sidebar-default',
                'windowName': 'https://www.chatpdf.com/'
              },
              {
                'title': 'PDF转markdown',
                'icon': 'sidebar-default',
                'windowName': 'https://pdf2md.morethan.io/'
              }
            ],
          },
          {
            'title': '资源搜索',
            'icon': 'sidebar-default',
            'children': [
              {
                'title': '奈斯搜索(阿里网盘)',
                'icon': 'sidebar-default',
                'windowName': 'https://www.niceso.net/'

              },
              {
                'title': '易搜(多网盘)',
                'icon': 'sidebar-default',
                'windowName': 'https://yiso.fun/'

              },
              {
                'title': '云盘资源网',
                'icon': 'sidebar-default',
                'windowName': 'https://www.yunpanziyuan.xyz/'

              },
              {
                'title': '电子书?',
                'icon': 'sidebar-default',
                'windowName': 'https://filepursuit.com/'

              },
              {
                'title': '编程视频?',
                'icon': 'sidebar-default',
                'windowName': 'https://tech.ziyuan.iters.cn/'

              },
              {
                'title': '软件1',
                'icon': 'sidebar-default',
                'windowName': 'https://www.qijishow.com/down/index.html'
              },
            ]
          }
        ],

      }
    ]
  };
  res.send(menu);
})
//post  接受传入的html,存入数据库
app.post('/postMessage', async (req, res) => {
    
  await prisma.messages.create({
    data:{
      html:req.body
    }
  })
  res.send({ data: 'ok', status: 1, "error": "", });
})
app.get('/getMessages', async (req, res) => {
  
  const messages = await prisma.messages.findMany()
  res.send({ data: messages, status: 1, "error": "", });
})
app.delete('/deleteMessage', async (req, res) => {
  const {id} = req.query
  
  await prisma.messages.delete({
    where:{
      id:Number(id)
    }
  })
  res.send({ data: 'ok', status: 1, "error": "", });
})
// 监听指定端口，启动服务器
app.listen(3300, () => {
  console.log('服务器已启动，监听端口3300')
})
