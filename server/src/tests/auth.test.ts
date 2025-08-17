import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { usersTable } from '../db/schema';
import { getUserById } from '../handlers/auth';
import { eq } from 'drizzle-orm';

// Test user data
const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  password_hash: 'hashed_password_123',
  full_name: 'Test User',
  role: 'editor' as const,
  is_active: true
};

const testUserInactive = {
  username: 'inactiveuser',
  email: 'inactive@example.com',
  password_hash: 'hashed_password_456',
  full_name: 'Inactive User',
  role: 'contributor' as const,
  is_active: false
};

describe('getUserById', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return user when found by valid ID', async () => {
    // Create test user
    const insertResult = await db.insert(usersTable)
      .values(testUser)
      .returning()
      .execute();

    const createdUser = insertResult[0];

    // Test getUserById
    const result = await getUserById(createdUser.id);

    expect(result).not.toBeNull();
    expect(result!.id).toBe(createdUser.id);
    expect(result!.username).toBe('testuser');
    expect(result!.email).toBe('test@example.com');
    expect(result!.full_name).toBe('Test User');
    expect(result!.role).toBe('editor');
    expect(result!.is_active).toBe(true);
    expect(result!.created_at).toBeInstanceOf(Date);
    expect(result!.updated_at).toBeInstanceOf(Date);
  });

  it('should return null for non-existent user ID', async () => {
    const result = await getUserById(999999);
    expect(result).toBeNull();
  });

  it('should return null for zero ID', async () => {
    const result = await getUserById(0);
    expect(result).toBeNull();
  });

  it('should return null for negative ID', async () => {
    const result = await getUserById(-1);
    expect(result).toBeNull();
  });

  it('should return inactive user when found', async () => {
    // Create inactive test user
    const insertResult = await db.insert(usersTable)
      .values(testUserInactive)
      .returning()
      .execute();

    const createdUser = insertResult[0];

    // Test getUserById - should still return inactive users
    const result = await getUserById(createdUser.id);

    expect(result).not.toBeNull();
    expect(result!.id).toBe(createdUser.id);
    expect(result!.username).toBe('inactiveuser');
    expect(result!.is_active).toBe(false);
    expect(result!.role).toBe('contributor');
  });

  it('should return correct user among multiple users', async () => {
    // Create multiple users
    const users = await db.insert(usersTable)
      .values([
        testUser,
        testUserInactive,
        {
          username: 'admin',
          email: 'admin@example.com',
          password_hash: 'admin_hash',
          full_name: 'Admin User',
          role: 'super_admin' as const,
          is_active: true
        }
      ])
      .returning()
      .execute();

    // Get the middle user (inactive user)
    const targetUser = users[1];
    const result = await getUserById(targetUser.id);

    expect(result).not.toBeNull();
    expect(result!.id).toBe(targetUser.id);
    expect(result!.username).toBe('inactiveuser');
    expect(result!.role).toBe('contributor');
    expect(result!.is_active).toBe(false);
  });

  it('should return user with all role types', async () => {
    const roles = [
      'super_admin',
      'editor',
      'contributor', 
      'service_officer',
      'ppid_admin',
      'internal_viewer'
    ] as const;

    const usersWithDifferentRoles = roles.map((role, index) => ({
      username: `user_${role}`,
      email: `${role}@example.com`,
      password_hash: `hash_${index}`,
      full_name: `User ${role}`,
      role: role,
      is_active: true
    }));

    // Insert all users
    const insertedUsers = await db.insert(usersTable)
      .values(usersWithDifferentRoles)
      .returning()
      .execute();

    // Test each user can be retrieved correctly
    for (let i = 0; i < insertedUsers.length; i++) {
      const user = insertedUsers[i];
      const result = await getUserById(user.id);
      
      expect(result).not.toBeNull();
      expect(result!.role).toBe(roles[i]);
      expect(result!.username).toBe(`user_${roles[i]}`);
    }
  });

  it('should preserve exact timestamp values', async () => {
    // Create user
    const insertResult = await db.insert(usersTable)
      .values(testUser)
      .returning()
      .execute();

    const createdUser = insertResult[0];

    // Get user and compare timestamps
    const result = await getUserById(createdUser.id);

    expect(result).not.toBeNull();
    expect(result!.created_at.getTime()).toBe(createdUser.created_at.getTime());
    expect(result!.updated_at.getTime()).toBe(createdUser.updated_at.getTime());
  });

  it('should handle database query correctly', async () => {
    // Create user
    const insertResult = await db.insert(usersTable)
      .values(testUser)
      .returning()
      .execute();

    const createdUser = insertResult[0];

    // Verify user exists in database before testing handler
    const dbCheck = await db.select()
      .from(usersTable)
      .where(eq(usersTable.id, createdUser.id))
      .execute();

    expect(dbCheck).toHaveLength(1);

    // Test handler
    const result = await getUserById(createdUser.id);
    expect(result).not.toBeNull();
    expect(result!.id).toBe(createdUser.id);
  });
});