/**
 * Model
 * @return
 */
export default class extends THINK.Model {
  init(name, config){
    super.init(name, config);

    // 是否开启迁移(migrate方法可用)
    // this.safe = false;
    // 数据表字段信息
    this.fields = {
      phonenum: {
        type: 'string',
        index: true,
        size: 30
      },
      password: {
        type: 'string',
        index: true,
        size: 32
      },
      email: {
        type: 'string',
        index: true,
        size: 50
      },
      nickname: {
        type: 'string',
        size: 50
      },
      icon: {
        type: 'text'
      },
      last_login_time: {
        type: 'integer',
        defaultsTo: 0
      },
      last_login_ip:{
        type: 'string',
        defaultsTo: ''
      },
      birthday:{
        type: 'integer'
      },
      gender: {
        type: 'integer'
      },
      website: {
        type: 'string',
        size: 100
      },
      remark: {
        type: 'string',
        size: 255
      },
      create_time: {
        type: 'integer'
      },
      update_time: {
        type: 'integer'
      },
      end_time: {
        type: 'integer'
      },
      status: {
        type: 'integer',
        defaultsTo: 0,
        index: true
      }
    };
    // 数据验证
    this.validations = {
      phonenum: {
        valid: ['required','mobile'],
        msg: {
          required: '手机号必填',
          mobile: '请输入正确的手机号'
        }
      },
      nickname: {
        valid: ['required'],
        msg: {
          required: '姓名必填'
        }
      },
      email: {
        valid: ['email'],
        msg: {
          email: 'email格式不正确'
        }
      },
      role: {
        valid: ['required'],
        msg: {
          required: '请选择账号角色'
        }
      }
    };
    // 关联关系
    this.relation = {
    };
  }

  autoPassword (data){
    return THINK.md5(data.password);
  }

  autoBirthday (data) {
    return new Date().Timestamp(data.birthday)
  }

  _beforeAdd (data, options){
    this.validations = extend(this.validations,{
      password: {
        valid: ['required', 'length'],
        length_args: [6],
        msg: {
          required: '密码不能为空',
          length: '密码长度至少6位'
        }
      },
      role: {
        valid: ['required'],
        msg: {
          required: '用户角色必须'
        }
      }
    });
    let now = new Date().Timestamp();
    data.create_time = now;
    data.update_time = now;
    if(!THINK.isEmpty(data.birthday)){
      data.birthday = this.autoBirthday(data);
    }
    if(!THINK.isEmpty(data.password)){
      data.password = this.autoPassword(data);
    }
    if(THINK.isEmpty(data.end_time)){
      data.end_time = new Date().Timestamp() + (60 * 60 * 24 * 30);
    } else {
      data.end_time = new Date().Timestamp(data.end_time);
    }
    return THINK.getPromise(data);
  }

  _afterAdd(data, options) {
    return THINK.getPromise(data);
  }

  _beforeDelete(options) {
    return THINK.getPromise(options);
  }

  _afterDelete(options) {
    return THINK.getPromise(options);
  }

  _beforeUpdate(data, options) {
    data.update_time = new Date().Timestamp();
    if(!THINK.isEmpty(data.birthday)){
      data.birthday = this.autoBirthday(data);
    }
    if(!THINK.isEmpty(data.password)){
      data.password = this.autoPassword(data);
    }
    if(THINK.isEmpty(data.end_time)){
      data.end_time = new Date().Timestamp() + (60 * 60 * 24 * 30);
    } else {
      data.end_time = new Date().Timestamp(data.end_time);
    }
    return Promise.resolve(data);
  }

  _afterUpdate(data, options) {
    return THINK.getPromise(data);
  }

  _afterFind(result, options) {
    return THINK.getPromise(result);
  }

  _afterSelect(result, options) {
    return THINK.getPromise(result);
  }
}
