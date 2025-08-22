# 🔄 Middleware Flow Diagram

## 📱 Main Execution Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              🚀 START                                      │
│                        examples/simple-test.ts                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    📥 IMPORT MIDDLEWARE                                    │
│                    import "../src/index"                                   │
│              ⚡ ACTIVATES AUTOMATIC TRACKING                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    🔌 MIDDLEWARE ACTIVATES                                 │
│                    src/index.ts                                            │
│              🎯 INTERCEPTS ALL GOOGLE AI CALLS                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    🎯 AUTOMATIC DETECTION                                  │
│              ┌─────────────────┐    ┌─────────────────┐                    │
│              │   Google AI     │    │   Vertex AI     │                    │
│              │   SDK           │    │   SDK           │                    │
│              │   (API Key)     │    │   (GCP)         │                    │
│              └─────────────────┘    └─────────────────┘                    │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    🤖 GOOGLE AI CALLS                                      │
│              ┌─────────────────┐    ┌─────────────────┐                    │
│              │   Chat          │    │   Streaming     │                    │
│              │   Embeddings    │    │   Chat          │                    │
│              │   Streaming     │    │   Embeddings    │                    │
│              └─────────────────┘    └─────────────────┘                    │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    📊 DATA CAPTURE                                         │
│              ┌─────────────────┐    ┌─────────────────┐                    │
│              │   Tokens        │    │   Metadata      │                    │
│              │   Costs         │    │   Model         │                    │
│              │   Timestamp     │    │   User          │                    │
│              └─────────────────┘    └─────────────────┘                    │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    🌐 SEND TO REVENIUM                                     │
│                    api.revenium.io/meter/v2                               │
│              📈 ANALYSIS, REPORTS AND BILLING                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 🔍 Detailed Flow by Component

### 1️⃣ **ENTRY POINT - `examples/simple-test.ts`**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           🧪 TEST SUITE                                    │
│                                                                             │
│  • googleAIBasicExample()      → Basic chat with Google AI                 │
│  • googleAIStreamingExample()  → Streaming with Google AI                  │
│  • googleAIEmbeddingsExample() → Embeddings with Google AI                 │
│  • vertexAIBasicExample()      → Basic chat with Vertex AI                 │
│  • vertexAIStreamingExample()  → Streaming with Vertex AI                  │
│  • vertexAIEmbeddingsExample() → Embeddings with Vertex AI                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2️⃣ **MIDDLEWARE ACTIVATION - `src/index.ts`**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        🔌 ACTIVATION                                       │
│                                                                             │
│  import "./google-ai"    → Activates Google AI SDK interceptor             │
│  import "./vertex-ai"    → Activates Vertex AI SDK interceptor             │
│                                                                             │
│  ⚡ Middlewares auto-register and start intercepting                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3️⃣ **GOOGLE AI INTERCEPTION - `src/google-ai/middleware.ts`**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    🤖 GOOGLE AI INTERCEPTOR                                │
│                                                                             │
│  • Intercepts: @google/generative-ai                                      │
│  • Methods: generateContent(), generateContentStream(), embedContent()     │
│  • Tracking: Tokens, costs, metadata                                      │
│  • Limitation: Embeddings don't return token counts                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4️⃣ **VERTEX AI INTERCEPTION - `src/vertex-ai/middleware.ts`**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ☁️ VERTEX AI INTERCEPTOR                                │
│                                                                             │
│  • Intercepts: @google-cloud/aiplatform                                   │
│  • Methods: generateContent(), embedContent()                             │
│  • Tracking: COMPLETE Tokens (input + output)                             │
│  • Advantage: Complete token counting for all operations                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5️⃣ **COMMON UTILITIES - `src/common/`**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        🛠️ UTILITIES                                       │
│                                                                             │
│  • logger.ts      → Logging and debug system                               │
│  • utils.ts       → Usage data processing                                  │
│  • types.ts       → TypeScript type definitions                            │
│  • exceptions.ts  → Middleware error handling                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 🔄 Execution Sequence

### **Step by Step:**

1. **🚀 User executes:** `npm run simple-test`
2. **📥 Imports:** `../src/index` (activates middlewares)
3. **🔌 Registers:** Google AI and Vertex AI interceptors
4. **🤖 Executes:** Google AI SDK test
   - Interceptor captures call
   - Extracts tokens, costs, metadata
   - Executes original call
   - Sends data to Revenium
5. **☁️ Executes:** Vertex AI SDK test
   - Interceptor captures call
   - Extracts COMPLETE tokens, costs, metadata
   - Executes original call
   - Sends data to Revenium
6. **📊 Revenium receives:** Usage data for analysis

## 🎯 System Key Points

### **✅ Main Characteristics:**

- **Zero-config**: No changes required in existing code
- **Auto-detection**: Automatically detects which SDK to use
- **Transparent**: Works without modifying business logic
- **Comprehensive**: Complete tracking of all operations

### **🔍 Automatic Detection:**

```
If @google/generative-ai is imported     → Activates Google AI interceptor
If @google-cloud/aiplatform is imported  → Activates Vertex AI interceptor
If both are imported                      → Activates both interceptors
```

### **📊 Tracking Differences:**

```
Google AI SDK:     Tokens for Chat/Streaming, basic for Embeddings
Vertex AI SDK:     COMPLETE Tokens for all operations
```

## 🚀 Execution Commands

```bash
# Execute complete test
npm run simple-test

# See flow in action with debug
REVENIUM_LOG_LEVEL=DEBUG npm run simple-test

# Compile and see structure
npm run build
```

## 📈 Final Result

At the end of the flow, Revenium receives:

- **Input and output tokens**
- **Estimated costs**
- **User metadata**
- **Model used**
- **Operation timestamp**
- **Operation type (chat, streaming, embeddings)**

All of this is sent automatically without the developer having to do anything additional. 🎉
