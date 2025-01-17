import { ChannelInfo, ChannelInfoPersistence, ChannelInfoSearch } from '../models/types/channel-info';
import * as ChannelInfoDb from '../database/channel-info';
import { DeleteWriteOpResultObject, InsertOneWriteOpResult, UpdateWriteOpResult, WithId } from 'mongodb';
import { UserService } from './user-service';
import { getDateFromString, getDateStringFromDate } from '../utils/date';
import isEmpty from 'lodash/isEmpty';

export class ChannelInfoService {
	constructor(private readonly userService: UserService) {}

	async getChannelInfo(channelAddress: string): Promise<ChannelInfo | null> {
		const channelInfoPersistence = await ChannelInfoDb.getChannelInfo(channelAddress);
		return channelInfoPersistence && this.getChannelInfoObject(channelInfoPersistence);
	}

	async searchChannelInfo(channelInfoSearch: ChannelInfoSearch): Promise<ChannelInfo[]> {
		let channelInfoPersistence: ChannelInfoPersistence[] = [];

		if (channelInfoSearch.author && !channelInfoSearch.authorId) {
			const authorId = await this.userService.getIdentityId(channelInfoSearch.author);

			if (!authorId) {
				throw Error(`No user id found for: ${channelInfoSearch.author}`);
			}
			const search = {
				...channelInfoSearch,
				authorId
			};
			channelInfoPersistence = await ChannelInfoDb.searchChannelInfo(search);
		} else {
			channelInfoPersistence = await ChannelInfoDb.searchChannelInfo(channelInfoSearch);
		}
		return channelInfoPersistence?.map((channel) => this.getChannelInfoObject(channel)).filter((c) => c);
	}

	async addChannelInfo(channelInfo: ChannelInfo): Promise<InsertOneWriteOpResult<WithId<unknown>>> {
		const channelInfoPersistence = this.getChannelInfoPersistence(channelInfo);
		return ChannelInfoDb.addChannelInfo(channelInfoPersistence);
	}

	async updateChannelTopic(channelInfo: ChannelInfo): Promise<UpdateWriteOpResult> {
		const channelInfoPersistence = this.getChannelInfoPersistence(channelInfo);
		return ChannelInfoDb.updateChannelTopic(channelInfoPersistence);
	}

	async addChannelSubscriberId(channelAddress: string, channelSubscriberId: string): Promise<UpdateWriteOpResult> {
		return ChannelInfoDb.addChannelSubscriberId(channelAddress, channelSubscriberId);
	}

	async deleteChannelInfo(channelAddress: string): Promise<DeleteWriteOpResultObject> {
		return ChannelInfoDb.deleteChannelInfo(channelAddress);
	}

	getChannelInfoPersistence(ci: ChannelInfo): ChannelInfoPersistence | null {
		if (ci == null || isEmpty(ci.channelAddress) || isEmpty(ci.topics) || !ci.authorId) {
			throw new Error('Error when parsing the body: channelAddress, topic and author must be provided!');
		}

		const channelInfoPersistence: ChannelInfoPersistence = {
			created: ci.created ? getDateFromString(ci.created) : null,
			authorId: ci.authorId,
			subscriberIds: ci.subscriberIds || [],
			topics: ci.topics,
			channelAddress: ci.channelAddress,
			latestMessage: ci.latestMessage && getDateFromString(ci.created)
		};

		return channelInfoPersistence;
	}

	getChannelInfoObject(cip: ChannelInfoPersistence): ChannelInfo | null {
		if (cip == null || isEmpty(cip.channelAddress)) {
			return null;
		}

		const channelInfo: ChannelInfo = {
			created: getDateStringFromDate(cip.created),
			authorId: cip.authorId,
			subscriberIds: cip.subscriberIds || [],
			topics: cip.topics,
			latestMessage: cip.latestMessage && getDateStringFromDate(cip.latestMessage),
			channelAddress: cip.channelAddress
		};
		return channelInfo;
	}
}
