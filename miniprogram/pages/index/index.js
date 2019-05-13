import {Classic} from '../../models/classic.js'
const classic = new Classic()

let getTodaySchedule = function(){
  function setTodayShedule(shedule,nowWeeks){
    let todaySchdule = [];
    if (shedule) {
      shedule.forEach((item, index) => {
        if (Number(item.zj) === nowWeeks.day) {
          let findIndex =  todaySchdule.findIndex((todaySchduleItem)=>{
            if (todaySchduleItem.section === jc[item.jc]){
              return true;
            }
          })
          if (findIndex === -1){
          todaySchdule.push({
            courseName: item.kcmc,
            section: jc[item.jc],
            classroom: item.jsdd
          });
         }
        }
      })

      if (JSON.stringify(todaySchdule) === '[]') {
        if (this.data.isBind) {
          this.setData({
            isClass: false,
            todaySchdule: ""
          })
        }
      } else {
        console.log(todaySchdule);
        todaySchdule.sort((a,b)=>{
          return a.section.split("-")[0] - b.section.split("-")[0]
        })
        this.setData({
          todaySchdule
        })
      }
    }
  }
  function getNowweeks(){
    let _weeks = this.data.weeks.result.data.weeks;
    console.log(_weeks);
    let date = new Date();
    let Month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
      dateOfMonth = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
      nowTime = date.getFullYear() + "-" + Month + "-" + dateOfMonth;
    console.log(Month, dateOfMonth, nowTime);
    this.setData({
      date: Month + "/" + dateOfMonth
    })
    let nowWeeks = _weeks.find(function (item) {
      for (let i = 0; i < item.days.length; i++) {
        if (item.days[i] === nowTime) {
          item.day = i + 1;
          return 1;
        }
      }
    });
    return nowWeeks;
  }
  function getSchedules(nowWeek, nowWeeks) {
    let StorageShedule = wx.getStorageSync('oShedule')[nowWeek];
    if (StorageShedule) {
      if (StorageShedule.resultCode === 2) {
        if (this.data.isBind){
          this.setData({
            isClass: false,
            todaySchdule:""
          })
        }
      } else {
        if (this.data.isBind) {
          this.setData({
            isValid: true
          })
        }
        setTodayShedule.call(this,StorageShedule.result.data, nowWeeks);
      }
    } else {
      wx.cloud.callFunction({
        name: 'getSchedule',
        data: {
          cookie: wx.getStorageSync('JSESSIONID'),
          week: nowWeek
        }
      }).then(res => {
        let result = JSON.parse(res.result);
        console.log(result);
        if (!result.errorMsg || result.resultCode === 2) {
          let oShedule = wx.getStorageSync('oShedule')
          if (oShedule) {
            oShedule[nowWeek] = result
            wx.setStorageSync('oShedule', oShedule);
            if (oShedule[nowWeek].resultCode === 2) {
              if (this.data.isBind) {
                this.setData({
                  isClass: false,
                  todaySchdule: ""
                })
              }
              return;
            }
            if (this.data.isBind) {
              this.setData({
                isValid: true
              })
            }
            setTodayShedule.call(this, oShedule[nowWeek].result.data, nowWeeks);
          } else {
            let oShedule = [];
            oShedule[nowWeek] = result;
            console.log(oShedule);
            wx.setStorageSync('oShedule', oShedule);
            if (this.data.isBind) {
              this.setData({
                isValid: true
              })
            }
            setTodayShedule.call(this, oShedule[nowWeek].result.data, nowWeeks);
          }
        }
        else {
          if (this.data.isBind) {
            this.setData({
              isValid: false
            })
          }
        }
      })
    }
  }
  let jc = {
    1:"1-2(8:00~9:35)",
    3:"3-4(10:05~11:40)",
    5:"5-6(13:30~15:05)",
    7:"7-8(15:35~17:10)",
    9:"9-10(18:30~20:05)",
  }
  if (wx.getStorageSync('JSESSIONID')) {
    this.setData({
      isBind:true
    })
    let StorageWeeks = wx.getStorageSync('weeks');
    if (StorageWeeks && StorageWeeks.result) {
      this.setData({
        weeks: StorageWeeks
      })
      let nowWeeks = getNowweeks.call(this);
      let shedule = getSchedules.call(this, nowWeeks.week, nowWeeks)
    } else {
      wx.cloud.callFunction({
        name: 'getWEEKS',
        data: {
          cookie: wx.getStorageSync('JSESSIONID')
        }
      }).then(res => {
        let oRes = JSON.parse(res.result);
        if (!oRes.errorMsg) {
          console.log(res)
          wx.setStorageSync('weeks', oRes);
          this.setData({
            weeks: wx.getStorageSync('weeks')
          })
          let nowWeeks = getNowweeks.call(this);
          console.log(nowWeeks);
          getSchedules.call(this, nowWeeks.week, nowWeeks)

        }
      })
    }
  } else {
    this.setData({
      isBind: false,
      todaySchdule:""
    })
  }
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isBind:false,
    isClass:true,
    isValid:true
  },
  oncalendarTap(){
    wx.navigateTo({
      url: '../calendar/index',
    }) 
  },
  onclassScheduleTap:function(event){
    if (wx.getStorageSync('JSESSIONID')){
    wx.navigateTo({
      url: '../classSchedule/index',
    }) 
  }else{
    wx.showToast({
      title: '请先绑定学号',
      icon:'none',
      duration:2000,
      success(){
        wx.navigateTo({
          url: '../edubind/index',
        }) 
      }
    })
  }},
  onscoreTap:function(){
    if (wx.getStorageSync('JSESSIONID')) {
      wx.navigateTo({
        url: '../score/index',
      })
    } else {
      wx.showToast({
        title: '请先绑定学号',
        icon: 'none',
        duration: 2000,
        success() {
          wx.navigateTo({
            url: '../edubind/index',
          })
        }
      })
    }
  },
  onnavagationtoBind(){
    wx.navigateTo({
      url: '../edubind/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let date = new Date();
    const db = wx.cloud.database();
    const ones = db.collection('one');
 
    ones.doc('XKwG08DR1TiNUtxZ').get({
      success:(res)=>{
        console.log(res.data.img_url, res.data.word, res.data.word_info);
        this.setData({
          daily: {
            imgurl: res.data.img_url,
            content: res.data.word,
            author: res.data.word_info,
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            dayofmonth: date.getDate()
          }
        })
      }
    })
    
    //回调函数版本
    // classic.getDailySentence((res)=>{
    //   this.setData({
    //     dailySentence:res
    //   })
    // }
    // )
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
    this.setData({
      isClass:true
    })
    getTodaySchedule.call(this);
   
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