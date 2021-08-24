import { Type } from '@sinclair/typebox';
import { TopicSchema } from '../channel-info';

export const CreateChannelBodySchema = Type.Object({
	subscriptionPassword: Type.Optional(
		Type.String({
			minLength: 8,
			description:
				'If a subscriptionPassword is set, all data is encrypted with the password. It need to be made sure, the subscription password is sent when interacting with the APIs of the channel-service and subscription-service.'
		})
	), // TODO#156 use to decrypt/encrypt data and state
	topics: Type.Array(TopicSchema),
	hasPresharedKey: Type.Optional(
		Type.Boolean({
			description:
				'If the channel has a preshared key (hasPresharedKey=true) but non is set in the presharedKey property it will be generated by the api.'
		})
	),
	seed: Type.Optional(
		Type.Union([
			Type.String({
				minLength: 1,
				description: 'If left empty the api will generate a seed automatically. Always store your seed otherwise the data can not be reimported.'
			}),
			Type.Null()
		])
	),
	presharedKey: Type.Optional(
		Type.String({
			minLength: 32,
			maxLength: 32,
			description: 'If the channel has a preshared key (hasPresharedKey=true) but non is defined here the presharedKey will be generated by the api.'
		})
	)
});

export const CreateChannelBodyResponseSchema = Type.Object({
	seed: Type.Optional(Type.Union([Type.String({ minLength: 1 }), Type.Null()])),
	channelAddress: Type.String({ minLength: 105, maxLength: 105 }),
	presharedKey: Type.Optional(
		Type.String({
			minLength: 32,
			maxLength: 32
		})
	)
});

export const AddChannelLogBodySchema = Type.Object({
	type: Type.Optional(Type.String({ minLength: 1, description: 'Public available type.' })),
	created: Type.Optional(Type.String({ format: 'date-time', description: 'Public available date.' })),
	metadata: Type.Optional(Type.Any({ description: 'Public available metadata.' })),
	publicPayload: Type.Optional(Type.Any({ description: 'Public available payload.' })),
	payload: Type.Optional(Type.Any({ description: 'Payload is stored encrypted in the channel.' }))
});

export const ReimportBodySchema = Type.Object({
	seed: Type.Optional(Type.Union([Type.String({ minLength: 1 }), Type.Null()])),
	subscriptionPassword: Type.Optional(
		Type.String({
			minLength: 8,
			description:
				'If a subscriptionPassword is set, all data is encrypted with the password. It need to be made sure, the subscription password is sent when interacting with the APIs of the channel-service and subscription-service.'
		})
	) // TODO#156 use to decrypt/encrypt data and state
});

export const ChannelLogSchema = AddChannelLogBodySchema;

export const ChannelDataSchema = Type.Object({
	link: Type.String(),
	messageId: Type.Optional(Type.String({ description: 'Message id can be used to search for the message in an IOTA explorer.' })),
	channelLog: ChannelLogSchema
});
