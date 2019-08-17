import { Template } from 'meteor/templating';

import './accountServiceAccounts.html';

Template.accountServiceaccounts.helpers({
	loading() {
		return Template.instance().loading.get();
	},
	users() {
		return Template.instance().users.get();
	},
	hasServiceAccounts() {
		return Template.instance().users.get() && Template.instance().users.get().length > 0;
	},
});

Template.accountServiceaccounts.events({

});


Template.accountServiceaccounts.onCreated(function () {
	const instance = this;
	this.ready = new ReactiveVar(true);
	this.users = new ReactiveVar([]);
	this.loading = new ReactiveVar(true);
	this.autorun(() => {
		instance.loading.set(true);
		Meteor.call('getOwnedServiceAccounts', function(err, serviceAccounts) {
			if (err) {
				instance.loading.set(false);
				return handleError(err);
			}
			instance.users.set(serviceAccounts);
			instance.loading.set(false);
		});
	});
});
