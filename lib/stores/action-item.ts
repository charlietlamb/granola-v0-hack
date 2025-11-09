import { redis } from "@/lib/redis";
import { type ActionItem, actionItemSchema } from "@/lib/types/meeting";

const PREFIX = "action_item";

export const actionItemStore = {
  /**
   * Create a new action item
   */
  async create(actionItem: ActionItem): Promise<ActionItem> {
    const validated = actionItemSchema.parse(actionItem);
    await redis.set(`${PREFIX}:${validated.id}`, validated);
    return validated;
  },

  /**
   * Get an action item by ID
   */
  async get(id: string): Promise<ActionItem | null> {
    const data = await redis.get<ActionItem>(`${PREFIX}:${id}`);
    return data;
  },

  /**
   * Update an action item
   */
  async update(
    id: string,
    updates: Partial<ActionItem>
  ): Promise<ActionItem | null> {
    const existing = await this.get(id);
    if (!existing) return null;

    const updated = { ...existing, ...updates, updatedAt: new Date() };
    const validated = actionItemSchema.parse(updated);
    await redis.set(`${PREFIX}:${id}`, validated);
    return validated;
  },

  /**
   * Delete an action item
   */
  async delete(id: string): Promise<boolean> {
    const result = await redis.del(`${PREFIX}:${id}`);
    return result > 0;
  },

  /**
   * Get all action items
   */
  async getAll(): Promise<ActionItem[]> {
    const keys = await redis.keys(`${PREFIX}:*`);
    if (keys.length === 0) return [];

    const items = await redis.mget<ActionItem[]>(...keys);
    return items.filter((item): item is ActionItem => item !== null);
  },

  /**
   * Get action items by meeting ID
   */
  async getByMeetingId(meetingId: string): Promise<ActionItem[]> {
    const all = await this.getAll();
    return all.filter((item) => item.meetingId === meetingId);
  },

  /**
   * Get action items by objective ID
   */
  async getByObjectiveId(objectiveId: string): Promise<ActionItem[]> {
    const all = await this.getAll();
    return all.filter((item) => item.objectiveId === objectiveId);
  },
};
