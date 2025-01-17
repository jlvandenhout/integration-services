import { MongoDbService } from './mongodb-service';

describe('test MongoDbService', () => {
	it('getPlainObject should not return values with null or undefined!', () => {
		const updateObject = MongoDbService.getPlainObject({
			identityId: 'test-12334',
			fieldIsNull: null,
			fieldIsUndefined: undefined,
			age: 0,
			emptyString: ''
		});
		const expectedPlainObject = {
			emptyString: '',
			age: 0,
			identityId: 'test-12334'
		};
		expect(updateObject).toEqual(expectedPlainObject);
	});
});
