// components/scoreCard/index.js
let termsArray = [];

function setScores(schoolYear, term) {
  let calScore = function(array){
    console.log(array);
    let totalCredit = array.reduce((accumulator,currentValue)=>{
      return accumulator + currentValue.xf
    },0)
    let averageScore = (array.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.cj
    }, 0) / array.length).toFixed(2);

   return {
     totalCredit,
     averageScore
   }

  }
  wx.showLoading({
    title: '加载中',
  })
  let StorageShedule = wx.getStorageSync('oScore')[schoolYear + term];
  if (StorageShedule) {
    if (StorageShedule.resultCode === 1) {
      wx.showToast({
        title: '查无数据',
        icon: 'none',
        duration: 2000
      })
      this.setData({
        oScore: '',
        totalCredit: '',
        averageScore: '',
        score: ''
      })
    } else if(this.data.isFresh){
      wx.cloud.callFunction({
        name: 'getScore',
        data: {
          cookie: wx.getStorageSync('JSESSIONID'),
          schoolYear,
          term
        }
      }).then(res => {
        console.log(res);
        let result = JSON.parse(res.result);
        console.log(result);
        if (!result.errorMsg || result.resultCode === 1) {
          wx.hideLoading();
          let oScore = wx.getStorageSync('oScore')
          console.log(Boolean(oScore));
          if (oScore) {
            oScore[schoolYear + term] = result
            wx.setStorageSync('oScore', oScore);
            if (oScore[schoolYear + term].resultCode === 1) {
              wx.showToast({
                title: '查无数据',
                icon: 'none',
                duration: 2000
              })
              this.setData({
                oScore: '',
                totalCredit: '',
                averageScore: '',
                score:''
              })
              return;
            }

            let cal = calScore(oScore[schoolYear + term].result.data);
            this.setData({
              score: oScore[schoolYear + term].result.data,
              totalCredit: cal.totalCredit,
              averageScore: cal.averageScore,
              isFresh:false
            })
          } else {
            let oScore = {};
            oScore[schoolYear + term] = result;
            console.log(oScore);
            wx.setStorageSync('oScore', oScore);
            let cal = calScore(oScore[schoolYear + term].result.data);
            this.setData({
              score: oScore[schoolYear + term].result.data,
              totalCredit: cal.totalCredit,
              averageScore: cal.averageScore,
              isFresh: false
            })
          }
        } else {
          wx.showToast({
            title: '身份过期，请重新登录',
            icon: 'none',
            duration: 2000
          })
          
        }
      })
    }
    else{
      wx.hideLoading();
      let cal = calScore(StorageShedule.result.data);
      this.setData({
        score: StorageShedule.result.data,
        totalCredit: cal.totalCredit,
        averageScore:cal.averageScore
      })
    }
  } else {
    wx.cloud.callFunction({
      name: 'getScore',
      data: {
        cookie: wx.getStorageSync('JSESSIONID'),
        schoolYear,
        term
      }
    }).then(res => {
      console.log(res);
      let result = JSON.parse(res.result);
      console.log(result);
      if (!result.errorMsg || result.resultCode === 1) {
        wx.hideLoading();
        try{
        if(result.errorMsg.indexOf("未登录")>-1){
          wx.showToast({
            title: '身份过期，请重新绑定',
            icon: 'none',
            duration: 2000
          })
          this.setData({
            oScore: '',
            totalCredit: '',
            averageScore: ''
          })
          return;
        }}
        catch(e){
          
        }
        let oScore = wx.getStorageSync('oScore')
        console.log(Boolean(oScore));
        if (oScore) {
          oScore[schoolYear+term] = result
          wx.setStorageSync('oScore', oScore);
          if (oScore[schoolYear + term].resultCode === 1) {
            wx.showToast({
              title: '查无数据',
              icon: 'none',
              duration: 2000
            })
            this.setData({
              oScore: '',
              totalCredit: '',
              averageScore: ''
            })
            return;
          }
          
          let cal = calScore(oScore[schoolYear + term].result.data);
          this.setData({
            score: oScore[schoolYear + term].result.data,
            totalCredit: cal.totalCredit,
            averageScore: cal.averageScore
          })
        } else {
          let oScore = {};
          oScore[schoolYear + term] = result;
          console.log(oScore);
          wx.setStorageSync('oScore', oScore);
          let cal = calScore(oScore[schoolYear + term].result.data);
          this.setData({
            score: oScore[schoolYear + term].result.data,
            totalCredit: cal.totalCredit,
            averageScore: cal.averageScore
          })
        }
      } else {
        wx.showToast({
          title: '身份过期，请重新登录',
          icon: 'none',
          duration: 2000
        })
      }
    })
  }
}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    terms: {
      type: Object,
      value: null,
      observer({
        result
      }) {
        termsArray = result.data;
        console.log(termsArray);
        let pickerArray = [];
        termsArray.forEach((item) => {
          pickerArray.push(item.xn + item.xq);
        })
        this.setData({
          pickerArray
        })
        setScores.call(this, termsArray[0].xn, termsArray[0].xq);
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    pickerIndex: 0,
    score: '',
    isFresh:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onbindchange(e) {
      this.setData({
        pickerIndex: e.detail.value
      })
      let termsArray = this.properties.terms.result.data
      setScores.call(this, termsArray[e.detail.value].xn, termsArray[e.detail.value].xq);
    },
    onrefresh(e){
      this.setData({
        isFresh:true
      })
      let termsArray = this.properties.terms.result.data
      setScores.call(this, termsArray[this.data.pickerIndex].xn, termsArray[this.data.pickerIndex].xq);
    }
  }
})