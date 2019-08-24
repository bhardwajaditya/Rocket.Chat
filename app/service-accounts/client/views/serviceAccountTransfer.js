import { Template } from 'meteor/templating';
import toastr from 'toastr';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';

import { t, handleError } from '../../../utils';
import { modal } from '../../../ui-utils';
import './serviceAccountTransfer.html';

Template.serviceAccountTransfer.helpers({
	transferIsDisabled() {
		const username = Template.instance().username.get();
		if (username.length === 0) {
			return 'disabled';
		}
		return '';
	},
});

Template.serviceAccountTransfer.events({
	'input [name="username"]'(e, t) {
		const { value } = e.target;
		t.username.set(value.trim());
	},
	async 'submit #create-service-account'(event, instance) {
		event.preventDefault();
		event.stopPropagation();
		const username = instance.username.get();
		const { serviceAccount } = instance.data;
		Meteor.call('transferServiceAccount', serviceAccount, username, (error) => {
			if (error) {
				return handleError(error);
			}
			toastr.success(t('Service_account_transferred_successfully'));
			modal.close();
			FlowRouter.go('home');
		});
	},
});

Template.serviceAccountTransfer.onCreated(function() {
	this.username = new ReactiveVar('');
});
