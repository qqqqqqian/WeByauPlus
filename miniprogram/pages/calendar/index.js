// miniprogram/pages/calendar/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgArray:[],
    index:0
  },
  onpickerChange(e){
    this.setData({
      index:e.detail.value
    })
    
  },
  onpreviewBigImage(){
    let urlsarray = [this.data.imgArray[this.data.index].imgsrc]
    console.log(urlsarray);
    wx.previewImage({
      current: this.data.imgArray[this.data.index].imgsrc,
      urls: urlsarray
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database();
    const calendarCollection = db.collection('calendar');
    calendarCollection.get().then(res=>{
      this.setData({
        imgArray: res.data
      })

    })
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