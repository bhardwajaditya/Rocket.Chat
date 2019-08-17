import { Meteor } from 'meteor/meteor';

import { Subscriptions, ServiceAccountOwners } from '../../../models';
import { getDefaultUserFields } from '../../../utils/server/functions/getDefaultUserFields';

Meteor.methods({
	getLinkedServiceAccounts() {
		if (!Meteor.userId()) {
			throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'getLinkedServiceAccounts' });
		}

		const query = {
			'u._id': Meteor.userId(),
			active: true,
		};
		const result = ServiceAccountOwners.findWithUserId(Meteor.userId()).fetch();
		result.forEach((serviceAccount) => {
			serviceAccount.unread = Subscriptions.findUnreadByUserId(serviceAccount.sid).count();
		});
		return result;
	},
});
