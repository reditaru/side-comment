# side-comment
仿[https://github.com/aroc/side-comments](https://github.com/aroc/side-comments "https://github.com/aroc/side-comments")的[medium.com](Medium.com)风格的侧边栏评论
并做了一些拓展与改动：  
## New Fetures
- [x] 删除“删除”功能，增加多级评论
- [x] 丰富评论信息
- [x] 利用Markdown Paser处理段落成p元素的方法，来设置批注行

## Doc
### Dependency
- `Jquery`
### 初始化
- `var sideComment = new SideComment(element,currentUser,postId,comments)`
### 格式要求

#### currentUser
```
	{
            "id": 1,
            "name":"reditaru",
            "avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/d_kobelyatsky/128.jpg"
    }
```
#### comments
```
[
  {
    "id": 1,
    "body": "some comment",
    "postId": 1,
    "section": 1,
    "userId": 1,
    "date": "Fri Feb 02 2018 04:35:39 GMT+0800 (中国标准时间)",
    "parent": "null",
    "user": {
      "id": 1,
      "name": "reditaru",
      "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/d_kobelyatsky/128.jpg"
    }
  },
  {
    "id": 2,
    "body": "other comment",
    "postId": 1,
    "section": 1,
    "userId": 2,
    "date": "Fri Feb 02 2018 01:33:49 GMT+0800 (中国标准时间)",
    "parent": "null",
    "user": {
      "id": 2,
      "name": "steins",
      "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/d_kobelyatsky/128.jpg"
    }
  },
  {
    "id": 3,
    "body": "simple comment",
    "postId": 1,
    "section": 2,
    "userId": 3,
    "date": "Thu Feb 01 2018 18:42:06 GMT+0800 (中国标准时间)",
    "parent": "null",
    "user": {
      "id": 3,
      "name": "kurisu",
      "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/d_kobelyatsky/128.jpg"
    }
  },
  {
    "id": 4,
    "body": "reply comment",
    "postId": 1,
    "section": 1,
    "userId": 1,
    "date": "Fri Feb 02 2018 06:59:44 GMT+0800 (中国标准时间)",
    "parent": 2,
    "user": {
      "id": 1,
      "name": "reditaru",
      "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/d_kobelyatsky/128.jpg"
    }
  }
]
```
### 监听事件
#### notLogin
未传入currentUser且进行评论/回复操作时触发  
#### postComment
用户输入评论信息并评论后触发  
回调参数：评论信息  
Example:
```
{
	body:"123",
	parent:"null",
	postId:1,
	section:"0"
}
```
### 方法
#### insertComment(comment)
通过监听postComment与服务器交互后返回新增的评论信息后调用此方法
格式参见 comments 中的任意一项
### 注意事项
初始化时传入的元素的内容应为markdown parse后的结果
## To Run
- `git clone https://github.com/reditaru/side-comment`
- `cd path/to/clone`
- `npm install json-server -g`
- `json-server --watch db.json`
- `open index.html`
