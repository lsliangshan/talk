/**
 * Model
 * @return
 */
const thinkorm = require('thinkorm');

export default class extends thinkorm {
    init(name, config){
        super.init(name, config);

        // 是否开启迁移(migrate方法可用)
        this.safe = false;
        // 数据表字段信息
        this.fields = {
          id: {
            primaryKey: true,
            index: true,
            type: 'integer'
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
          last_login_ip: {
            type: 'string',
            defaultsTo: ''
          },
          birthday: {
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

    autoPassword (data){
      return think.md5(data.password);
    }

    async _beforeAdd (data, options) {
      let num = await this.where({username: data.username}).count();
      if (num > 0) {
        return think.error('该用户已经存在');
      }
      this.validations = think.extend(this.validations,{
        password: {
          valid: ['required', 'length'],
          length_args: [6],
          msg: {
            required: '密码不能为空',
            length: '密码长度至少6位'
          }
        }
      });
      let now = new Date().Timestamp();
      data.create_time = now;
      data.update_time = now;
      if(!think.isEmpty(data.password)){
        data.password = this.autoPassword(data);
      }
      if(think.isEmpty(data.end_time)){
        data.end_time = new Date().Timestamp() + (60 * 60 * 24 * 30);
      } else {
        data.end_time = new Date().Timestamp(data.end_time);
      }
      return Promise.reslove(data);
    }

    _beforeFind (data) {
      if (!think.isEmpty(data.password)) {
        data.password = this.autoPassword(data);
      }
      return Promise.reslove(data);
    }
}