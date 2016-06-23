import { bookshelf, knex} from '../dbContext';
import Checkit from 'checkit';


let UserModel = bookshelf.Model.extend({
	// idAttribute: 'id',
	tableName: 'users',
  	hasTimestamps: true,
  	validateRules: {
  		userName: {
  			rule: 'required',
  			message: '请输入用户名'
  		},
  		email: {
  			rule: 'required',
  			message: '请输入Email地址'
  		},
  		mobile: [{
  			rule: 'required',
  			message: '请输入手机号'
  		}
  		, {
  			rule: function (val, params, context) {
  				return knex('users')
  							.where('mobile', '=', val)
  							.then(function (resp) {
  								if (resp.length > 0) {
  									throw new Error('该手机号已经被使用，请尝试其他号码');
  								}
   							})
  			}
  		}
  		],
  		company: {
  			rule: 'required',
  			message: '请输入公司名称'
  		},
  		duty: {
  			rule: 'required',
  			message: '请输入职务名称',
  		}
  		,
  		openid: {
  			rule: 'required',
  			message: '缺少参数'
  		}
  	},
  	initialize ()  {
        this.on('saving', this.validate);
    },
    validate (model, attrs, options) {
    	return Checkit(this.validateRules).run(this.toJSON());
    }
});

module.exports = UserModel;