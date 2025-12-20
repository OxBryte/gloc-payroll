const { execSync } = require("child_process");

function hasChanges() {
  try {
    const status = execSync("git status --porcelain").toString();
    return status.trim().length > 0;
  } catch (e) {
    console.error("Error checking git status:", e);
    return false;
  }
}

function doCommit() {
  if (!hasChanges()) {
    console.log("[auto-commit] No changes to commit.");
    return;
  }
  const timestamp = new Date()
    .toISOString()
    .replace("T", " ")
    .replace(/\..+/, "");
  try {
    execSync("git add -A", { stdio: "inherit" });
    execSync(`git commit -m "feat: update"`, { stdio: "inherit" });
    console.log(`[auto-commit] Committed changes at ${timestamp}`);
  } catch (e) {
    console.error("[auto-commit] Error during commit:", e);
  }
}

// Initial commit on startup
console.log("[auto-commit] Checking for changes on startup...");
doCommit();

// Commit every 3 minutes
setInterval(() => {
  console.log("[auto-commit] Checking for changes...");
  doCommit();
}, 1 * 60 * 1000);



// New code 

// #!/usr/bin/env node

// const { execSync } = require("child_process");
// const fs = require("fs");
// const path = require("path");

// // Auto-commit script that runs every 2 minutes
// class AutoCommitter {
//   constructor() {
//     this.isRunning = false;
//     this.interval = null;
//     this.commitInterval = 2 * 60 * 1000; // 2 minutes in milliseconds
//   }

//   // Get current timestamp
//   getTimestamp() {
//     return new Date().toLocaleString();
//   }

//   // Check if there are changes to commit
//   hasChanges() {
//     try {
//       const status = execSync("git status --porcelain", { encoding: "utf8" });
//       return status.trim().length > 0;
//     } catch (error) {
//       console.log("❌ Error checking git status:", error.message);
//       return false;
//     }
//   }

//   // Check if remote repository exists
//   hasRemote() {
//     try {
//       const remotes = execSync("git remote -v", { encoding: "utf8" });
//       return remotes.includes("origin");
//     } catch (error) {
//       return false;
//     }
//   }

//   // Perform the commit
//   async commit() {
//     try {
//       console.log(`\n🔄 [${this.getTimestamp()}] Checking for changes...`);

//       if (!this.hasChanges()) {
//         console.log("📝 No changes to commit. Working tree is clean.");
//         return;
//       }

//       console.log("🔄 Changes detected, committing...");

//       // Add all changes
//       execSync("git add .", { stdio: "inherit" });

//       // Commit with timestamp
//       const commitMessage = `Auto-commit: ${this.getTimestamp()} - Portfolio updates`;
//       execSync(`git commit -m "${commitMessage}"`, { stdio: "inherit" });

//       // Push to remote if it exists
//       if (this.hasRemote()) {
//         console.log("🚀 Pushing to remote repository...");
//         execSync("git push origin main", { stdio: "inherit" });
//       } else {
//         console.log(
//           "⚠️  No remote repository configured. Changes committed locally."
//         );
//       }

//       console.log("✅ Auto-commit and pushed completed successfully!");
//     } catch (error) {
//       console.log("❌ Error during commit:", error.message);
//     }
//   }

//   // Start the auto-commit process
//   start() {
//     if (this.isRunning) {
//       console.log("⚠️  Auto-commit is already running!");
//       return;
//     }

//     console.log("🚀 Starting auto-commit process...");
//     console.log(
//       `⏰ Will commit every ${this.commitInterval / 1000 / 60} minutes`
//     );
//     console.log("Press Ctrl+C to stop\n");

//     this.isRunning = true;

//     // Run initial commit
//     this.commit();

//     // Set up interval for continuous commits
//     this.interval = setInterval(() => {
//       this.commit();
//     }, this.commitInterval);
//   }

//   // Stop the auto-commit process
//   stop() {
//     if (this.interval) {
//       clearInterval(this.interval);
//       this.interval = null;
//     }
//     this.isRunning = false;
//     console.log("\n🛑 Auto-commit process stopped.");
//   }
// }

// // Handle graceful shutdown
// process.on("SIGINT", () => {
//   console.log("\n🛑 Received SIGINT, shutting down gracefully...");
//   if (autoCommitter) {
//     autoCommitter.stop();
//   }
//   process.exit(0);
// });

// process.on("SIGTERM", () => {
//   console.log("\n🛑 Received SIGTERM, shutting down gracefully...");
//   if (autoCommitter) {
//     autoCommitter.stop();
//   }
//   process.exit(0);
// });

// // Start the auto-committer
// const autoCommitter = new AutoCommitter();
// autoCommitter.start();
