# 🤖 Revenium Middleware for Google AI (Node.js/TypeScript)

[![npm version](https://img.shields.io/npm/v/revenium-middleware-google-nodejs.svg)](https://www.npmjs.com/package/revenium-middleware-google-nodejs)
[![Node.js Version](https://img.shields.io/node/v/revenium-middleware-google-nodejs.svg)](https://nodejs.org/)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

A middleware library for metering and monitoring Google AI services usage in Node.js applications. Supports both Google AI SDK (Gemini Developer API) and Vertex AI SDK with flexible optional dependencies. 🚀✨

## ✨ Features

- **📊 Precise Usage Tracking**: Monitor tokens, costs, and request counts for Google AI services
- **🔌 Seamless Integration**: Drop-in middleware that works with minimal code changes
- **🎯 Dual SDK Support**: Choose between Google AI SDK or Vertex AI SDK based on your needs
- **📦 Optional Dependencies**: Install only the SDK components you need
- **🌊 Streaming Support**: Full support for streaming responses (both SDKs)
- **🔢 Enhanced Token Counting**: Complete token tracking including embeddings (Vertex AI)
- **⚙️ Flexible Configuration**: Customize metering behavior to suit your application needs
- **🔄 TypeScript Support**: Full TypeScript support with type definitions

## 🎯 What's Supported

| Feature               | Google AI SDK      | Vertex AI SDK          |
| --------------------- | ------------------ | ---------------------- |
| **Chat Completion**   | ✅ Full support    | ✅ Full support        |
| **Streaming**         | ✅ Full support    | ✅ Full support        |
| **Text Embeddings**   | ✅ Basic support\* | ✅ Full support        |
| **Token Metering**    | ✅ Chat/Streaming  | ✅ All operations      |
| **Metadata Tracking** | ✅ Full support    | ✅ Full support        |
| **Setup Complexity**  | Simple (API key)   | Moderate (GCP project) |

**Note**: \*Google AI SDK embeddings don't return token counts due to API limitations, but requests are still tracked.

## 📥 Installation

Choose the SDK variant that best fits your needs:

```bash
# Google AI SDK only (Gemini Developer API)
npm install revenium-middleware-google-nodejs @google/generative-ai

# Vertex AI SDK only (recommended for production)
npm install revenium-middleware-google-nodejs @google-cloud/aiplatform

# Both SDKs (maximum flexibility)
npm install revenium-middleware-google-nodejs @google/generative-ai @google-cloud/aiplatform
```

### 🤔 Which SDK Should I Choose?

| Use Case                        | Recommended SDK | Why                                                                   |
| ------------------------------- | --------------- | --------------------------------------------------------------------- |
| **Quick prototyping**           | Google AI SDK   | Simple API key setup, but does NOT support token counts on embeddings |
| **Production applications**     | Vertex AI SDK   | Full token counting, enterprise features                              |
| **Embeddings-heavy workloads**  | Vertex AI SDK   | Complete token tracking for embeddings                                |
| **Enterprise/GCP environments** | Vertex AI SDK   | Advanced Google Cloud integration                                     |
| **Simple chat applications**    | Either SDK      | Both provide full chat support                                        |

**💡 Recommendation**: Use Vertex AI SDK for production applications that need comprehensive token counting and advanced features.

## 🔧 Usage

### 🔄 Zero-Config Integration

Simply export your REVENIUM_METERING_API_KEY and import the middleware.
Your Google AI calls will be metered automatically:

#### Google AI SDK (Gemini Developer API)

```typescript
import "revenium-middleware-google-nodejs";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

const result = await model.generateContent(
  "What is the meaning of life, the universe and everything?"
);
console.log(result.response.text());
```

#### Vertex AI SDK

```typescript
import "revenium-middleware-google-nodejs";
import { VertexAI } from "@google-cloud/aiplatform";

const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT!,
  location: process.env.GOOGLE_CLOUD_LOCATION || "us-central1",
});

const model = vertexAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
const result = await model.generateContent(
  "What is the meaning of life, the universe and everything?"
);
console.log(result.response.text());
```

The middleware automatically intercepts Google AI API calls and sends metering data to Revenium without requiring any
changes to your existing code. Make sure to set the `REVENIUM_METERING_API_KEY` environment variable for authentication
with the Revenium service.

### 📈 Enhanced Tracking with Metadata

For more granular usage tracking and detailed reporting, add the `usageMetadata` parameter:

#### Google AI SDK with Metadata

```typescript
import "revenium-middleware-google-nodejs";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

const result = await model.generateContent({
  contents: "Analyze this quarterly report for key insights",
  usageMetadata: {
    traceId: "conv-28a7e9d4",
    taskType: "document-analysis",
    subscriberEmail: "user@example.com",
    subscriberId: "user-12345",
    organizationId: "acme-corp",
    subscriptionId: "premium-plan",
    productId: "business-intelligence",
    agent: "report-analyzer-v2",
  },
});
console.log(result.response.text());
```

#### Vertex AI SDK with Enhanced Features

```typescript
import "revenium-middleware-google-nodejs";
import { VertexAI } from "@google-cloud/aiplatform";

const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT!,
  location: process.env.GOOGLE_CLOUD_LOCATION || "us-central1",
});

const model = vertexAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

// Set metadata on the model instance for automatic tracking
(model as any)._reveniumUsageMetadata = {
  traceId: "conv-28a7e9d4",
  taskType: "document-analysis",
  organizationId: "acme-corp",
  productId: "business-intelligence",
};

const result = await model.generateContent(
  "Analyze this quarterly report for key insights"
);
console.log(result.response.text());
// ✨ Full token counting including embeddings!
```

## 🎯 SDK-Specific Integration

### 🔍 Automatic Provider Detection

The middleware automatically chooses between Google AI SDK and Vertex AI SDK:

| Detection Method  | When Used                                            | Example                                                      |
| ----------------- | ---------------------------------------------------- | ------------------------------------------------------------ |
| **Google AI SDK** | When `@google/generative-ai` is imported and used    | `import { GoogleGenerativeAI } from '@google/generative-ai'` |
| **Vertex AI SDK** | When `@google-cloud/aiplatform` is imported and used | `import { VertexAI } from '@google-cloud/aiplatform'`        |
| **Dual Support**  | When both SDKs are available                         | Automatic routing based on usage                             |

**Key Point**: Both SDKs report as "Google" provider for unified analytics and consistent reporting.

### 💡 Quick Start Examples

#### Basic Usage (Google AI SDK)

```typescript
import "revenium-middleware-google-nodejs";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
const result = await model.generateContent("Hello from Google AI SDK!");
// Automatically metered with provider="Google"
```

#### Basic Usage (Vertex AI SDK)

```typescript
import "revenium-middleware-google-nodejs";
import { VertexAI } from "@google-cloud/aiplatform";

const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT!,
  location: process.env.GOOGLE_CLOUD_LOCATION || "us-central1",
});
const model = vertexAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
const result = await model.generateContent("Hello from Vertex AI SDK!");
// Automatically metered with provider="Google" + enhanced token counting
```

## 🌊 Streaming Support

The middleware supports streaming responses for both SDKs with identical interfaces:

### Google AI SDK Streaming

```typescript
import "revenium-middleware-google-nodejs";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

const result = await model.generateContentStream({
  contents: "Write a creative story about AI",
  usageMetadata: {
    organizationId: "creative-studio",
    taskType: "creative-writing",
  },
});

for await (const chunk of result.stream) {
  process.stdout.write(chunk.text());
}
// Usage tracking happens automatically when stream completes
```

### Vertex AI SDK Streaming

```typescript
import "revenium-middleware-google-nodejs";
import { VertexAI } from "@google-cloud/aiplatform";

const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT!,
  location: process.env.GOOGLE_CLOUD_LOCATION || "us-central1",
});

const model = vertexAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

// Set metadata on model instance
(model as any)._reveniumUsageMetadata = {
  organizationId: "creative-studio",
  taskType: "creative-writing",
};

const result = await model.generateContent({
  contents: "Write a creative story about AI",
  stream: true,
});

for await (const chunk of result.stream) {
  process.stdout.write(chunk.text());
}
// Enhanced usage tracking with full token counting
```

## 🔢 Text Embeddings

### Google AI SDK Embeddings (Basic Support)

```typescript
import "revenium-middleware-google-nodejs";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getEmbeddingModel({ model: "text-embedding-004" });

const result = await model.embedContent({
  content: "Text to embed for search indexing",
  usageMetadata: {
    organizationId: "search-app",
    taskType: "document-indexing",
  },
});

console.log(
  `Generated ${result.embedding.values.length} dimensional embedding`
);
// ⚠️ Token counts will be 0 due to Google AI SDK limitations
```

### Vertex AI SDK Embeddings (Full Support)

```typescript
import "revenium-middleware-google-nodejs";
import { VertexAI } from "@google-cloud/aiplatform";

const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT!,
  location: process.env.GOOGLE_CLOUD_LOCATION || "us-central1",
});

const model = vertexAI.getEmbeddingModel({ model: "text-embedding-004" });

// Set metadata for tracking
(model as any)._reveniumUsageMetadata = {
  organizationId: "search-app",
  taskType: "document-indexing",
};

const embeddings = await model.embedContent(
  "Text to embed for search indexing"
);
console.log(
  `Generated ${embeddings.embedding.values.length} dimensional embedding`
);
// ✅ Full token counting available!
```

#### 🏷️ Metadata Fields

The `usageMetadata` parameter supports the following fields:

| Field                      | Description                                                   | Use Case                                                                                                       |
| -------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `traceId`                  | Unique identifier for a conversation or session               | Group multi-turn conversations into single event for performance & cost tracking                               |
| `taskType`                 | Classification of the AI operation by type of work            | Track cost & performance by purpose (e.g., classification, summarization)                                      |
| `subscriberEmail`          | The email address of the subscriber                           | Track cost & performance by individual users (if customer e-mail addresses are known)                          |
| `subscriberId`             | The id of the subscriber from non-Revenium systems            | Track cost & performance by individual users (if customers are anonymous or tracking by emails is not desired) |
| `subscriberCredentialName` | An alias for an API key used by one or more users             | Track cost & performance by individual API keys                                                                |
| `subscriberCredential`     | The key value associated with the subscriber (i.e an API key) | Track cost & performance by API key value (normally used when the only identifier for a user is an API key)    |
| `organizationId`           | Customer or department ID from non-Revenium systems           | Track cost & performance by customers or business units                                                        |
| `subscriptionId`           | Reference to a billing plan in non-Revenium systems           | Track cost & performance by a specific subscription                                                            |
| `productId`                | Your product or feature making the AI call                    | Track cost & performance across different products                                                             |
| `agent`                    | Identifier for the specific AI agent                          | Track cost & performance performance by AI agent                                                               |
| `responseQualityScore`     | The quality of the AI response (0..1)                         | Track AI response quality                                                                                      |

**All metadata fields are optional**. Adding them enables more detailed reporting and analytics in Revenium.

## 🚀 Quick Start & Examples

### 📁 Example Scripts

This repository includes comprehensive example scripts demonstrating all features:

#### 🔧 Available Scripts

```bash
# Run the main test suite
npm run simple-test

# Build the project
npm run build

# Development mode with watch
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Clean build artifacts
npm run clean
```

#### 📝 Example Files

- **`examples/simple-test.ts`** - Comprehensive test suite covering all features
- **`examples/simple-test.js`** - JavaScript version of the test suite

### 🎯 Running Examples

1. **Set up environment variables:**

   ```bash
   # Create .env file
   cp .env.example .env

   # Edit .env with your keys
   REVENIUM_METERING_API_KEY=your_revenium_key
   GOOGLE_API_KEY=your_google_key
   GOOGLE_CLOUD_PROJECT=your_gcp_project
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the test suite:**
   ```bash
   npm run simple-test
   ```

### 🔍 What the Examples Demonstrate

The example scripts showcase:

- **Zero-config integration** with both Google AI and Vertex AI SDKs
- **Enhanced tracking** with metadata for detailed analytics
- **Streaming support** for real-time responses
- **Text embeddings** with both SDKs
- **Error handling** and debugging information
- **Automatic provider detection** and routing

## ⚙️ Configuration

Configure the middleware using environment variables:

### 🔑 Required Environment Variables

#### For Google AI SDK (Gemini Developer API)

```bash
# Required
export REVENIUM_METERING_API_KEY=your_revenium_api_key
export GOOGLE_API_KEY=your_google_api_key

# Optional
export REVENIUM_METERING_BASE_URL=https://api.revenium.io/meter/v2
export REVENIUM_LOG_LEVEL=INFO
```

#### For Vertex AI SDK (Google Cloud)

```bash
# Required
export REVENIUM_METERING_API_KEY=your_revenium_api_key
export GOOGLE_CLOUD_PROJECT=your_gcp_project_id

# Recommended
export GOOGLE_CLOUD_LOCATION=us-central1

# Google Cloud Authentication (choose one)
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
# OR use: gcloud auth application-default login

# Optional
export REVENIUM_METERING_BASE_URL=https://api.revenium.io/meter/v2
export REVENIUM_LOG_LEVEL=INFO
```

### 📄 Using .env File

Create a `.env` file in your project root:

```bash
# Required for all configurations
REVENIUM_METERING_API_KEY=your_revenium_api_key

# For Google AI SDK
GOOGLE_API_KEY=your_google_api_key

# For Vertex AI SDK
GOOGLE_CLOUD_PROJECT=your_gcp_project_id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json

# Optional settings
REVENIUM_METERING_BASE_URL=https://api.revenium.io/meter/v2
REVENIUM_LOG_LEVEL=DEBUG
```

### 🔐 Google Cloud Authentication

The Vertex AI SDK uses the standard Google Cloud authentication chain:

1. **Service Account Key File** (recommended for production):

   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
   ```

2. **Application Default Credentials** (for development):

   ```bash
   gcloud auth application-default login
   ```

3. **Compute Engine/GKE Service Account** (automatic in GCP environments)

4. **Environment Variables**:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
   ```

Ensure your credentials have the following permissions:

- `aiplatform.endpoints.predict`
- `ml.projects.predict` (for some models)

### 📊 Configuration Variables

| Variable                         | Required | SDK       | Description                                    |
| -------------------------------- | -------- | --------- | ---------------------------------------------- |
| `REVENIUM_METERING_API_KEY`      | Yes      | Both      | Your Revenium API key                          |
| `GOOGLE_API_KEY`                 | Yes      | Google AI | Google AI API key (Gemini Developer API)       |
| `GOOGLE_CLOUD_PROJECT`           | Yes      | Vertex AI | Google Cloud project ID                        |
| `GOOGLE_CLOUD_LOCATION`          | No       | Vertex AI | Google Cloud location (default: `us-central1`) |
| `GOOGLE_APPLICATION_CREDENTIALS` | No       | Vertex AI | Path to service account key file               |
| `REVENIUM_METERING_BASE_URL`     | No       | Both      | Revenium API base URL                          |
| `REVENIUM_LOG_LEVEL`             | No       | Both      | Log level: `DEBUG`, `INFO`, `WARNING`, `ERROR` |

## 🔧 Troubleshooting

### Common Issues

| Issue                                               | Solution                                                                 |
| --------------------------------------------------- | ------------------------------------------------------------------------ |
| **"Cannot find module '@google/generative-ai'"**    | Install with Google AI support: `npm install @google/generative-ai`      |
| **"Cannot find module '@google-cloud/aiplatform'"** | Install with Vertex AI support: `npm install @google-cloud/aiplatform`   |
| **Vertex AI authentication errors**                 | Verify Google Cloud credentials: `gcloud auth application-default login` |
| **"Project not found" errors**                      | Ensure `GOOGLE_CLOUD_PROJECT` is set correctly                           |
| **Embeddings showing 0 tokens**                     | Expected with Google AI SDK; use Vertex AI for full token counting       |
| **Requests not being tracked**                      | Ensure middleware is imported before Google AI/Vertex AI SDKs            |

### Debug Mode

Enable debug logging to see provider detection and routing decisions:

```bash
export REVENIUM_LOG_LEVEL=DEBUG
node your_script.js
```

### Force Specific SDK

To ensure only one SDK is used:

```bash
# Use only Google AI SDK
npm install revenium-middleware-google-nodejs @google/generative-ai

# Use only Vertex AI SDK
npm install revenium-middleware-google-nodejs @google-cloud/aiplatform
```

### Google AI SDK Troubleshooting

**Middleware not tracking requests:**

- Ensure middleware is imported before Google AI SDK
- Check that environment variables are loaded correctly
- Verify your `REVENIUM_METERING_API_KEY` is correct

**Embeddings showing 0 tokens:**

- This is expected due to Google AI SDK limitations
- Model name and metadata are still tracked correctly
- Chat and streaming operations provide full token data

### Vertex AI SDK Troubleshooting

**Authentication issues:**

- Verify Google Cloud credentials: `gcloud auth list`
- Check project access: `gcloud projects describe YOUR_PROJECT_ID`
- Ensure service account has required permissions

**Model not available errors:**

- Check if models are available in your region
- Verify Vertex AI API is enabled in your project
- Try a different model or region

## 🔍 Logging

This module uses Node.js console logging. You can control the log level by setting the `REVENIUM_LOG_LEVEL` environment variable:

```bash
# Enable debug logging
export REVENIUM_LOG_LEVEL=DEBUG

# Or when running your script
REVENIUM_LOG_LEVEL=DEBUG node your_script.js
```

Available log levels:

- `DEBUG`: Detailed debugging information
- `INFO`: General information (default)
- `WARNING`: Warning messages only
- `ERROR`: Error messages only

## 🔄 Compatibility

- 🚀 Node.js 18.0+
- 🤖 Google AI SDK (`@google/generative-ai`) or Vertex AI SDK (`@google-cloud/aiplatform`)
- ☁️ Google Cloud Project (for Vertex AI SDK)
- 📝 TypeScript 5.0+

## 📋 Supported Models

The middleware works with all Google AI models available through both SDKs:

### Google AI SDK Models

- `gemini-2.0-flash-001`
- `gemini-2.0-flash-lite-001`
- `gemini-1.5-pro`
- `gemini-1.5-flash`
- `text-embedding-004`
- All other Gemini Developer API models

### Vertex AI SDK Models

- `gemini-2.0-flash-001`
- `gemini-2.0-flash-lite-001`
- `gemini-1.5-pro`
- `gemini-1.5-flash`
- `text-embedding-004`
- All other Vertex AI Gemini models

## 📄 License

This project is licensed under the Apache Software License - see the LICENSE file for details.

## 🙏 Acknowledgments

- 💖 Built with ❤️ by the Revenium team
