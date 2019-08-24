import { Meteor } from 'meteor/meteor';

import { Users } from '../../../models';
import { settings } from '../../../settings';

Meteor.methods({
	transferServiceAccount(serviceAccountUsername, newOwnerUsername) {
		if (!Meteor.userId()) {
			throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'transferServiceAccount' });
		}

		const currOwner = Meteor.user();
		const serviceAccount = Users.findOneByUsername(serviceAccountUsername, {});
		if (serviceAccount.u._id !== currOwner._id) {
			throw new Meteor.Error('error-not-allowed', 'Not allowed', { method: 'transferServiceAccount' });
		}
		const newOwner = Users.findOneByUsername(newOwnerUsername, { fields: { username: 1 } });
		if (!newOwner) {
			throw new Meteor.Error('User_not_found', 'User not found', { method: 'transferServiceAccount' });
		}
		const query = { 'u._id': newOwner._id };
		const count = Users.find(query).count();
		if (count >= settings.get('Service_account_limit')) {
			throw new Meteor.Error('service-account-limit-reached', 'Max service account limit reached', { method: 'transferServiceAccount' });
		}
		const result = Users.setOwnerByServiceAccountUsername(serviceAccountUsername, newOwner);
		return result;
	},
});
