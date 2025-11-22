# Pre-Release Checklist for WhatsApp CRM MVP

## ✅ Currently Working
- [x] WhatsApp webhook integration with ngrok
- [x] Auto-reply flow (webhook → LLM → WhatsApp)
- [x] LLM response storage in conversations ✨ NEW
- [x] Firebase authentication
- [x] Multi-tenant database isolation
- [x] Knowledge Base RAG integration
- [x] WABA token encryption (already implemented in tenant-service)
- [x] Frontend Dashboard (Conversations, Users, Settings, Analytics, etc.)
- [x] Role-based access control (Admin, Agent, Viewer)
- [x] **Security guardrails:** ✨ NEW
  - [x] Jailbreak detection and prevention
  - [x] Prompt injection protection
  - [x] Pre-processing input validation
  - [x] Out-of-scope question handling

---

## 🚀 Pre-Release Requirements

### 1. **LLM Personalization Settings** 🤖
**Priority**: HIGH
**Status**: ⚠️ Partially Done (Security guardrails ✅, but customization ❌)

**Completed**:
- [x] Add jailbreak detection and prevention
- [x] Add prompt injection protection
- [x] Add security guardrails for out-of-scope questions

**TODO**:
- [ ] Add "AI Assistant Name" field in Settings page (e.g., "Veronica" like Telkomsel)
- [ ] Add "AI Assistant Personality/Tone" selector (Professional, Friendly, Casual)
- [ ] Add "Welcome Message" customization
- [ ] Add "Business Hours" configuration (auto-reply only during business hours)
- [ ] Add "Language" preference (Indonesian, English, or Multi-language)
- [ ] **Add customizable error messages:**
  - [ ] Out-of-scope message (currently: "Maaf, saya tidak memiliki informasi tersebut...")
  - [ ] Jailbreak/security violation message (currently: "Maaf, saya hanya bisa membantu dengan pertanyaan terkait produk...")
  - [ ] Product unavailable message
  - [ ] After-hours message (when outside business hours)
  - [ ] Greeting message (first customer contact)
- [ ] Update LLM system prompt to use custom assistant name
- [ ] Store settings in `tenants` table (`llm_config` JSONB column)
- [ ] Update `security_service.py` to load tenant-specific error messages
- [ ] Update `prompt_service.py` to load tenant-specific instructions

**Implementation**:
```typescript
// Frontend: Settings.tsx
interface LLMSettings {
  assistantName: string;                    // e.g., "Veronica"
  tone: 'professional' | 'friendly' | 'casual';
  language: 'id' | 'en' | 'both';
  welcomeMessage: string;
  businessHours: {
    enabled: boolean;
    timezone: string;
    schedule: { day: string; start: string; end: string }[];
  };
  errorMessages: {
    outOfScope: string;                     // "Maaf, saya tidak memiliki informasi tersebut..."
    jailbreakAttempt: string;               // "Maaf, saya hanya bisa membantu dengan pertanyaan terkait produk..."
    productUnavailable: string;
    afterHours: string;
  };
  customInstructions: string;               // Additional custom rules
}

// Backend: Update LLM system prompt
const systemPrompt = `You are ${assistantName}, a helpful customer service assistant for ${tenantName}.
Your tone should be ${tone}. Language: ${language}. ${customInstructions}`;
```

**Files to modify**:
- `frontend/src/pages/Settings.tsx` - Add LLM settings form with all customization options
- `services/tenant-service/src/modules/tenants/tenants.service.ts` - Store/retrieve LLM config
- `services/llm-orchestration-service/app/services/prompt_service.py` - Use tenant config for prompts
- `services/llm-orchestration-service/app/services/security_service.py` - Use tenant error messages
- `services/llm-orchestration-service/app/services/context_service.py` - Fetch tenant LLM config

---

### 2. **Security Enhancements** 🔒
**Priority**: CRITICAL
**Status**: ⚠️ Partially Done

#### 2.1 Token Encryption
- [x] **WABA Access Token encryption** (✅ Already implemented in `services/tenant-service/src/crypto/crypto.service.ts`)
- [ ] Verify encryption key rotation mechanism
- [ ] Add encryption for Firebase service account keys (if storing)
- [ ] Audit all sensitive fields in database

#### 2.2 API Security
- [ ] Add rate limiting per tenant (currently basic rate limiting exists)
- [ ] Implement API request throttling for WhatsApp endpoints
- [ ] Add CORS configuration for production domain
- [ ] Enable Helmet.js for security headers (NestJS)
- [ ] Add input validation for all user inputs (prevent XSS, SQL injection)
- [ ] Sanitize HTML in messages before storing

#### 2.3 Authentication & Authorization
- [ ] Review Firebase JWT validation
- [ ] Add API key rotation for internal services
- [ ] Implement session timeout (currently using Firebase default)
- [ ] Add 2FA option for admin accounts
- [ ] Review Row-Level Security (RLS) policies in PostgreSQL

#### 2.4 Data Protection
- [ ] Encrypt sensitive data at rest (PostgreSQL encryption)
- [ ] Implement data retention policy (auto-delete after 3 months)
- [ ] Add GDPR compliance (right to be forgotten, data export)
- [ ] Secure environment variables (use GCP Secret Manager)

**Files to check**:
- All `.env` files (ensure not committed to git)
- `services/tenant-service/src/crypto/crypto.service.ts`
- `services/tenant-service/src/firebase/firebase-auth.guard.ts`
- Database RLS policies

---

### 3. **Penetration Testing & Security Audit** 🛡️
**Priority**: CRITICAL
**Status**: ❌ Not Started

- [ ] Run automated security scan (OWASP ZAP, Burp Suite)
- [ ] **Ask Gemini AI to perform penetration testing**
- [ ] Test for SQL injection vulnerabilities
- [ ] Test for XSS (Cross-Site Scripting) attacks
- [ ] Test for CSRF (Cross-Site Request Forgery)
- [ ] Test authentication bypass attempts
- [ ] Test authorization bypass (access other tenant's data)
- [ ] Test rate limiting bypass
- [ ] Test file upload vulnerabilities (Knowledge Base docs)
- [ ] Review Docker container security (non-root users)
- [ ] Scan dependencies for known vulnerabilities (`npm audit`, `pip-audit`)

**Gemini Pentest Prompt**:
```
I have a WhatsApp CRM application with the following architecture:
- Frontend: React + TypeScript
- Backend: NestJS (Node.js), FastAPI (Python), Gin (Go)
- Database: PostgreSQL with multi-tenant isolation
- Authentication: Firebase Auth with JWT
- Services: Tenant, Conversation, Knowledge Base (RAG), LLM Orchestration, Message Sender

Please perform a security audit and identify potential vulnerabilities:
1. Authentication/Authorization flaws
2. SQL injection points
3. XSS vulnerabilities
4. CSRF issues
5. Sensitive data exposure
6. API security issues

Here are the key endpoints:
[Attach API documentation or OpenAPI spec]
```

---

### 4. **Production Deployment Preparation** 🚢
**Priority**: HIGH
**Status**: ❌ Not Started

#### 4.1 Infrastructure
- [ ] Set up GCP Cloud Run for all services
- [ ] Configure Cloud SQL (PostgreSQL) with backups
- [ ] Set up Cloud Storage for document uploads
- [ ] Configure Cloud CDN for frontend
- [ ] Set up custom domain + SSL certificate
- [ ] Configure monitoring (Prometheus + Grafana)
- [ ] Set up error tracking (Sentry or equivalent)
- [ ] Configure log aggregation (Cloud Logging)

#### 4.2 Database
- [ ] Run all migrations on production database
- [ ] Set up automated backups (daily)
- [ ] Configure read replicas for scaling
- [ ] Optimize database indexes
- [ ] Set up connection pooling

#### 4.3 Environment Configuration
- [ ] Create production `.env` files
- [ ] Migrate to GCP Secret Manager
- [ ] Update CORS origins to production domain
- [ ] Update Firebase Auth domain whitelist
- [ ] Update WhatsApp webhook URL to production domain

---

### 5. **Performance Optimization** ⚡
**Priority**: MEDIUM
**Status**: ❌ Not Started

- [ ] Add Redis caching for frequently accessed data
- [ ] Optimize LLM response time (streaming)
- [ ] Add database query optimization (explain analyze)
- [ ] Implement pagination for large datasets
- [ ] Add CDN for static assets
- [ ] Optimize Docker images (multi-stage builds already done ✅)
- [ ] Add lazy loading for frontend components
- [ ] Compress responses (gzip)

---

### 6. **Error Handling & Monitoring** 📊
**Priority**: HIGH
**Status**: ⚠️ Partially Done

- [ ] Add comprehensive error logging
- [ ] Implement error notifications (email/Slack)
- [ ] Add health check endpoints for all services (✅ Already exist)
- [ ] Set up uptime monitoring (UptimeRobot or similar)
- [ ] Add request tracing (OpenTelemetry)
- [ ] Configure alerts for critical errors
- [ ] Add user-friendly error messages in frontend
- [ ] Implement retry mechanism for failed WhatsApp messages (✅ Already done)

---

### 7. **Testing** 🧪
**Priority**: HIGH
**Status**: ❌ Not Started

- [ ] Write unit tests for critical business logic
- [ ] Write integration tests for API endpoints
- [ ] Write E2E tests for user flows (Playwright/Cypress)
- [ ] Test multi-tenant isolation (ensure tenant A can't access tenant B's data)
- [ ] Load testing (simulate 100+ concurrent users)
- [ ] Test WhatsApp webhook with real messages
- [ ] Test knowledge base RAG accuracy
- [ ] Test LLM response quality

---

### 8. **Documentation** 📚
**Priority**: MEDIUM
**Status**: ⚠️ Partially Done

- [ ] Write API documentation (OpenAPI/Swagger)
- [ ] Write deployment guide
- [ ] Write user manual for dashboard
- [ ] Write admin setup guide (WhatsApp Business API setup)
- [ ] Document environment variables
- [ ] Create troubleshooting guide
- [ ] Document database schema
- [ ] Create backup/restore procedures

---

### 9. **Compliance & Legal** ⚖️
**Priority**: HIGH
**Status**: ❌ Not Started

- [ ] Add Terms of Service
- [ ] Add Privacy Policy
- [ ] Add GDPR compliance notice
- [ ] Add data processing agreement (DPA)
- [ ] Ensure PDP compliance (Indonesia data protection)
- [ ] Add cookie consent banner
- [ ] Document data retention policy
- [ ] Add "Delete My Data" functionality

---

### 10. **User Experience Improvements** 🎨
**Priority**: MEDIUM
**Status**: ⚠️ Partially Done

- [ ] Add loading states for all async operations
- [ ] Add success/error toast notifications
- [ ] Improve error messages (user-friendly)
- [ ] Add keyboard shortcuts
- [ ] Add dark mode support
- [ ] Improve mobile responsiveness
- [ ] Add onboarding tour for new users
- [ ] Add help tooltips
- [ ] Fix conversation list to show real data (currently shows dummy data)

---

### 11. **WhatsApp Integration Enhancements** 💬
**Priority**: MEDIUM
**Status**: ⚠️ Partially Done

- [ ] Support rich media messages (images, videos, documents)
- [ ] Support WhatsApp templates for notifications
- [ ] Add message delivery status tracking
- [ ] Add read receipts
- [ ] Support message reactions
- [ ] Add typing indicators
- [ ] Handle WhatsApp rate limits gracefully
- [ ] Add webhook signature verification (✅ Already implemented)

---

### 12. **Billing & Subscription** 💳
**Priority**: MEDIUM
**Status**: ⚠️ Basic implementation done

- [ ] Integrate payment gateway (Stripe/Xendit)
- [ ] Add subscription management UI
- [ ] Implement quota enforcement (✅ Backend done)
- [ ] Add usage analytics per tenant
- [ ] Add billing invoices generation
- [ ] Add payment failure handling
- [ ] Add upgrade/downgrade flow
- [ ] Add trial period support

---

## 📋 Release Checklist (Final Steps)

**Before going live:**

- [ ] Complete all CRITICAL priority items
- [ ] Complete all HIGH priority items
- [ ] Run full security audit
- [ ] Run load testing
- [ ] Test with 2-3 pilot customers
- [ ] Set up monitoring & alerts
- [ ] Prepare rollback plan
- [ ] Create incident response plan
- [ ] Train customer support team
- [ ] Prepare launch announcement

---

## 🎯 MVP Release Criteria

**Minimum requirements to go live:**

1. ✅ WhatsApp auto-reply working
2. ❌ LLM assistant name customization
3. ✅ WABA token encryption
4. ❌ Security audit completed
5. ❌ Production infrastructure set up
6. ❌ Basic error monitoring
7. ❌ User documentation
8. ❌ Terms of Service + Privacy Policy

**Estimated timeline**: 2-3 weeks

---

## 📝 Notes

- **Security is CRITICAL** - Do not skip security testing
- **Test with real customers** before full launch
- **Have a rollback plan** ready
- **Monitor closely** during first week of launch
- Keep README.md as the only doc in root (all others are in this checklist)

---

**Last Updated**: November 14, 2025
**Status**: Pre-Release Phase
**Target Release**: December 2025
