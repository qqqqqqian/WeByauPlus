// 云函数入口文件
const cloud = require('wx-server-sdk'),
  request = require('request');
cloud.init()

// 云函数入口函数
exports.main = ({cookie}) => {
  return new Promise((resolve, reject) => {
    request({
      url: 'http://light.byau.edu.cn/_web/_customizes/bynk/lightapp/schedule/termAndWeek/inquirySchoolWeeks_3.rst',
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 5.1.1; mi pad Build/LMY49I) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/39.0.0.0 Safari/537.36',
        Connection: 'Keep-Alive',
        Cookie: cookie,
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    }, (error, response, body) => {
      if (error) {
        reject({
          error,
          code: 1009
        });
        return;
      }
      resolve(body);
    })
  }).then(res=>res)
  .catch(err=>err)
}