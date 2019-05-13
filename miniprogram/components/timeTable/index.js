// components/TimeTable/index.js
function setSchedules(nowWeek){
  wx.showLoading({
    title: '加载中',
  })
  let setCourseColor = (SShedule) => {
    let colorArr = [];
    let getColor = () => {
      let obj = {};
      obj.r = Math.floor(Math.random() * (255 - 100) + 100);
      obj.g = Math.floor(Math.random() * (255 - 100) + 100);
      obj.b = Math.floor(Math.random() * (255 - 100) + 100);
      obj.color = 'rgba(' + obj.r + ',' + obj.g + ',' + obj.b + ',1)';
      return obj.color;
    }
    for (let i = 0; i < SShedule.result.data.length; i++) {
      let flag = false;
      for (let j = 0; j < colorArr.length; j++) {
        if (colorArr[j].courseId === SShedule.result.data[i].kcid) {
          SShedule.result.data[i].bgColor = colorArr[j].bgColor;
          flag = true;
          break;
        }
      }
      if (!flag) {
        let randomColor = getColor();
        colorArr.push({
          bgColor: randomColor,
          courseId: SShedule.result.data[i].kcid
        })
        SShedule.result.data[i].bgColor = randomColor;

      }
    }
  }
  let StorageShedule = wx.getStorageSync('oShedule')[nowWeek];
if (StorageShedule) {
  if (StorageShedule.resultCode===2){
    wx.showToast({
      title: '这周没课哦~',
      icon: 'none',
      duration: 2000
    })
    this.setData({
      shedule: ''
    })
  }else{
  setCourseColor(StorageShedule);
  wx.hideLoading();
  this.setData({
    shedule: StorageShedule.result.data
  })}
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
      wx.hideLoading();
      let oShedule = wx.getStorageSync('oShedule')
      if (oShedule) {
        oShedule[nowWeek] = result
        wx.setStorageSync('oShedule', oShedule);
        if (oShedule[nowWeek].resultCode===2){
          wx.showToast({
            title: '这周没课哦~',
            icon: 'none',
            duration: 2000
          })
          this.setData({
            shedule: ''
          })
          return;
        }
        setCourseColor(oShedule[nowWeek]);
        this.setData({
          shedule: oShedule[nowWeek].result.data
        })
      } else {
        let oShedule = [];
        oShedule[nowWeek] = result;
        console.log(oShedule);
        wx.setStorageSync('oShedule', oShedule);
        setCourseColor(oShedule[nowWeek]);
        this.setData({
          shedule: oShedule[nowWeek].result.data
        })
      }
    } 
    else{
      wx.showToast({
        title: '身份过期，请重新登录',
        icon: 'none',
        duration: 2000
      })
    }
  })
}
}
function changeWeeks(nowWeeks){
    let formatWeeks = [];
    let Weeks = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    nowWeeks.days.forEach((item, index) => {
      formatWeeks[index] = {
        day: Weeks[index],
        date: item.slice(-5).replace('-', '/')
      }
    })
    this.setData({
      week: nowWeeks.week,
      formatWeeks,
      month: formatWeeks[0].date.slice(1, 2)
    })
}
function getNowWeeks(){
  let _weeks = this.data.dataWeeks;
  let date = new Date();
  let Month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
    dateOfMonth = date.getDate()< 10 ? '0' + date.getDate() : date.getDate(),
    nowTime = date.getFullYear() + "-" + Month + "-" + dateOfMonth;
  console.log(dateOfMonth);
    this.setData({
      date: Month + "/" + dateOfMonth
    })
  let nowWeeks = _weeks.find(function (item) {
    for (let i = 0; i < item.days.length; i++) {
      if (item.days[i] === nowTime) {
        return 1;
      }
    }
  });
  return nowWeeks;
}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    weeks: { // 属性名
      type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: null, // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer({
        result
      }) {
        let weeks = result.data.weeks
        this.setData({
          dataWeeks: weeks
        })
        let _weeks = this.data.dataWeeks;
        let pickerWeeks = _weeks.map((item)=>{
          return '第'+item.week+'周';
        })
        this.setData({
          pickerWeeks
        })
        let nowWeeks = getNowWeeks.call(this);
        changeWeeks.call(this,nowWeeks);
        setSchedules.call(this,nowWeeks.week);
        this.setData({
          toView: "week" + nowWeeks.week
        })
      }
    },


  }

  ,
  /**
   * 组件的初始数据
   */
  data: {
    flag: false,
    week: 1,
    dataWeeks: [],
    days: [],
    section : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    month:0,
    toView:"week1"
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onweekTap() {
      this.setData({
        flag: !this.data.flag
      })
    },
    bindPickerChange(e){
      let selectedWeek = Number(e.detail.value)+1;
      this.setData({
        week:selectedWeek
      })
      let _weeks = this.data.dataWeeks;
      changeWeeks.call(this, _weeks[selectedWeek-1]);
      setSchedules.call(this, selectedWeek);
    },
    weekChange(e){
      this.setData({
        week: e.target.dataset.index+1
      })
      let _weeks = this.data.dataWeeks;
      changeWeeks.call(this, _weeks[e.target.dataset.index ]);
      setSchedules.call(this, e.target.dataset.index + 1);
    }
  }
})