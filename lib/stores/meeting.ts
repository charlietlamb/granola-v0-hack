import { redis } from "@/lib/redis";
import { type Meeting, meetingSchema } from "@/lib/types/meeting";

const PREFIX = "meeting";

export const meetingStore = {
  /**
   * Create a new meeting
   */
  async create(meeting: Meeting): Promise<Meeting> {
    const validated = meetingSchema.parse(meeting);
    await redis.set(`${PREFIX}:${validated.id}`, validated);
    return validated;
  },

  /**
   * Get a meeting by ID
   */
  async get(id: string): Promise<Meeting | null> {
    const data = await redis.get<Meeting>(`${PREFIX}:${id}`);
    return data;
  },

  /**
   * Update a meeting
   */
  async update(id: string, updates: Partial<Meeting>): Promise<Meeting | null> {
    const existing = await this.get(id);
    if (!existing) return null;

    const updated = { ...existing, ...updates, updatedAt: new Date() };
    const validated = meetingSchema.parse(updated);
    await redis.set(`${PREFIX}:${id}`, validated);
    return validated;
  },

  /**
   * Delete a meeting
   */
  async delete(id: string): Promise<boolean> {
    const result = await redis.del(`${PREFIX}:${id}`);
    return result > 0;
  },

  /**
   * Get all meetings
   */
  async getAll(): Promise<Meeting[]> {
    const keys = await redis.keys(`${PREFIX}:*`);
    if (keys.length === 0) return [];

    const meetings = await redis.mget<Meeting[]>(...keys);
    return meetings.filter((m): m is Meeting => m !== null);
  },

  /**
   * Get meetings by objective ID
   */
  async getByObjectiveId(objectiveId: string): Promise<Meeting[]> {
    const all = await this.getAll();
    return all.filter((meeting) => meeting.objectiveId === objectiveId);
  },

  /**
   * Get meetings by status
   */
  async getByStatus(
    status: "scheduled" | "in_progress" | "completed" | "cancelled"
  ): Promise<Meeting[]> {
    const all = await this.getAll();
    return all.filter((meeting) => meeting.status === status);
  },
};
