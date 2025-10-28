src/
├─ index.ts                    # public exports (client + modules)
├─ client/
│  └─ ShopeeClient.ts         # composition only (no business logic)
│
├─ shared/                     # reusable + cross-cutting
│  ├─ types/                   # config, dto, responses, errors dto
│  ├─ errors/                  # error classes
│  ├─ ports/                   # generic OUTBOUND ports
│  │  ├─ HttpPort.ts
│  │  ├─ TokenPort.ts
│  │  ├─ ClockPort.ts
│  │  └─ SignerPort.ts
│  ├─ adapters/                # default impls of shared ports
│  │  ├─ FetchHttpAdapter.ts
│  │  ├─ MemoryTokenAdapter.ts
│  │  └─ SystemClock.ts
│  ├─ constants.ts             # base URLs, endpoints
│  └─ utils.ts                 # pure helpers (no IO)
│
├─ core/
│  ├─ BaseModule.ts            # thin base using shared/*
│  └─ TokenManager.ts          # composes TokenPort (+ refresh policy)
│
├─ auth/
│  ├─ index.ts                 # AuthModule facade
│  └─ signer/                  # adapters of SignerPort
│     ├─ ShopeeV2Signer.ts
│     └─ ShopeeV3Signer.ts
│
└─ modules/                    # feature modules (flat & predictable)
   ├─ order/
   │  ├─ index.ts              # OrderModule facade (SDK surface)
   │  ├─ ports/
   │  │  └─ index.ts           # OrderApiPort, DTOs for this module
   │  └─ adapters/
   │     └─ index.ts           # OrderHttpAdapter (outbound), OrderApi (inbound)
   ├─ product/
   │  ├─ index.ts
   │  ├─ ports/
   │  │  └─ index.ts
   │  └─ adapters/
   │     └─ index.ts
   ├─ shop/
   │  ├─ index.ts
   │  ├─ ports/
   │  │  └─ index.ts
   │  └─ adapters/
   │     └─ index.ts
   └─ logistics/
      ├─ index.ts
      ├─ ports/
      │  └─ index.ts
      └─ adapters/
         └─ index.ts
