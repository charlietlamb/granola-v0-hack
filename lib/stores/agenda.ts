import { redis } from "@/lib/redis";
import { type Agenda, agendaSchema } from "@/lib/types/meeting";

const PREFIX = "agenda";

export const agendaStore = {
  /**
   * Create a new agenda
   */
  async create(agenda: Agenda): Promise<Agenda> {
    const validated = agendaSchema.parse(agenda);
    await redis.set(`${PREFIX}:${validated.id}`, validated);
    return validated;
  },

  /**
   * Get an agenda by ID
   */
  async get(id: string): Promise<Agenda | null> {
    const data = await redis.get<Agenda>(`${PREFIX}:${id}`);
    return data;
  },

  /**
   * Update an agenda
   */
  async update(id: string, updates: Partial<Agenda>): Promise<Agenda | null> {
    const existing = await this.get(id);
    if (!existing) return null;

    const updated = { ...existing, ...updates };
    const validated = agendaSchema.parse(updated);
    await redis.set(`${PREFIX}:${id}`, validated);
    return validated;
  },

  /**
   * Delete an agenda
   */
  async delete(id: string): Promise<boolean> {
    const result = await redis.del(`${PREFIX}:${id}`);
    return result > 0;
  },

  /**
   * Get all agendas
   */
  async getAll(): Promise<Agenda[]> {
    const keys = await redis.keys(`${PREFIX}:*`);
    if (keys.length === 0) return [];

    const agendas = await redis.mget<Agenda[]>(...keys);
    return agendas.filter((a): a is Agenda => a !== null);
  },

  /**
   * Get agenda by meeting ID
   */
  async getByMeetingId(meetingId: string): Promise<Agenda | null> {
    const all = await this.getAll();
    return all.find((agenda) => agenda.meetingId === meetingId) || null;
  },
};
