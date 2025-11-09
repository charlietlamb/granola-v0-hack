import { redis } from "@/lib/redis";
import { type Objective, objectiveSchema } from "@/lib/types/meeting";

const PREFIX = "objective";

export const objectiveStore = {
  /**
   * Create a new objective
   */
  async create(objective: Objective): Promise<Objective> {
    const validated = objectiveSchema.parse(objective);
    await redis.set(`${PREFIX}:${validated.id}`, validated);
    return validated;
  },

  /**
   * Get an objective by ID
   */
  async get(id: string): Promise<Objective | null> {
    const data = await redis.get<Objective>(`${PREFIX}:${id}`);
    return data;
  },

  /**
   * Update an objective
   */
  async update(
    id: string,
    updates: Partial<Objective>
  ): Promise<Objective | null> {
    const existing = await this.get(id);
    if (!existing) return null;

    const updated = { ...existing, ...updates, updatedAt: new Date() };
    const validated = objectiveSchema.parse(updated);
    await redis.set(`${PREFIX}:${id}`, validated);
    return validated;
  },

  /**
   * Delete an objective
   */
  async delete(id: string): Promise<boolean> {
    const result = await redis.del(`${PREFIX}:${id}`);
    return result > 0;
  },

  /**
   * Get all objectives
   */
  async getAll(): Promise<Objective[]> {
    const keys = await redis.keys(`${PREFIX}:*`);
    if (keys.length === 0) return [];

    const objectives = await redis.mget<Objective[]>(...keys);
    return objectives.filter((obj): obj is Objective => obj !== null);
  },
};
