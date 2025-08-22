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

| Feature | Google AI SDK | Vertex AI SDK |
|---------|---------------|---------------|
| **Chat Completion** | ✅ Full support | ✅ Full support |
| **Streaming** | ✅ Full support | ✅ Full support |
| **Text Embeddings** | ✅ Basic support* | ✅ Full support |
| **Token Metering** | ✅ Chat/Streaming | ✅ All operations |
| **Metadata Tracking** | ✅ Full support | ✅ Full support |
| **Setup Complexity** | Simple (API key) | Moderate (GCP project) |

**Note**: *Google AI SDK embeddings don't return token counts due to API limitations, but requests are still tracked.

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

| Use Case | Recommended SDK | Why |
|----------|----------------|-----|
| **Quick prototyping** | Google AI SDK | Simple API key setup, but does NOT support token counts on embeddings |
| **Production applications** | Vertex AI SDK | Full token counting, enterprise features |
| **Embeddings-heavy workloads** | Vertex AI SDK | Complete token tracking for embeddings |
| **Enterprise/GCP environments** | Vertex AI SDK | Advanced Google Cloud integration |
| **Simple chat applications** | Either SDK | Both provide full chat support |

**💡 Recommendation**: Use Vertex AI SDK for production applications that need comprehensive token counting and advanced features.

## 🔧 Usage

### 🔄 Zero-Config Integration

Simply export your REVENIUM_METERING_API_KEY and import the middleware.
Your Google AI calls will be metered automatically:

#### Google AI SDK (Gemini Developer API)
```typescript
import 'revenium-middleware-google-nodejs';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

const result = await model.generateContent("What is the meaning of life, the universe and everything?");
console.log(result.response.text());
```

#### Vertex AI SDK
```typescript
import 'revenium-middleware-google-nodejs';
import { VertexAI } from '@google-cloud/aiplatform';

const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT!,
  location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1'
});

const model = vertexAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
const result = await model.generateContent("What is the meaning of life, the universe and everything?");
console.log(result.response.text());
```

The middleware automatically intercepts Google AI API calls and sends metering data to Revenium without requiring any
changes to your existing code. Make sure to set the `REVENIUM_METERING_API_KEY` environment variable for authentication
with the Revenium service.

### 📈 Enhanced Tracking with Metadata

For more granular usage tracking and detailed reporting, add the `usageMetadata` parameter:

#### Google AI SDK with Metadata
```typescript
import 'revenium-middleware-google-nodejs';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
  }
});
console.log(result.response.text());
```

#### Vertex AI SDK with Enhanced Features
```typescript
import 'revenium-middleware-google-nodejs';
import { VertexAI } from '@google-cloud/aiplatform';

const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT!,
  location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1'
});

const model = vertexAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

// Set metadata on the model instance for automatic tracking
(model as any)._reveniumUsageMetadata = {
  traceId: "conv-28a7e9d4",
  taskType: "document-analysis",
  organizationId: "acme-corp",
  productId: "business-intelligence"
};

const result = await model.generateContent("Analyze this quarterly report for key insights");
console.log(result.response.text());
// ✨ Full token counting including embeddings!
```

## 🌊 Streaming Support

The middleware supports streaming responses for both SDKs with identical interfaces:

### Google AI SDK Streaming
```typescript
import 'revenium-middleware-google-nodejs';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

const result = await model.generateContentStream({
  contents: "Write a creative story about AI",
  usageMetadata: {
    organizationId: "creative-studio",
    taskType: "creative-writing"
  }
});

for await (const chunk of result.stream) {
  process.stdout.write(chunk.text());
}
// Usage tracking happens automatically when stream completes
```

### Vertex AI SDK Streaming
```typescript
import 'revenium-middleware-google-nodejs';
import { VertexAI } from '@google-cloud/aiplatform';

const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT!,
  location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1'
});

const model = vertexAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

// Set metadata on model instance
(model as any)._reveniumUsageMetadata = {
  organizationId: "creative-studio",
  taskType: "creative-writing"
};

const result = await model.generateContent({
  contents: "Write a creative story about AI",
  stream: true
});

for await (const chunk of result.stream) {
  process.stdout.write(chunk.text());
}
// Enhanced usage tracking with full token counting
```

## 🔢 Text Embeddings

### Google AI SDK Embeddings (Basic Support)
```typescript
import 'revenium-middleware-google-nodejs';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getEmbeddingModel({ model: "text-embedding-004" });

const result = await model.embedContent({
  content: "Text to embed for search indexing",
  usageMetadata: {
    organizationId: "search-app",
    taskType: "document-indexing"
  }
});

console.log(`Generated ${result.embedding.values.length} dimensional embedding`);
// ⚠️ Token counts will be 0 due to Google AI SDK limitations
```

### Vertex AI SDK Embeddings (Full Support)
```typescript
import 'revenium-middleware-google-nodejs';
import { VertexAI } from '@google-cloud/aiplatform';

const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT!,
  location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1'
});

const model = vertexAI.getEmbeddingModel({ model: "text-embedding-004" });

// Set metadata for tracking
(model as any)._reveniumUsageMetadata = {
  organizationId: "search-app",
  taskType: "document-indexing"
};

const embeddings = await model.embedContent("Text to embed for search indexing");
console.log(`Generated ${embeddings.embedding.values.length} dimensional embedding`);
// ✅ Full token counting available!
```

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
