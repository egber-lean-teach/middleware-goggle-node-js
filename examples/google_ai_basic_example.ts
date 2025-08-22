import { config } from "dotenv";
import "../src/index"; // Import middleware to activate automatic tracking
import { GoogleGenerativeAI } from "@google/generative-ai";
import readline from "readline";

config();

async function googleAIBasicExample(): Promise<boolean> {
  let content: string = "";
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  content = await new Promise((resolve) => {
    rl.question("Enter the content to be sent to the AI model: ", (content) => {
      resolve(content);
    });
  });
  rl.close();

  console.log("\n🤖 Google AI SDK - Basic Example");
  console.log("=".repeat(50));

  const googleApiKey = process.env.GOOGLE_API_KEY;
  const reveniumKey = process.env.REVENIUM_METERING_API_KEY;

  if (!googleApiKey) {
    console.log("❌ GOOGLE_API_KEY not found");
    console.log("   Set: export GOOGLE_API_KEY=your-google-api-key");
    return false;
  }

  if (!reveniumKey) {
    console.log("⚠️  REVENIUM_METERING_API_KEY not found - metering will fail");
    console.log("   Set: export REVENIUM_METERING_API_KEY=your-revenium-key");
  }

  console.log(`✅ Google API Key: ${googleApiKey.substring(0, 10)}...`);
  if (reveniumKey) {
    console.log(`✅ Revenium Key: ${reveniumKey.substring(0, 10)}...`);
  }

  try {
    console.log("🔍 Creating GoogleGenerativeAI instance...");
    const genAI = new GoogleGenerativeAI(googleApiKey);

    console.log("🔍 Getting generative model...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

    console.log(
      "🔍 Calling generateContent (should be intercepted by middleware)..."
    );
    const result = await model.generateContent(content);

    console.log(`✅ Response: ${result.response.text().substring(0, 100)}...`);
    console.log("✅ Response received successfully");

    return true;
  } catch (error) {
    console.log(`❌ Google AI test failed: ${error}`);
    console.error(error);
    return false;
  }
}

googleAIBasicExample();
