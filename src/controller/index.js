/**
 * Controller
 * @return
 */
const fs = require('fs');
const path = require('path');
const http = require('http');
const cheerio = require('cheerio');
const request = require('request');
const rp = require('request-promise');
const ip = require('ip')
const tough = require('tough-cookie')

const decodeHtml = function decodeHtml (str) {
  return str.replace(/&#(x)?([^&]{1,5});?/g, function ($, $1, $2) {
    return String.fromCharCode(parseInt($2, $1 ? 16 : 10));
  })
}

const encryption = 'dei2com';
const jwt = require('jsonwebtoken');

function getAsCp () {
  var t = Math.floor((new Date).getTime() / 1e3),
    e = t.toString(16).toUpperCase(),
    n = think.md5(t).toString().toUpperCase();
  if (8 != e.length) return {
    as: "479BB4B7254C150",
    cp: "7E0AC8874BB0985"
  };
  for (var o = n.slice(0, 5), i = n.slice( - 5), a = "", r = 0; 5 > r; r++) a += o[r] + e[r];
  for (var l = "",
         s = 0; 5 > s; s++) l += e[s + 3] + i[s];
  return {
    as: "A1" + a + e.slice( - 3),
    cp: e.slice(0, 3) + l + "E1"
  }
}

export default class extends think.controller.base {
  //构造方法
  init (http) {
    //调用父类构造方法
    super.init(http);

    this.lettersModel = think.model('letters', {});
    this.userModel = think.model('user', {});

    this.ctx.header('Access-Control-Allow-Origin', '*');
    this.ctx.header('Access-Control-Allow-Credentials', true);
    this.ctx.header('Access-Control-Allow-Headers', 'Content-Type,Accept');
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
    return this.ok('success');
  }

  downloadAction () {
    console.log(path.resolve(__dirname, './'))
    return this.success('成功');
  }

  async fetchBuDeJieAction () {
    const page = this.get('page');
    let url = 'http://www.budejie.com/text/' + page;
    let html = '';
    function autoParse(body, response, resolveWithFullResponse) {
      // FIXME: The content type string could contain additional values like the charset.
      // Consider using the `content-type` library for a robust comparison.
      if (response.headers['content-type'] === 'application/json') {
        return JSON.parse(body);
      } else if (response.headers['content-type'] === 'text/html') {
        return cheerio.load(body);
      } else {
        return cheerio.load(body);
      }
    }
    let options = {
      uri: url,
      transform: autoParse
    }
    let out = []
    let tempItem
    await rp(options).then(function ($) {
      html = $('.j-r-list').eq(0).html();
      for (let i = 0; i < $('.j-list-user').length; i++) {
        tempItem = $('.j-list-user').eq(i);
        out.push({
          username: decodeHtml(tempItem.find('.u-user-name').eq(0).html()),
          icon: tempItem.find('.u-logo').eq(0).data('original'),
          content: decodeHtml($('.j-r-list-c-desc').eq(i).find('a').eq(0).html()),
          time: tempItem.find('.u-time').html()
        });
      }
    }).catch(function (err) {
      console.log('ERROR: ', err);
    });
    return this.json({'code': 200, 'errmsg': '获取成功', data: {
      list: out
    }});
    // return this.echo(decodeHtml(html))
  }

  async fetchTouTiaoAction () {
    // const time = this.get('min_behot_time') || 0;
    // const as = this.get('as') || '';
    // const category = this.get('category') || '__all__';
    // const utm_source = this.get('utm_source') || 'toutiao';
    // const widen = this.get('widen') || 1;
    // const tadrequire = this.get('tadrequire') || 'true';
    // const cp = this.get('cp') || '5983AE41BC988E1';

    let params = [];
    this.get('min_behot_time') && params.push('min_behot_time=' + this.get('min_behot_time'));
    this.get('max_behot_time') && params.push('max_behot_time=' + this.get('max_behot_time'));
    this.get('category') ? params.push('category=' + this.get('category')) : params.push('category=__all__');
    this.get('utm_source') && params.push('utm_source=' + this.get('utm_source'));
    this.get('widen') && params.push('widen=' + this.get('widen'));
    this.get('tadrequire') && params.push('tadrequire=' + this.get('tadrequire'));
    // this.get('as') && params.push('as=' + this.get('as'));
    // this.get('cp') && params.push('cp=' + this.get('cp'));
    let asCp = getAsCp();
    params.push('as=' + asCp.as);
    params.push('cp=' + asCp.cp);

    let cookies = new tough.Cookie({
      uuid: '"w:9ba3430d10c247b4ac6ba5c5bfeedfd9"',
      UM_distinctid: '15d2b63cef026-0fa786084ccda7-30657509-13c680-15d2b63cef1ccc',
      _vis_opt_s: '1%7C',
      _vwo_uuid_v2: '40219F23D88BD690CF52110E044741B3|775bc608537339ac151623bc02528c39',
      _vis_opt_test_cookie: 1,
      Hm_lvt_23e756494636a870d09e32c92e64fdd6: '1501814350,1501814354,1501814367',
      Hm_lpvt_23e756494636a870d09e32c92e64fdd6: '1501814367',
      tt_track_id: '9e773f21da7f4f38a0a312381167aa09',
      csrftoken: 'd3f48f0dd3844a57d5f1525242c55cd2',
      WEATHER_CITY: '%E5%8C%97%E4%BA%AC',
      _ga: 'GA1.2.1420651422.1499671548',
      _gid: 'GA1.2.1304568791.1502073316',
      CNZZDATA1259612802: '34052669-1499669198-%7C1502083084',
      __tasessionId: '3ikpky54e1502093167136',
      tt_webid: '6441040249397233166'
    })
    let cookiejar = rp.jar();

    // let url = 'http://www.toutiao.com/api/pc/feed/?min_behot_time=' + time + '&category=__all__&utm_source=toutiao&widen=1&tadrequire=true&as='+as+'&cp=5983AE41BC988E1';
    let url = 'http://www.toutiao.com/api/pc/feed/?' + params.join('&');
    console.log(url)
    let html = '';
    function autoParse(body, response, resolveWithFullResponse) {
      // FIXME: The content type string could contain additional values like the charset.
      // Consider using the `content-type` library for a robust comparison.
      if (response.headers['content-type'] === 'application/json') {
        return JSON.parse(body);
      } else if (response.headers['content-type'] === 'text/html') {
        return cheerio.load(body);
      } else {
        return body;
      }
    }
    let options = {
      uri: url,
      jar: cookiejar,
      transform: autoParse
    }
    let out = []
    let tempItem
    await rp(options).then(function (res) {
      html = res
    }).catch(function (err) {
      console.log('ERROR: ', err);
    });
    return this.json({'code': 200, 'errmsg': '获取成功', data: html});
  }

  async fetchMTouTiaoAction () {
    // const time = this.get('min_behot_time') || 0;
    // const as = this.get('as') || '';
    // const category = this.get('category') || '__all__';
    // const utm_source = this.get('utm_source') || 'toutiao';
    // const widen = this.get('widen') || 1;
    // const tadrequire = this.get('tadrequire') || 'true';
    // const cp = this.get('cp') || '5983AE41BC988E1';
    const that = this
    let asCp = getAsCp()

    let params = [];
    this.get('min_behot_time') && params.push('min_behot_time=' + this.get('min_behot_time'));
    this.get('max_behot_time') && params.push('max_behot_time=' + this.get('max_behot_time'));
    this.get('ac') ? params.push('ac=' + this.get('ac')) : params.push('ac=wap');
    this.get('count') ? params.push('count=' + this.get('count')) : params.push('count=20');
    this.get('format') ? params.push('format=' + this.get('format')) : params.push('format=json_raw');

    params.push('as=' + asCp.as);
    params.push('cp=' + asCp.cp);
    // this.get('as') ? params.push('as=' + this.get('as')) : params.push('as=A1E51918175FFB3');
    // this.get('cp') ? params.push('cp=' + this.get('cp')) : params.push('cp=5987EF1FDB431E1');

    // let url = 'http://www.toutiao.com/api/pc/feed/?min_behot_time=' + time + '&category=__all__&utm_source=toutiao&widen=1&tadrequire=true&as='+as+'&cp=5983AE41BC988E1';
    let url = 'http://m.toutiao.com/list/?' + params.join('&');
    console.log('>>>>', url)
    let out = {}
    // // this.ctx.header('Referer', 'https://m.toutiao.com');
    await rp.get(url).then(function (res) {
      out = res
      // try {
      //   out = JSON.parse(res)
      // } catch (err) {
      //   out = res
      // }
    })
    // out = await request({
    //   method: 'GET',
    //   url: url
    // }, function (error, response, body) {
    //   return error;
    // })
    return that.json({'code': 200, 'errmsg': '获取成功', data: out});
  }

  async fetchPageAction () {
    const that = this;
    let url = this.get('from') || 'http://mp3.sogou.com';
    let _callback = this.get('callback');
    if (!!_callback) {
      let html = '';
      function autoParse(body, response, resolveWithFullResponse) {
        // FIXME: The content type string could contain additional values like the charset.
        // Consider using the `content-type` library for a robust comparison.
        if (response.headers['content-type'] === 'application/json') {
          return JSON.parse(body);
        } else if (response.headers['content-type'] === 'text/html') {
          return cheerio.load(body);
        } else {
          return body;
        }
      }

      let _start = decodeURIComponent(this.post('start')) || '<div class="bang_box bang_03">';
      let _end = decodeURIComponent(this.post('end')) || '<div class="bang_box bang_04">';
      // let _start = '<div id="list_div" class="r_con_800">';
      // let _end = '<div id="footer">';

      let options = {
        uri: url,
        transform: autoParse
      }
      let out = [];
      await rp(options).then(function (autoParsedBody) {
        html = autoParsedBody;
        // html = autoParsedBody.substring(autoParsedBody.indexOf(_start), autoParsedBody.indexOf(_end));
        // html = html.match(new RegExp('http.*?\.(m4a)|(mp3)', 'g'))
        html = html.match(new RegExp('http.*?\.m4a\?.*?#,#.*?#,#.*?#,#.*?#,#', 'g'))
        let i = 0;
        let temp;
        let tempObj = {};
        let tempUrl;
        for (i; i < html.length; i++) {
          tempObj = {};
          temp = html[i].replace(/#,#$/, '').split('#,#');
          tempUrl = decodeURIComponent(temp[0].replace(/\?.*$/, ''));
          if (JSON.stringify(out).indexOf(tempUrl) < 0) {
            tempObj = {
              name: (i + 1) + '. ' + temp[1],
              author: temp[3],
              url: tempUrl,
              poster: 'http://talkapi.dei2.com/Static/img/default_cover.jpeg'
            }
            out.push(tempObj)
          }
        }
      }).catch(function (err) {
        console.log('ERROR: ', err)
      });

      // if (_callback) {
      //   this.header('Content-Type', 'text/javascript')
      //   return this.json(_callback + "(" + JSON.stringify(out) + ")");
      // } else {
      //   return this.jsonp(out)
      // }
      // this.header('Content-Type', 'text/javascript')
      return this.echo(_callback + "(" + JSON.stringify(out) + ")", 'text/javascript');
    } else {
      return this.fail('请求姿势不正确')
    }
  }

  async getJokesAction () {
    let _callback = this.get('callback');
    if (!_callback) {
      return this.fail('请求姿势不正确');
    } else {
      let out = [];
      let _url = 'http://xiaominggunchuqu.com/';
      let html = '';
      function autoParse(body, response, resolveWithFullResponse) {
        // FIXME: The content type string could contain additional values like the charset.
        // Consider using the `content-type` library for a robust comparison.
        if (response.headers['content-type'] === 'application/json') {
          return JSON.parse(body);
        } else if (response.headers['content-type'] === 'text/html') {
          return cheerio.load(body);
        } else {
          return body;
        }
      }
      let options = {
        uri: _url,
        transform: function (body) {
          return cheerio.load(body)
        }
      }
      await rp(options).then(function ($) {
        let tempStr = '';
        for (let i = 0; i < $('.smallcontent').length; i++) {
          tempStr = decodeHtml($('.smallcontent').eq(i).html().trim());
          if (tempStr.indexOf('<br>') > 0 || tempStr.indexOf('<br/>') > 0) {
            out.push(tempStr.replace(/^\d+、/, '').split('<br>'))
          }
        }
        html = decodeHtml($('.smallcontent').html())
      }).catch(function (err) {
        console.log('ERROR: ', err)
      });
      // return this.json(out)
      // this.header('Content-Type', 'text/javascript')
      return this.echo(_callback + '(' + JSON.stringify(out) + ')', 'text/javascript');
    }
  }

  async getLettersAction () {
    let out = await this.lettersModel.where({id: {'>=': 1}}).select();
    return this.json({'code': 200, 'errmsg': '获取成功', 'data': out});
  }

  async saveLetterAction () {
    let _param = {
      'title': this.post('title') || '',
      'content': this.post('content') || '',
      'status': this.post('status') || 1,
      'create_time': (+new Date) / 1000,
      'image': this.post('image') || 'http://static.dei2.com/imgs/default.jpg',
      'update_time': (+new Date) / 1000
    }
    await this.lettersModel.add(_param);
    return this.json({'code': 200, 'errmsg': '成功', 'data': _param});
  }

  encodeImageAction () {
    let _callback = this.get('callback');
    return this.echo(_callback + '(' + JSON.stringify({'code': 200, 'errmsg': '成功', 'data': this.post('image')}) + ')', 'text/javascript');
  }

  async uploadImageAction () {
    const that = this
    const exec = require('child_process').execSync;
    // this.ctx.header('Access-Control-Allow-Origin', 'http://tools.dei2.com')
    try {
      let _file = this.file('file');
      let _newFileName = think.md5(_file.name + _file.size + _file.path.replace(/.*_(.*)$/, '$1')) + _file.name.replace(/.*(\..*)$/, '$1')
      await exec('cp ' + _file.path + ' /srv/web_static/uploads/' + _newFileName);
      // await exec('cp ' + _file.path + ' /Keith/uploads/' + _newFileName);
      return that.json(Object.assign({}, _file, {
        path: 'http://static.dei2.com/uploads/' + _newFileName
      }));
    } catch (err) {
      return this.error(err);
    }
  }

  getIpAction () {
    return this.json(this.ctx.ip);
  }

  async loginAction () {
    let _username = this.get('username');
    let _password = this.get('password');
    let userInfo = await this.userModel.where({'phonenum': _username, 'password': _password}).find()
    if (think.isEmpty(userInfo)) {
      return this.error('登录失败');
      // return this.json({'code': 1001, 'errmsg': '登录失败', data: {}});
    } else {
      let loginToken = jwt.sign({
        data: {
          username: _username
        }
      }, 'secret', { expiresIn: 10 });
      this.session(_username, loginToken)
      this.userModel.where({id: userInfo.id}).update({'last_login_time': (+new Date())})
      if (userInfo.hasOwnProperty('password')) {
        delete userInfo.password;
      }
      return this.json({'code': 200, 'errmsg': '登录成功', data: Object.assign({}, userInfo, {
        token: loginToken
      })});
    }
  }

  async logoutAction () {
    let _username = this.get('username');
    let _token = this.get('token');
    let _userSession = await this.session(_username);
    if (_userSession === _token) {
      await this.session(_username, null);
    }
    return this.json({'code': 200, 'errmsg': '退出成功'});
  }

  async checkLoginAction () {
    let _username = this.get('username');
    let _token = this.get('token');
    let _userSession = await this.session(_username);
    if (_userSession === _token) {
      return this.json({'code': 200, 'errmsg': '已经登录', 'data': {isLogin: true}});
    } else {
      return this.json({'code': 200, 'errmsg': '未登录', 'data': {isLogin: false}});
    }
  }

  signAction () {
    let code = this.get('code')
    return this.json({'code': 200, 'errmsg': '成功', data: {
      signCode: jwt.sign({
        data: code
      }, 'secret', { expiresIn: 24 * 60 * 60 })
    }});
  }

  async getCityInfoByLatLngAction () {
    let lat = this.get('lat');
    let lng = this.get('lng');
    function autoParse(body, response, resolveWithFullResponse) {
      // FIXME: The content type string could contain additional values like the charset.
      // Consider using the `content-type` library for a robust comparison.
      if (response.headers['content-type'] === 'application/json') {
        return JSON.parse(body);
      } else if (response.headers['content-type'] === 'text/html') {
        return cheerio.load(body);
      } else {
        return body;
      }
    }
    let url = 'https://m.zhaopin.com/Home/GetCityInfoByLatLng?lat=' + lat + '&lng=' + lng;
    let options = {
      uri: url,
      transform: autoParse
    }
    let out = {}
    await rp(options).then(function (res) {
      out = res
    }).catch(function (err) {
      console.log('ERROR: ', err);
    });
    return this.json({code: 200, errmsg: '成功', data: out})
  }
}