import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import { Users } from '../../../models';
import { ServiceAccountOwner } from '../../../models';

Meteor.methods({
	addServiceAccountOwner(username, serviceAccountUsername) {
		if (!Meteor.userId()) {
			throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'addServiceAccountOwner' });
		}

		const user = Users.findOneByUsername(username, {});
		const serviceAccount = Users.findOneByUsername(serviceAccountUsername, {});
		const owner = ServiceAccountOwner.createWithUserAndServiceAccount(user, serviceAccount);
		return owner;
	},
});
