/**
 * Model
 * @return
 */
const thinkorm = require('thinkorm');

export default class extends thinkorm {
    init(name, config){
        super.init(name, config);

        // 是否开启迁移(migrate方法可用)
        // this.safe = false;
        // 数据表字段信息
      this.fields = {
        id: {
          primaryKey: true,
          type: 'integer',
          index: true,
          unique: true
        },
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
        this.relation = {};
    }
}