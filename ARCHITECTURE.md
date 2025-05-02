```mermaid
graph TD
  subgraph Client (Next.js)
    A[User Dashboard] -->|OAuth2 Login| B(Auth API)
    A --> D[Supabase JS]
  end
  subgraph API Routes
    B -->|PKCE| TW(Twitter API)
    C[fetch-bookmarks Cron] --> TW
    C --> OA(OpenAI GPT-4o)
    C --> SU(Supabase)
    C --> HE(Hedera HCS)
    B --> SU
  end
  TW -. bookmarks .-> C
  OA -. classification .-> C
  SU -. data .-> A
```
