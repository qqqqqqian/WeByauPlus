// miniprogram/pages/edubind/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onsubmit(event){
    wx.showLoading({
      title: '绑定中',
    })
    wx.cloud.callFunction({
      name:'getJSESSIONID',
      data:{
        uname:event.detail.username,
        password: event.detail.password,
      }
    }).then((res)=>{
      wx.hideLoading();
        if(res.result){
          if(res.result.JSESSIONID){
            try {
              wx.setStorageSync('JSESSIONID', res.result.JSESSIONID)
              wx.setStorageSync('eduUser', {
                username: event.detail.username,
                password: event.detail.password
              })
              try {
                const value = wx.getStorageSync('JSESSIONID')
                const value1 = wx.getStorageSync('eduUser')
                if (value) {
                  // Do something with return value
                  console.log(value[0],value1);
                }
              } catch (e) {
                // Do something when catch error
              }
              wx.showToast({
                title: '绑定成功',
                icon: 'success',
                duration: 2000,
                complete: ()=>{
                  let pages = getCurrentPages();
                  let prevPage = pages[pages.length-2];
                  prevPage.setData({
                    isBind: wx.getStorageSync('eduUser') ? true : false
                  })
                  wx.navigateBack({
                    delta:1
                  });
                }
              })
            } catch (e) { }
            return;
          }
          wx.showToast({
            title: res.result.errmessage,
            icon: 'none',
            duration: 2000
          })
        }else{
          wx.showToast({
            title: '绑定失败',
            icon: 'none',
            duration: 2000
          })
        }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})