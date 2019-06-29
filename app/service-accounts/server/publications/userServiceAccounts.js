import { Meteor } from 'meteor/meteor';

import { Users, Subscriptions } from '../../../models';
import { getDefaultUserFields } from '../../../utils/server/functions/getDefaultUserFields';

Meteor.publish('userServiceAccounts', function() {
	if (!this.userId) {
		return this.ready();
	}

	if (Meteor.user().u) {
		return this.ready();
	}
	const handle = Users.find({ 'u._id': this.userId, active: true }, {
		fields: getDefaultUserFields(),
	}).observeChanges({
		added: (id, fields) => {
			const unread = Subscriptions.findUnreadByUserId(id);
			fields.unread = unread;
			this.added('rocketchat_user_service_account', id, fields);
		},

		changed: (id, fields) => {
			this.changed('rocketchat_user_service_account', id, fields);
		},

		removed: (id) => {
			this.removed('rocketchat_user_service_account', id);
		},
	});

	this.ready();

	this.onStop(() => handle.stop());
});
