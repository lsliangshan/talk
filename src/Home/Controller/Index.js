/**
 * Controller
 * @return
 */
let jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const http = require('http');
const cheerio = require('cheerio');
const request = require('request');
const rp = require('request-promise')
let i = 0;
let url = 'http://mp3.sogou.com';

// (function(window){
//   window.htmlentities = {
//     /**
//      * Converts a string to its html characters completely.
//      *
//      * @param {String} str String with unescaped HTML characters
//      **/
//     encode : function(str) {
//       var buf = [];
//
//       for (var i=str.length-1;i>=0;i--) {
//         buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
//       }
//
//       return buf.join('');
//     },
//     /**
//      * Converts an html characterSet into its original character.
//      *
//      * @param {String} str htmlSet entities
//      **/
//     decode : function(str) {
//       return str.replace(/&#(\d+);/g, function(match, dec) {
//         return String.fromCharCode(dec);
//       });
//     }
//   };
// })(window);

export default class extends THINK.Controller {
  //构造方法
  init (http) {
    //调用父类构造方法
    super.init(http);
    this.UserModel = THINK.model('Home/User', {});
  }

  //所有该控制器(含子类)方法前置方法
  __before () {
    console.log('__before');
  }

  //URI定位到该控制器,如果该控制器不存在某个方法时自动调用
  __empty () {
    return this.json('can\'t find action');
  }

  //indexAction前置方法
  _before_index () {
    console.log('_before_index');
  }

  //控制器默认方法
  indexAction () {
    return this.display()
  }

  getipAction () {
    return this.json({
      ip: this.http.req.connection.remoteAddress.split(':')[3]
    })
  }

  async fetchPageAction () {
    const that = this;
    let html = '';

    function autoParse(body, response, resolveWithFullResponse) {
      // FIXME: The content type string could contain additional values like the charset.
      // Consider using the `content-type` library for a robust comparison.
      console.log('>>>>>', response.headers['content-type'])
      if (response.headers['content-type'] === 'application/json') {
        return JSON.parse(body);
      } else if (response.headers['content-type'] === 'text/html') {
        return cheerio.load(body);
      } else {
        return body;
      }
    }

    let _sel = '.bang_02';
    let options = {
      uri: url,
      transform: autoParse
    }

    await rp(options).then(function (autoParsedBody) {
      html = autoParsedBody;
      html = html.match(new RegExp('http.*?\.m4a', 'g'))
    }).catch(function (err) {
      console.log('ERROR: ', err)
    })

    return this.json(html)
  }

  // 登录
  async loginAction () {
    if (this.isPost()) {
      let phonenum = this.post('phonenum')
      let password = this.post('password')
      let userInfo = await this.UserModel.where({phonenum, phonenum, password: THINK.md5(password)}).find();
      userInfo.hasOwnProperty('password') && (delete userInfo.password)
      if (THINK.isEmpty(userInfo)) {
        return this.error('手机号或密码输入有误')
      } else {
        this.header('app-token', jwt.sign({
          phonenum: phonenum,
          nickname: userInfo.nickname
        }, 'shhhhh'))
        return this.success('登录成功', userInfo)
      }
    } else {
      return this.error('请求姿势不正确~');
    }
  }
}