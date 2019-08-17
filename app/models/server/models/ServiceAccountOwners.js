import { Base } from './_Base';

export class ServiceAccountOwners extends Base {
	constructor() {
		super('serviceAccountOwners');
		this.tryEnsureIndex({ sid: 1 });
		this.tryEnsureIndex({ 'u._id': 1 });
	}

	createWithUserAndServiceAccount(user, serviceAccount) {
		const ownership = {
			sid: serviceAccount._id,
			username: serviceAccount.username,
			u: {
				_id: user._id,
				username: user.username,
			},
			active: serviceAccount.active,
		};

		const result = this.insert(ownership);

		return result;
	}

	findWithUserId(userId, options) {
		const query = {
			'u._id': userId,
			active: true,
		};

		return this.find(query, options);
	}

	findWithServiceAccountId(serviceAccount, options) {
		const query = {
			sid: serviceAccount,
		};

		return this.find(query, options);
	}

	setActive(serviceAccount, active) {
		const query = {
			sid: serviceAccount,
		}

		const update = {
			$set: {
				active,
			}
		}
		return this.update(query, update, { multi: true });
	}
}

export default new ServiceAccountOwners();
