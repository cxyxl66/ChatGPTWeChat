// app.js
App({
  globalData:{  
    userId: '',
    role: null
  },

  gBaseUrl:"http://192.168.0.116:8085/",
  wsUrl:"ws://192.168.0.116:8085/",
  towxml:require('/towxml/index'),
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  globalData: {
    userInfo: null
  }
})
