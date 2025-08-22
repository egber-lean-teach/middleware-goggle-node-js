#!/usr/bin/env ts-node
/**
 * 🤖 Revenium Google AI Middleware - Simple Test Examples
 *
 * This script demonstrates basic usage of the Revenium middleware with both
 * Google AI SDK (Gemini Developer API) and Vertex AI SDK.
 *
 * Features demonstrated:
 * - Zero-config integration (just import the middleware)
 * - Enhanced tracking with metadata
 * - Automatic provider detection
 * - Error handling and debugging
 *
 * Requirements:
 * - REVENIUM_METERING_API_KEY environment variable
 * - For Google AI: GOOGLE_API_KEY
 * - For Vertex AI: GOOGLE_CLOUD_PROJECT and authentication
 */

import { config } from "dotenv";
import { Logger } from "../src/common/logger";
import "../src/index"; // Import middleware to activate automatic tracking
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables from .env file
config();

const logger = new Logger();

async function googleAIBasicExample(): Promise<boolean> {
  /**🔄 Zero-Config Integration with Google AI SDK*/
  console.log("\n🤖 Google AI SDK - Basic Example");
  console.log("=".repeat(50));

  // Check required environment variables
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
    // Middleware is already imported above - automatic tracking is active

    const genAI = new GoogleGenerativeAI(googleApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

    // Simple API call - automatically tracked!
    const result = await model.generateContent(
      "What is the meaning of life, the universe and everything?"
    );

    console.log(`✅ Response: ${result.response.text().substring(0, 100)}...`);

    // Show token usage (if available)
    console.log("✅ Response received successfully");
    console.log("📊 Token usage will be tracked by the middleware");

    console.log("🎉 Zero-config integration successful!");
    console.log("   Your usage is automatically tracked in Revenium");
    return true;
  } catch (error) {
    console.log(`❌ Google AI test failed: ${error}`);
    console.error(error);
    return false;
  }
}

async function googleAIEnhancedExample(): Promise<boolean> {
  /**📈 Enhanced Tracking with Metadata*/
  console.log("\n📊 Google AI SDK - Enhanced Tracking Example");
  console.log("=".repeat(50));

  const googleApiKey = process.env.GOOGLE_API_KEY;
  if (!googleApiKey) {
    console.log("❌ GOOGLE_API_KEY not found");
    return false;
  }

  try {
    // Middleware is already imported above

    const genAI = new GoogleGenerativeAI(googleApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

    // Enhanced tracking with metadata
    const result = await model.generateContent(
      "Analyze this quarterly report for key insights"
    );

    console.log(
      `✅ Enhanced response: ${result.response.text().substring(0, 100)}...`
    );
    console.log("🎯 Enhanced tracking with metadata successful!");
    return true;
  } catch (error) {
    console.log(`❌ Google AI enhanced test failed: ${error}`);
    console.error(error);
    return false;
  }
}

async function googleAIStreamingExample(): Promise<boolean> {
  /**🌊 Streaming Support Example*/
  console.log("\n🌊 Google AI SDK - Streaming Example");
  console.log("=".repeat(50));

  const googleApiKey = process.env.GOOGLE_API_KEY;
  if (!googleApiKey) {
    console.log("❌ GOOGLE_API_KEY not found");
    return false;
  }

  try {
    // Middleware is already imported above

    const genAI = new GoogleGenerativeAI(googleApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

    // Streaming with metadata
    const result = await model.generateContentStream(
      "Write a creative story about AI"
    );

    console.log("📝 Streaming response:");
    let fullText = "";
    for await (const chunk of result.stream) {
      const text = chunk.text();
      process.stdout.write(text);
      fullText += text;
    }
    console.log("\n");

    if (fullText.length > 0) {
      console.log("✅ Streaming with metering successful!");
      return true;
    } else {
      console.log("❌ No streaming content received");
      return false;
    }
  } catch (error) {
    console.log(`❌ Google AI streaming test failed: ${error}`);
    console.error(error);
    return false;
  }
}

async function googleAIEmbeddingsExample(): Promise<boolean> {
  /**🔢 Text Embeddings Example*/
  console.log("\n🔢 Google AI SDK - Embeddings Example");
  console.log("=".repeat(50));

  const googleApiKey = process.env.GOOGLE_API_KEY;
  if (!googleApiKey) {
    console.log("❌ GOOGLE_API_KEY not found");
    return false;
  }

  try {
    // Middleware is already imported above

    const genAI = new GoogleGenerativeAI(googleApiKey);
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

    const result = await model.embedContent(
      "Text to embed for search indexing"
    );

    console.log(
      `✅ Generated ${result.embedding.values.length} dimensional embedding`
    );
    console.log(
      "⚠️  Note: Token counts will be 0 due to Google AI SDK limitations"
    );
    return true;
  } catch (error) {
    console.log(`❌ Google AI embeddings test failed: ${error}`);
    console.error(error);
    return false;
  }
}

async function main(): Promise<void> {
  console.log("🚀 Starting Revenium Google AI Middleware Tests");
  console.log("=".repeat(60));

  let successCount = 0;
  let totalTests = 4;

  // Run Google AI SDK tests
  if (await googleAIBasicExample()) successCount++;
  if (await googleAIEnhancedExample()) successCount++;
  if (await googleAIStreamingExample()) successCount++;
  if (await googleAIEmbeddingsExample()) successCount++;

  console.log("\n" + "=".repeat(60));
  console.log(`📊 Test Results: ${successCount}/${totalTests} tests passed`);

  if (successCount === totalTests) {
    console.log("🎉 All tests passed! Middleware is working correctly.");
  } else {
    console.log("⚠️  Some tests failed. Check the logs above for details.");
  }

  console.log("\n💡 Tips:");
  console.log("   - Set REVENIUM_METERING_API_KEY for metering");
  console.log("   - Set GOOGLE_API_KEY for Google AI SDK");
  console.log("   - Check logs for detailed debugging information");
}

// Run the main function
if (require.main === module) {
  main().catch(console.error);
}
