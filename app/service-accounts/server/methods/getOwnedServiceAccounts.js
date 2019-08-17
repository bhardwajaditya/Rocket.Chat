import { Meteor } from 'meteor/meteor';

import { Users, Rooms } from '../../../models';

Meteor.methods({
	getOwnedServiceAccounts() {
		if (!Meteor.userId()) {
			throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'getOwnedServiceAccounts' });
		}

		const results = Users.findLinkedServiceAccounts(Meteor.userId(), {}).fetch();
		results.forEach((account) => {
			account.subscribers = Rooms.findDirectRoomContainingUsername(account.username).count();
		});
		return results;
	},
});
