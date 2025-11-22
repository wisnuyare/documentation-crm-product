import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(defineConfig({
  title: 'CRM Product',
  description: 'Next-Gen WhatsApp CRM with Multi-Agent Orchestration',
  base: '/documentation-crm-product/',
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'User Guide', link: '/guide/user-guide' },
      { text: 'Architecture', link: '/architecture/overview' },
      { text: 'Features', link: '/features/booking-availability' },
      { text: 'QA', link: '/guide/qa' }
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'User Guide', link: '/guide/user-guide' },
          { text: 'User Journey', link: '/guide/user-journey' },
          { text: 'Tenant Journey', link: '/guide/tenant-journey' },
          { text: 'QA Checklist', link: '/guide/qa' }
        ]
      },
      {
        text: 'Architecture',
        items: [
          { text: 'Overview', link: '/architecture/overview' },
          { text: 'Multi-Agent System', link: '/architecture/multi-agent' }
        ]
      },
      {
        text: 'Features',
        items: [
          { text: 'Booking Availability', link: '/features/booking-availability' }
        ]
      },
      {
        text: 'Services',
        items: [
          { text: 'Overview', link: '/services/' },
          { text: 'LLM Orchestration', link: '/services/llm-orchestration' },
          { text: 'Booking', link: '/services/booking' },
          { text: 'Order', link: '/services/order' },
          { text: 'Message Sender', link: '/services/message-sender' },
          { text: 'Knowledge', link: '/services/knowledge' },
          { text: 'Conversation', link: '/services/conversation' },
          { text: 'Billing', link: '/services/billing' },
          { text: 'Analytics', link: '/services/analytics' },
          { text: 'Tenant', link: '/services/tenant' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/wisnuyare/documentation-crm-product' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 CRM Product Team'
    },
    search: {
      provider: 'local'
    }
  },
  mermaid: {
    // mermaid config
  }
}))
