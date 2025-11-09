import * as fs from "fs";
import * as path from "path";
import { redis } from "@/lib/redis";

async function backupRedis() {
  console.log("🔄 Starting Redis backup...");

  try {
    // Get all keys
    const keys = await redis.keys("*");
    console.log(`📊 Found ${keys.length} keys`);

    const backup: Record<string, any> = {};

    // Fetch all data
    for (const key of keys) {
      const value = await redis.get(key);
      backup[key] = value;
    }

    // Create backup filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupDir = path.join(process.cwd(), "backups");
    const backupFile = path.join(backupDir, `redis-backup-${timestamp}.json`);

    // Create backups directory if it doesn't exist
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Write backup to file
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));

    console.log(`✅ Backup completed successfully!`);
    console.log(`📁 Backup saved to: ${backupFile}`);
    console.log(`💾 Total keys backed up: ${keys.length}`);

    // Print summary
    const stats = {
      totalKeys: keys.length,
      backupFile,
      timestamp: new Date().toISOString(),
    };

    console.log("\n📋 Backup Summary:");
    console.log(JSON.stringify(stats, null, 2));
  } catch (error) {
    console.error("❌ Backup failed:", error);
    process.exit(1);
  }
}

backupRedis();
