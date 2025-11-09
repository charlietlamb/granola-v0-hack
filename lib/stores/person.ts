import { redis } from "@/lib/redis";
import { type Person, personSchema } from "@/lib/types/meeting";

const PREFIX = "person";

export const personStore = {
  /**
   * Create a new person
   */
  async create(person: Person): Promise<Person> {
    const validated = personSchema.parse(person);
    await redis.set(`${PREFIX}:${validated.id}`, validated);
    return validated;
  },

  /**
   * Get a person by ID
   */
  async get(id: string): Promise<Person | null> {
    const data = await redis.get<Person>(`${PREFIX}:${id}`);
    return data;
  },

  /**
   * Update a person
   */
  async update(id: string, updates: Partial<Person>): Promise<Person | null> {
    const existing = await this.get(id);
    if (!existing) return null;

    const updated = { ...existing, ...updates, updatedAt: new Date() };
    const validated = personSchema.parse(updated);
    await redis.set(`${PREFIX}:${id}`, validated);
    return validated;
  },

  /**
   * Delete a person
   */
  async delete(id: string): Promise<boolean> {
    const result = await redis.del(`${PREFIX}:${id}`);
    return result > 0;
  },

  /**
   * Get all people (simple scan for demo)
   */
  async getAll(): Promise<Person[]> {
    const keys = await redis.keys(`${PREFIX}:*`);
    if (keys.length === 0) return [];

    const people = await redis.mget<Person[]>(...keys);
    return people.filter((p): p is Person => p !== null);
  },
};
