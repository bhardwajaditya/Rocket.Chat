import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { t } from '../../../utils/client';
import toastr from 'toastr';
import { SideNav } from '../../../ui-utils/client/lib/SideNav';
import './serviceAccountDashboard.html';
Template.serviceAccountDashboard.helpers({

});

Template.serviceAccountDashboard.events({

});

Template.serviceAccountDashboard.onRendered(() => {
    Tracker.afterFlush(() => {
		SideNav.setFlex('adminFlex');
		SideNav.openFlex();
	});
});
