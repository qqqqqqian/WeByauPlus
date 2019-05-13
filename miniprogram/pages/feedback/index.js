// miniprogram/pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  bindformsubmit(e){
    if (e.detail.value.contact && e.detail.value.description && e.detail.value.title){
      const db = wx.cloud.database();
      const feedbackCollection = db.collection('feedback');
     feedbackCollection.where({
        desciption: e.detail.value.description
      }).get().then(res=>{
        if(!res.data.length){
          feedbackCollection.add({
            // data 字段表示需新增的 JSON 数据
            data: {
              title: e.detail.value.title,
              desciption: e.detail.value.description,
              contact: e.detail.value.contact,
              due: new Date(),
            }
          })
            .then(res => {
              if (res.errMsg.indexOf('ok') > -1) {
                wx.showToast({
                  title: '感谢反馈',
                  icon: 'success',
                  duration: 2000
                })
              } else {
                wx.showToast({
                  title: '提交失败',
                  icon: 'none',
                  duration: 2000
                })
              }
            })
            .catch((e) => {
              wx.showToast({
                title: '提交失败',
                icon: 'none',
                duration: 2000
              })
            })
        }else{
          wx.showToast({
            title: '您提交的内容已经在我们的计划中了哦~',
            icon: 'none',
            duration: 2000
          })
        }
      })

      
    }else{
      wx.showToast({
        title: '提交信息不完整~',
        icon:'none',
        duration:2000
      })
    }
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