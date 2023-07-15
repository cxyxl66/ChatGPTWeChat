
const app = getApp()
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

function login() {
  console.log("login")
  wx.login({
    success(res) {
      console.log(res)
      if (res.code) {
        wx.request({
          url: app.gBaseUrl + 'wx_login',
          data: {
            code: res.code
          },
          success:(result) => {
            if (result.data.code === 200) {
              console.log(result.data.data)
              app.globalData.userId = result.data.data;
            }
          }
        })
        
      }
    }
  })
}

module.exports = {
  formatTime,
  login
}
