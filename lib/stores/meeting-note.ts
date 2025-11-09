import { redis } from "@/lib/redis";
import { type MeetingNote, meetingNoteSchema } from "@/lib/types/meeting";

const PREFIX = "meeting_note";

export const meetingNoteStore = {
  /**
   * Create a new meeting note
   */
  async create(note: MeetingNote): Promise<MeetingNote> {
    const validated = meetingNoteSchema.parse(note);
    await redis.set(`${PREFIX}:${validated.id}`, validated);
    return validated;
  },

  /**
   * Get a meeting note by ID
   */
  async get(id: string): Promise<MeetingNote | null> {
    const data = await redis.get<MeetingNote>(`${PREFIX}:${id}`);
    return data;
  },

  /**
   * Update a meeting note
   */
  async update(
    id: string,
    updates: Partial<MeetingNote>
  ): Promise<MeetingNote | null> {
    const existing = await this.get(id);
    if (!existing) return null;

    const updated = { ...existing, ...updates };
    const validated = meetingNoteSchema.parse(updated);
    await redis.set(`${PREFIX}:${id}`, validated);
    return validated;
  },

  /**
   * Delete a meeting note
   */
  async delete(id: string): Promise<boolean> {
    const result = await redis.del(`${PREFIX}:${id}`);
    return result > 0;
  },

  /**
   * Get all meeting notes
   */
  async getAll(): Promise<MeetingNote[]> {
    const keys = await redis.keys(`${PREFIX}:*`);
    if (keys.length === 0) return [];

    const notes = await redis.mget<MeetingNote[]>(...keys);
    return notes.filter((n): n is MeetingNote => n !== null);
  },

  /**
   * Get meeting note by meeting ID
   */
  async getByMeetingId(meetingId: string): Promise<MeetingNote | null> {
    const all = await this.getAll();
    return all.find((note) => note.meetingId === meetingId) || null;
  },
};
