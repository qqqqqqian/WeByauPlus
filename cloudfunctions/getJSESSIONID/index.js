// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request'),
  querystring = require('querystring');
cloud.init()
// 云函数入口函数
exports.main = ({uname, password}) => {
  const str = 'password=' + password + '&code=2&apnsKey=100d855909026944d25' +
    '&appName=teacher&name=MI+9' +
    '&miApnsKey=gVNKXaW6%2FXrEqiUJJvgZGBVCOmms%2F0FTaTKJamiAwHxMLmIhSCLX3qbopb2y0ZyA' +
    '&deviceName=MI+9' +
    '&serialNo=0865166027752670&username=' + uname;
  const form = querystring.parse(str);
  const proxy = '';
  let midsSessIdA = null,
    serialNo = null,
    Appstore1 = null,
    casCookie = null,
    ssoCookie = null,
    username = null,
    jData = null;
  const option = {
    url: 'http://mids.byau.edu.cn/_ids_mobile/login18_9',
    method: 'POST',
    form: form,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 5.1.1; mi pad Build/LMY49I) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/39.0.0.0 Safari/537.36',
      'Content-Type': 'application/x-www-form-urlencoded',
      Connection: 'Keep-Alive'
    },
    proxy: proxy
  };
  const login18_9 = (options) => {
    return new Promise((resolve, reject) => {
      request(options, (error, response) => {
        if (error) {
          reject({
            error,
            code: 1001
          });
          return;
        }
        const errcode = response.headers.loginerrcode;
        if (typeof errcode === 'undefined') {
          const ssocookie = response.headers['ssocookie'];
          const midsSessId = response.headers['set-cookie'];
          const CASTGC = eval(ssocookie)[0];
          const JSESSIONID = eval(ssocookie)[1];
          ssoCookie = {
            CASTGC: CASTGC,
            JSESSIONID: JSESSIONID
          };
          resolve({ midsSessId: midsSessId[0], CASTGC: CASTGC, JSESSIONID: JSESSIONID });
          return;
        }
        else if (errcode === '20001') {
          reject({ errmessage: '密码错误，第一次登录请尝试身份证号后六位', code: 1001 });
          return;
        }
        else if (errcode === '20010') {
          reject({ errmessage: '首次登录app时，请登录apps.byau.edu.cn完善个人信息', code: 1001 });
          return;
        }
      });
    })
  };
  const loginedUser15 = (midsSessId) => {
    midsSessIdA = midsSessId;
    return new Promise((resolve, reject) => {
      request({
        url: 'http://mids.byau.edu.cn/_ids_mobile/loginedUser15',
        method: 'POST',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 5.1.1; mi pad Build/LMY49I) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/39.0.0.0 Safari/537.36',
          'Content-Type': 'application/x-www-form-urlencoded',
          Connection: 'Keep-Alive',
          Cookie: midsSessId,
          Cookie2: '$Version=1'

        },
        proxy: proxy
      }, (error, response, body) => {
        if (error) {
          reject({
            error,
            code: 1002
          });
          return;
        }
        if (response.statusCode === 200) {
          const sudy_sk = response.headers['set-cookie'];
          resolve({
            sudy_sk: sudy_sk[0],
            user_data: JSON.parse(body)
          });
        }
      })
    })
  };

  const saveUserMobile = (user_data) => {
    serialNo = user_data.user_data.data.device;
    username = user_data.user_data.data.username;
    username = encodeURI(username).replace(/%/g, '%25');
    return new Promise((resolve, reject) => {
      request({
        url: 'http://apps.byau.edu.cn/mobile/saveUserMobile.mo',
        method: 'POST',
        form: {
          mobileId: user_data.user_data.data.device,
          userId: user_data.user_data.data.userId
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 5.1.1; mi pad Build/LMY49I) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/39.0.0.0 Safari/537.36',
          'Content-Type': 'application/x-www-form-urlencoded',
          Connection: 'Keep-Alive'
        },
        proxy: proxy
      }, (error, response, body) => {
        if (error) {
          reject({
            error,
            code: 1003
          });
          return;
        }
        if (response.statusCode === 200) {
          const JSESSIONID = response.headers['set-cookie'];
          resolve({
            JSESSIONID: JSESSIONID[0],
            user_data: user_data.user_data
          });
        }
      })
    })
  };
  const openApp20 = (data) => {
    const saveUserMobileForm = 'ip=172.16.2.15&uxid=' + data.user_data.data.uxid + '&id=354' +
      '&userId=' + data.user_data.data.userId + '&device=' + data.user_data.data.device +
      '&group=' + data.user_data.data.groups + '&isSign=1';
    Appstore1 = data.JSESSIONID;
    return new Promise((resolve, reject) => {
      request({
        url: 'http://apps.byau.edu.cn/mobile/openApp20.mo',
        method: 'POST',
        form: saveUserMobileForm,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 5.1.1; mi pad Build/LMY49I) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/39.0.0.0 Safari/537.36',
          'Content-Type': 'application/x-www-form-urlencoded',
          Connection: 'Keep-Alive',
          Cookie: data.JSESSIONID,
          Cookie2: '$Version=1'
        },
        proxy: proxy
      }, (error, response) => {
        if (error) {
          reject({
            error,
            code: 1004
          });
          return;
        }
        if (response.statusCode === 302) {
          const Location = response.headers['location'];
          resolve({
            Location: Location
          });
        }
      })
    })
  };
  const loginCas = (data) => {
    const Cookie = 'CASTGC=' + ssoCookie.CASTGC.cookieValue + ';' +
      ' JSESSIONID=' + ssoCookie.JSESSIONID.cookieValue;
    casCookie = Cookie;
    return new Promise((resolve, reject) => {
      request({
        url: data.Location,
        method: 'GET',
        followRedirect: false,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 5.1.1; mi pad Build/LMY49I) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/39.0.0.0 Safari/537.36',
          Connection: 'Keep-Alive',
          Cookie: Cookie,
          Cookie2: '$Version=1'
        }

      }, (error, response) => {
        if (error) {
          reject({
            error,
            code: 1005
          });
          return;
        }
        if (response.statusCode === 302) {
          resolve({
            location: response.headers['location']
          });
        }


      })
    })
  };
  const getTicket = (data) => {
    return new Promise((resolve, reject) => {
      request({
        url: data.location,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 5.1.1; mi pad Build/LMY49I) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/39.0.0.0 Safari/537.36',
          Connection: 'Keep-Alive',
          Cookie: Appstore1,
          Cookie2: '$Version=1'
        },
        proxy: proxy
      }, (error, response, body) => {
        if (error) {
          reject({
            error,
            code: 1006
          });
          return;
        }
        if (response.statusCode === 200) {
          resolve({
            iportal: JSON.parse(body)
          });
        }
      })
    })
  };
  const loginCAS = ({
    iportal
  }) => {
    console.log(iportal);
    const url = 'https://ids.byau.edu.cn/cas/login?service=' +
      'http%3A%2F%2Flight.byau.edu.cn%2F_web%2F_lightapp%2Fschedule%2Fmobile%2Fstudent%2Findex.html%3Fiportal.signature%3D' +
      iportal.data['iportal.signature'] + '%26iportal.uname%3D' + username + '%26iportal.group%3D' + iportal.data['iportal.group'] + '%26iportal.timestamp%3D' +
      iportal.data['iportal.timestamp'] + '%26iportal.ip%3D' + iportal.data['iportal.ip'] + '%26iportal.nonce%3D' + iportal.data['iportal.nonce'] + '%26iportal.signature2%3D' +
      iportal.data['iportal.signature2'] + '%26iportal.uxid%3D' + iportal.data['iportal.uxid'] + '%26iportal.signature3%3D' +
      iportal.data['iportal.signature3'] + '%26iportal.device%3D' +
      iportal.data['iportal.device'] + '%26iportal.uid%3D' + iportal.data['iportal.uid'];
    console.log(url);
    console.log(casCookie);
    return new Promise((resolve, reject) =>
      request({
        url: url,
        method: 'GET',
        followRedirect: false,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 5.1.1; mi pad Build/LMY49I) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/39.0.0.0 Safari/537.36',
          Connection: 'Keep-Alive',
          Cookie: casCookie,
          Cookie2: '$Version=1'
        },

      }, (error, response) => {
        if (error) {
          reject({
            error,
            code: 1007
          });
          return;
        }
        if (response.statusCode) {
          const location = response.headers['location'];
          resolve({
            location: location
          });
        }

      })
    )
  };
  const getJSESSIONID = ({
    location
  }) => {
    const url = location;
    console.log(url);
    return new Promise((resolve, reject) =>
      request({
        url: url,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 5.1.1; mi pad Build/LMY49I) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/39.0.0.0 Safari/537.36'
        },
        proxy: proxy
      }, (error, response) => {
        if (error) {
          reject({
            error,
            code: 1008
          });
          return;
        }
        if (response.statusCode === 200) {
          console.log(response.headers);
          const JSESSIONID = response.headers['set-cookie'];
          jData = {
            JSESSIONID: JSESSIONID
          };
          resolve({
            JSESSIONID: JSESSIONID
          });
        }

      })
    )
  };
  return login18_9(option).then((res) => {
    console.log(1);
    console.log(res);
    return loginedUser15(res.midsSessId);
  }).then((res) => {
    console.log(2);
    console.log(res);
    return saveUserMobile(res);
  }).then((res) => {
    console.log(3);
    console.log(res);
    return openApp20(res);
  }).then((res) => {
    console.log(4);
    console.log(res);
    return loginCas(res);
  }).then((res) => {
    console.log(5);
    console.log(res);
    return getTicket(res);
  }).then((res) => {
    console.log(6);
    return loginCAS(res);
  }).then((res) => {
    console.log(7);
    return getJSESSIONID(res);
    }).then(res=>{
      return res;
    }).catch(err=>{
      return err
    });
}