import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Session } from 'meteor/session';

import { handleError } from '../../../utils';
import { callbacks } from '../../../callbacks';
import './serviceAccountSidebarLogin.html';
import { popover } from '../../../ui-utils/client';

Template.serviceAccountSidebarLogin.helpers({
	loading() {
		return Template.instance().loading.get();
	},
	users() {
		return Template.instance().users.get();
	},
	hasServiceAccounts() {
		return Template.instance().users.get() && Template.instance().users.get().length > 0;
	},
	owner() {
		return Template.instance().owner.get();
	},
	showOwnerAccountLink() {
		return localStorage.getItem('owner') && Meteor.user() && Meteor.user().u;
	},
	receivedNewMessage(username) {
		if (Template.instance().notifiedServiceAccount) {
			return username === Template.instance().notifiedServiceAccount.get();
		}
		return false;
	},
});

Template.serviceAccountSidebarLogin.events({
	'click .js-login'(e) {
		e.preventDefault();
		let { username } = this;
		if (Meteor.user() && Meteor.user().u) {
			username = Template.instance().owner.get();
			const token = localStorage.getItem('owner');
			localStorage.removeItem('owner');
			const user = Meteor.user();
			Meteor.logout(() => {
				callbacks.run('afterLogoutCleanUp', user);
				Meteor.call('logoutCleanUp', user, document.cookie);
				FlowRouter.go('home');
				popover.close();
				Meteor.loginWithToken(token, (err) => {
					if (err) {
						return handleError(err);
					}
				});
			});
		} else {
			Meteor.call('getLoginToken', username, function(error, token) {
				if (error) {
					return handleError(error);
				}
				localStorage.setItem('owner', localStorage.getItem('Meteor.loginToken'));
				const user = Meteor.user();
				Meteor.logout(() => {
					callbacks.run('afterLogoutCleanUp', user);
					Meteor.call('logoutCleanUp', user, document.cookie);
					FlowRouter.go('home');
					popover.close();
					Meteor.loginWithToken(token.token, (err) => {
						if (err) {
							return handleError(err);
						}
					});
				});
			});
		}
		
	},
});

Template.serviceAccountSidebarLogin.onCreated(function() {
	const instance = this;
	this.ready = new ReactiveVar(true);
	this.users = new ReactiveVar([]);
	this.loading = new ReactiveVar(true);
	this.owner = new ReactiveVar('');
	this.notifiedServiceAccount = new ReactiveVar('');
	instance.notifiedServiceAccount.set(Session.get('saMessageReceiver'));
	Session.delete('saMessageReceiver');
	Session.delete('saNotification');
	this.autorun(() => {
		instance.loading.set(true);
		if (localStorage.getItem('owner')) {
			Meteor.call('getUsernameByLoginToken', localStorage.getItem('owner'), function(err, username) {
				if (err) {
					instance.loading.set(false);
					return handleError(err);
				}
				instance.owner.set(username);
				instance.loading.set(false);
			});
		} else {
			Meteor.call('getLinkedServiceAccounts', function(err, serviceAccounts) {
				if (err) {
					this.loading.set(false);
					return handleError(err);
				}
				instance.users.set(serviceAccounts);
				instance.loading.set(false);
			});
		}
	});
});
