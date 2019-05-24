import { Meteor } from 'meteor/meteor';
import { settings } from '../../settings';
import { Permissions } from '../../models';
Meteor.startup(() => {
	settings.addGroup('Service Accounts', function() {
		this.add('Service_account_enabled', true, {
			group: 'Service Accounts',
			i18nLabel: 'Enable',
			type: 'boolean',
			public: true,
        });
        this.add('Service_account_limit', 3, {
            type: 'int',
            public: true,
        });
	});
	const permission = {
		_id: 'view-service-account-request',
		roles: ['admin'],
	};
	return Permissions.upsert(permission._id, {
		$setOnInsert: permission,
	});
});