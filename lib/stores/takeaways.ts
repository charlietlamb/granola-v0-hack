import { redis } from "@/lib/redis";
import { type Takeaways, takeawaysSchema } from "@/lib/types/meeting";

const PREFIX = "takeaways";

export const takeawaysStore = {
  /**
   * Create new takeaways
   */
  async create(takeaways: Takeaways): Promise<Takeaways> {
    const validated = takeawaysSchema.parse(takeaways);
    await redis.set(`${PREFIX}:${validated.id}`, validated);
    return validated;
  },

  /**
   * Get takeaways by ID
   */
  async get(id: string): Promise<Takeaways | null> {
    const data = await redis.get<Takeaways>(`${PREFIX}:${id}`);
    return data;
  },

  /**
   * Update takeaways
   */
  async update(
    id: string,
    updates: Partial<Takeaways>
  ): Promise<Takeaways | null> {
    const existing = await this.get(id);
    if (!existing) return null;

    const updated = { ...existing, ...updates };
    const validated = takeawaysSchema.parse(updated);
    await redis.set(`${PREFIX}:${id}`, validated);
    return validated;
  },

  /**
   * Delete takeaways
   */
  async delete(id: string): Promise<boolean> {
    const result = await redis.del(`${PREFIX}:${id}`);
    return result > 0;
  },

  /**
   * Get all takeaways
   */
  async getAll(): Promise<Takeaways[]> {
    const keys = await redis.keys(`${PREFIX}:*`);
    if (keys.length === 0) return [];

    const takeaways = await redis.mget<Takeaways[]>(...keys);
    return takeaways.filter((t): t is Takeaways => t !== null);
  },

  /**
   * Get takeaways by meeting ID
   */
  async getByMeetingId(meetingId: string): Promise<Takeaways | null> {
    const all = await this.getAll();
    return all.find((t) => t.meetingId === meetingId) || null;
  },
};
