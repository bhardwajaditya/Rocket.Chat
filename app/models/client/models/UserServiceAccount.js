import { Base } from './_Base';

class UserServiceAccount extends Base {
	constructor() {
		super();
		this._initModel('user_service_account');
	}
}

export default new UserServiceAccount();