import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { ChatRoom, Subscriptions } from '../../models';
import { openRoom } from '../../ui-utils';
import { getUserPreference, RoomTypeConfig, RoomTypeRouteConfig } from '../../utils';
import { hasPermission } from '../../authorization';
import { getUserAvatarURL } from '../../utils/lib/getUserAvatarURL'; 

export class ServiceAccountRoomRoute extends RoomTypeRouteConfig {
	constructor() {
		super({
			name: 'subscriptions',
			path: '/subscriptions/:username',
		});
	}

	action(params) {
		return openRoom('sa', params.username);
	}

	link(sub) {
		return { username: sub.name };
	}
}

export class ServiceAccountRoomType extends RoomTypeConfig {
  constructor() {
      super({
      	identifier: 'sa',
        order: 60,
        icon: 'at',
        label: 'Service_account',
        route: new ServiceAccountRoomRoute(),
      });
  }

  findRoom(identifier) {
    const query = {
      t: 'sa',
      name: identifier,
    };

    const subscription = Subscriptions.findOne(query);
    if (subscription && subscription.rid) {
      return ChatRoom.findOne(subscription.rid);
    }
  }

  roomName(roomData) {

		const subscription = roomData && (roomData.fname || roomData.name) ?
			roomData :
			Subscriptions.findOne({ rid: roomData._id });

		if (subscription === undefined) {
			return console.log('roomData', roomData);
		}

		return subscription.name;
    }
    
    condition() {
		const groupByType = getUserPreference(Meteor.userId(), 'sidebarGroupByType');
		return groupByType && hasPermission('view-sa-room');
    }
    
    getUserStatus(roomId) {
		const subscription = Subscriptions.findOne({ rid: roomId });
		if (subscription == null) {
			return;
		}

		return Session.get(`user_${ subscription.name }_status`);
	}

	getDisplayName(room) {
		return room.usernames.join(' x ');
    }
    
    userDetailShowAll() {
		return true;
    }
    
    getAvatarPath(roomData) {
		return getUserAvatarURL(roomData.name || this.roomName(roomData));
	}
}
