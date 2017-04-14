/**
 * Controller
 * @return
 */

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
  async indexAction () {
    let userInfo = await this.UserModel.where({phonenum: '18311032722', password: THINK.md5('1223')}).find();
    userInfo.hasOwnProperty('password') && (delete userInfo.password)
    console.log('>>>>>>', userInfo)
    return this.deny(403);
  }

  // 登录
  async loginAction () {
    if (this.isPost()) {
      let phonenum = this.post('phonenum')
      let password = this.post('password')
      let userInfo = await this.UserModel.where({phonenum, phonenum, password: THINK.md5(password)}).find();
      userInfo.hasOwnProperty('password') && (delete userInfo.password)
      return this.success(userInfo)
    } else {
      return this.error('请求姿势不正确~');
    }
  }
}