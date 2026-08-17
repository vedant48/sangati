// Tests for Safety, Ratings, Reports, and Blocking

import { submitRating, reportUser, blockUser, unblockUser, getBlockedUsers } from '../src/services/safetyService';

describe('Safety, Ratings & Moderation', () => {
  test('submitRating creates a valid rating and prevents self-rating', async () => {
    // Valid rating
    const rating = await submitRating({
      rideId: 'aaaa2222-2222-2222-2222-222222222222',
      fromUserId: 'user_a',
      toUserId: 'user_b',
      rating: 5,
      review: 'Great driving!',
    });
    expect(rating.rating).toBe(5);

    // Prevent self-rating
    await expect(
      submitRating({
        rideId: 'aaaa2222-2222-2222-2222-222222222222',
        fromUserId: 'user_a',
        toUserId: 'user_a',
        rating: 5,
      })
    ).rejects.toThrow('You cannot rate yourself.');
  });

  test('reportUser submits a pending report for moderation', async () => {
    const rep = await reportUser({
      reporterId: 'user_1',
      reportedUserId: 'user_2',
      reason: 'unsafe_behavior',
      description: 'Reckless driving over speed limit',
    });

    expect(rep).toBeDefined();
    expect(rep.status).toBe('pending');
    expect(rep.reason).toBe('unsafe_behavior');
  });

  test('blockUser and unblockUser manage blocked users list', async () => {
    const blocker = 'user_blocker_1';
    const target = 'user_target_2';

    // Prevent self-block
    await expect(blockUser(blocker, blocker)).rejects.toThrow('You cannot block yourself.');

    // Block
    await blockUser(blocker, target);
    let list = await getBlockedUsers(blocker);
    expect(list.some((b) => b.blocked_user_id === target)).toBe(true);

    // Unblock
    await unblockUser(blocker, target);
    list = await getBlockedUsers(blocker);
    expect(list.some((b) => b.blocked_user_id === target)).toBe(false);
  });
});
