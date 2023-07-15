const { login } = require("../../utils/util");

const app = getApp();
var inputVal = '';
var msgList = [];
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;

let lineCount = Math.floor(windowWidth / 16) - 6;
let curAnsCount = 0;
/**
 * 初始化数据
 */

Page({
  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: '100vh',
    inputBottom: 0,
    lastId: 1,
    userId: '',
    socketOpen: false,
    integral: 0,
    role: {
        "image":"../../images/chat/AI1.jpeg",
        "title":"智能聊天助手",
        "description":"智能助手，可以回答一切问题",
        "chat":"我是智能助手，请问您有什么需要帮助的吗？",
        "roleId":1000
    },
    msgMap: {}
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onload")
    if (app.globalData.userId) {
      login();
    }
  },
  initData() {
    inputVal = '';
    let md = app.towxml(this.data.role.chat, 'markdown', {
      theme: 'light'
    })
    msgList = [{
      role: 'assistant',
      content: this.data.role.chat,
      md: md
    }, ]
    this.setData({
      msgList,
      inputVal,
      lastId: 1
    })
  },
  sendSocketMessage: function(msg) {
    if (this.data.socketOpen) {
      wx.sendSocketMessage({
        data: msg
      })
    } else {
      console.log("close")
    }
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onshow")
    this.subIntegral(0);
    if (app.globalData.role) {
      this.setData({
        role:app.globalData.role
      })
    }
    const dialog = wx.getStorageSync('dialog_' + this.data.role.roleId)
    if (dialog) {
      this.setData({
        msgList: dialog
      })
    } else {
      this.initData();
    }
    
    wx.showNavigationBarLoading()
    wx.setNavigationBarTitle({
      title: this.data.role.title
    })
    // this.initData();
    wx.connectSocket({
      url: app.wsUrl+ 'chatWebSocketForWeb/' + app.globalData.userId,
      success:function() {
        console.log("websocket 连接成功")
      },
      fail: function() {
        console.log("websocket 连接失败")
      }
    })

    wx.onSocketOpen((res) => {
      wx.hideNavigationBarLoading()
      this.setData({
        socketOpen: true
      })
      wx.showToast({
        icon: 'none',
        title: '会话建立成功',
        duration: 500
      })
      let text = '';
      wx.onSocketMessage((result) => { 
        if (result.data == "[DONE]") {
          msgList[msgList.length - 1].md = app.towxml(msgList[msgList.length - 1].content , 'markdown', {
            theme: 'light'
          })
          this.setData({
            msgList
          })
          return;
        }
        let json_data = JSON.parse(result.data)
        if (json_data.content == null || json_data.content == 'null') {
          return;
        }
        text = json_data.content;
        curAnsCount++;
        if (curAnsCount % lineCount == 0) {
          wx.createSelectorQuery().select('#chatPage').boundingClientRect(function (rect) {
            // 使页面滚动到底部
            wx.pageScrollTo({
              scrollTop: rect.bottom
            })
          }).exec()
        }
        let content = msgList[msgList.length - 1].content + text;
        msgList[msgList.length - 1].content = content;
        this.setData({
          msgList
        })
      })
    })
  },
  onHide: function () {
    console.log("onHide")
    wx.closeSocket()
    this.setData({
      socketOpen: false
    })
    wx.setStorageSync('dialog_' + this.data.role.roleId, this.data.msgList)
    wx.onSocketClose((result) => {
      console.log("socket关闭成功");
      wx.showToast({
        icon: 'none',
        title: '会话关闭成功',
        duration: 500
      })
    })
  },
  clearTex: function() {
    this.initData();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 获取聚焦
   */
  focus: function (e) {
    console.log("focus")
    let res = wx.getSystemInfoSync()
    let navBarHeight = res.statusBarHeight + 20 //顶部状态栏+顶部导航，大部分机型默认44px
    keyHeight = (e.detail.height - navBarHeight);
    if (keyHeight < 0) {
      keyHeight = 0
    }
    this.setData({
      scrollHeight: (windowHeight - keyHeight) + 'px'
    });
    this.setData({
      lastId: msgList.length,
      toView: 'msg-' + (msgList.length),
      inputBottom: (keyHeight) + 'px'
    })
  },

  //失去聚焦(软键盘消失)
  blur: function (e) {
    this.setData({
      scrollHeight: '100vh',
      inputBottom: 0
    })
    this.setData({
      toView: 'msg-' + (msgList.length)
    })

  },

  subIntegral(i) {
    wx.request({
      url: app.gBaseUrl + 'integral/sub',
      data: {
        userId: app.globalData.userId,
        integral: i
      },
      success:(result) => {
        if (result.data.code === 200) {
          this.setData({
            integral: result.data.data
          })
        } 
      }
    })
  },

  /**
   * 发送点击监听
   */
  sendClick: function (e) {
    if (this.data.integral < 1) {
      wx.showModal({  
        title: '提示',  
        content: '您的积分不足，请先获取积分', 
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/integral/integral',
            })
          }
        }
      });
      return;
    }
    this.subIntegral(1);
    let md = app.towxml(e.detail.value.textarea, 'markdown', {
      theme: 'light'
    })
    msgList.push({
      role: 'user',
      content: e.detail.value.textarea,
      md: md
    })
    if (msgList.length > 10) {
      let md = app.towxml(this.data.role.chat, 'markdown', {
        theme: 'light'
      })
      var currentList = [{
        role: 'assistant',
        content: this.data.role.chat,
        md: md
      }, ];
      var list = currentList.concat(msgList.slice(-9))
      let newArr = list.map((item) => {
        let obj = {
            role: item.role,
            content: item.content
        }
        return obj
      })
      this.sendSocketMessage(JSON.stringify(newArr))
    } else {
      let newArr = msgList.map((item) => {
        let obj = {
            role: item.role,
            content: item.content
        }
        return obj
      })
      this.sendSocketMessage(JSON.stringify(newArr))
    }
    
    msgList.push({
      role: 'assistant',
      content: '',
      md: ''
    })
    inputVal = '';
    this.setData({
      msgList,
      inputVal
    });
  },

  /**
   * 退回上一页
   */
  toBackClick: function () {
    wx.navigateBack({})
  },

  copyText:function(e) {
    let text = e.currentTarget.dataset.copy;
    console.log(text)
    wx.setClipboardData({
      data: text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  }

})