import { Meteor } from 'meteor/meteor';

import { Users } from '../../../models';

Meteor.methods({
	getUsernameByLoginToken(token) {
		if (!Meteor.userId()) {
			throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'getUsernameByLoginToken' });
		}

		const user = Users.findUserByLoginToken(token).fetch();
		console.log(user);
		return user.username;
	},
});
