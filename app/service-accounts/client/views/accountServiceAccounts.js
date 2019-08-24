import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';

import './accountServiceAccounts.html';
import { t, handleError } from '../../../utils';
import { modal } from '../../../ui-utils';

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
	'click .js-transfer'(e) {
		e.preventDefault();
		modal.open({
			title: t('Service_account_transfer'),
			content: 'serviceAccountTransfer',
			data: {
				onCreate() {
					modal.close();
				},
				serviceAccount: this.username,
			},
			modifier: 'modal',
			showConfirmButton: false,
			showCancelButton: false,
			confirmOnEnter: false,
		});
	},
});


Template.accountServiceaccounts.onCreated(function() {
	const instance = this;
	this.ready = new ReactiveVar(true);
	this.users = new ReactiveVar([]);
	this.loading = new ReactiveVar(true);
	this.autorun(() => {
		instance.loading.set(true);
		Meteor.call('getLinkedServiceAccounts', function(err, serviceAccounts) {
			if (err) {
				instance.loading.set(false);
				return handleError(err);
			}
			instance.users.set(serviceAccounts);
			instance.loading.set(false);
		});
	});
});
