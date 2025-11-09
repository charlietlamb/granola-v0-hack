import { redis } from "@/lib/redis";
import * as fs from "fs";
import * as path from "path";

async function restoreRedis() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("❌ Please provide a backup file path");
    console.log("\nUsage: bun run scripts/restore-redis.ts <backup-file>");
    console.log("Example: bun run scripts/restore-redis.ts backups/redis-backup-2025-01-09T12-00-00-000Z.json");
    process.exit(1);
  }

  const backupFile = args[0];
  const backupPath = path.isAbsolute(backupFile)
    ? backupFile
    : path.join(process.cwd(), backupFile);

  console.log("🔄 Starting Redis restore...");
  console.log(`📁 Backup file: ${backupPath}`);

  try {
    // Check if backup file exists
    if (!fs.existsSync(backupPath)) {
      console.error(`❌ Backup file not found: ${backupPath}`);
      process.exit(1);
    }

    // Read backup file
    const backupContent = fs.readFileSync(backupPath, "utf-8");
    const backup: Record<string, any> = JSON.parse(backupContent);

    const keys = Object.keys(backup);
    console.log(`📊 Found ${keys.length} keys in backup`);

    // Ask for confirmation
    console.log("\n⚠️  WARNING: This will overwrite existing data in Redis!");
    console.log("Press Ctrl+C to cancel or wait 3 seconds to continue...\n");

    await new Promise(resolve => setTimeout(resolve, 3000));

    let restored = 0;
    let failed = 0;

    // Restore all data
    for (const key of keys) {
      try {
        await redis.set(key, backup[key]);
        restored++;
        if (restored % 10 === 0) {
          console.log(`⏳ Restored ${restored}/${keys.length} keys...`);
        }
      } catch (error) {
        console.error(`❌ Failed to restore key: ${key}`, error);
        failed++;
      }
    }

    console.log("\n✅ Restore completed!");
    console.log(`💾 Successfully restored: ${restored} keys`);
    if (failed > 0) {
      console.log(`⚠️  Failed: ${failed} keys`);
    }

    // Print summary
    const stats = {
      totalKeys: keys.length,
      restored,
      failed,
      backupFile: backupPath,
      restoredAt: new Date().toISOString(),
    };

    console.log("\n📋 Restore Summary:");
    console.log(JSON.stringify(stats, null, 2));
  } catch (error) {
    console.error("❌ Restore failed:", error);
    process.exit(1);
  }
}

restoreRedis();
