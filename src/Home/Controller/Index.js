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
    let userInfo = await this.UserModel.where({phonenum: '18311032722', password: THINK.md5('123')}).find();
    console.log('UserInfo: ', userInfo)
    return this.display();
  }
}