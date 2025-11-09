#!/usr/bin/env bun

import { redis } from "@/lib/redis";
import {
  personStore,
  meetingStore,
  objectiveStore,
  actionItemStore,
  agendaStore,
  meetingNoteStore,
  takeawaysStore,
} from "@/lib/stores";
import {
  seedPeople,
  seedObjectives,
  seedMeetings,
  seedActionItems,
  seedAgendas,
  seedMeetingNotes,
  seedTakeaways,
} from "@/lib/constants/seed-data";

async function clearDatabase() {
  console.log("🗑️  Clearing existing data...");

  const prefixes = [
    "person:*",
    "objective:*",
    "meeting:*",
    "action_item:*",
    "agenda:*",
    "meeting_note:*",
    "takeaways:*",
  ];

  for (const prefix of prefixes) {
    const keys = await redis.keys(prefix);
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`   Deleted ${keys.length} ${prefix.replace(":*", "")} records`);
    }
  }

  console.log("✅ Database cleared\n");
}

async function seedDatabase() {
  console.log("🌱 Seeding database...\n");

  try {
    // Seed People
    console.log("👥 Creating people...");
    for (const person of seedPeople) {
      await personStore.create(person);
      console.log(`   ✓ ${person.name}`);
    }

    // Seed Objectives
    console.log("\n🎯 Creating objectives...");
    for (const objective of seedObjectives) {
      await objectiveStore.create(objective);
      console.log(`   ✓ ${objective.name}`);
    }

    // Seed Agendas
    console.log("\n📋 Creating agendas...");
    for (const agenda of seedAgendas) {
      await agendaStore.create(agenda);
      console.log(`   ✓ Agenda ${agenda.id.slice(0, 8)}...`);
    }

    // Seed Meeting Notes
    console.log("\n📝 Creating meeting notes...");
    for (const note of seedMeetingNotes) {
      await meetingNoteStore.create(note);
      console.log(`   ✓ Note ${note.id.slice(0, 8)}...`);
    }

    // Seed Takeaways
    console.log("\n💡 Creating takeaways...");
    for (const takeaway of seedTakeaways) {
      await takeawaysStore.create(takeaway);
      console.log(`   ✓ Takeaway ${takeaway.id.slice(0, 8)}...`);
    }

    // Seed Meetings
    console.log("\n🤝 Creating meetings...");
    for (const meeting of seedMeetings) {
      await meetingStore.create(meeting);
      console.log(`   ✓ ${meeting.name}`);
    }

    // Seed Action Items
    console.log("\n✅ Creating action items...");
    for (const actionItem of seedActionItems) {
      await actionItemStore.create(actionItem);
      console.log(`   ✓ ${actionItem.item.slice(0, 50)}...`);
    }

    console.log("\n✅ Database seeded successfully!\n");
  } catch (error) {
    console.error("\n❌ Error seeding database:", error);
    process.exit(1);
  }
}

async function printSummary() {
  console.log("📊 Summary:");
  console.log(`   • ${seedPeople.length} people`);
  console.log(`   • ${seedObjectives.length} objectives`);
  console.log(`   • ${seedMeetings.length} meetings`);
  console.log(`   • ${seedActionItems.length} action items`);
  console.log(`   • ${seedAgendas.length} agendas`);
  console.log(`   • ${seedMeetingNotes.length} meeting notes`);
  console.log(`   • ${seedTakeaways.length} takeaways`);
  console.log("\n🚀 Ready to go!\n");
}

async function main() {
  console.log("\n🔄 Starting database seed...\n");

  await clearDatabase();
  await seedDatabase();
  await printSummary();

  process.exit(0);
}

main();
