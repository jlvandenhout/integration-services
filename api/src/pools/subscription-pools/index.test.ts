import { SubscriptionPool } from '.';
import * as SubscriptionDb from '../../database/subscription';

describe('test subscription pool', () => {
	const pool = SubscriptionPool.getInstance('node');
	beforeEach(() => {
		pool.add({ id: 'imanauthor1' } as any, 'iota:did:imanauthor1', 'test123', true);
		pool.add({ id: 'imanauthor2' } as any, 'iota:did:imanauthor2', 'test123', true);
		pool.add({ id: 'imasubscriber1' } as any, 'iota:did:imasubscriber1', 'test123', false);
		pool.add({ id: 'imasubscriber2' } as any, 'iota:did:imasubscriber2', 'test123', false);
	});

	describe('check if expected subscriptions will be returned', () => {
		it('should return expected subscriptions', async () => {
			const pw = 'test123';
			const getSubscriptionSpy = spyOn(SubscriptionDb, 'getSubscription').and.returnValue(null);
			expect(await pool.get('test123', 'iota:did:imanauthor1', true, pw)).toEqual({ id: 'imanauthor1' });
			expect(await pool.get('test123', 'iota:did:imanauthor2', true, pw)).toEqual({ id: 'imanauthor2' });
			expect(await pool.get('test123', 'iota:did:imanauthor2', false, pw)).toEqual(undefined);
			expect(await pool.get('test123', 'iota:did:imasubscriber1', false, pw)).toEqual({ id: 'imasubscriber1' });
			expect(await pool.get('test123', 'iota:did:imasubscriber2', false, pw)).toEqual({ id: 'imasubscriber2' });
			expect(await pool.get('test123', 'iota:did:imasubscriber2', true, pw)).toEqual(undefined);
			expect(getSubscriptionSpy).toHaveBeenCalledTimes(2);
		});
	});
});