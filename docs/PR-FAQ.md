# Korporus PR FAQ

## Context

This document is a PR FAQ (Press Release / Frequently Asked Questions) for Korporus, an open-source operating system for AI-native applications built by Anthus AI Solutions. The PR FAQ is an Amazon-style product discovery artifact — a press release written as if the product has launched, followed by FAQ answers to the hardest questions. It's used internally to align the team on vision, messaging, and positioning before building marketing materials.

All information below was gathered through a discovery interview with the founder.

---

## PRESS RELEASE

**Anthus AI Solutions Launches Korporus, an Operating System for AI-Native Applications**

*Open-source platform gives developers a standard way to build, run, and embed AI-powered applications with multi-agent coordination, evaluation, and observability built in*

**Q1 2026** — Anthus AI Solutions today announced the general availability of **Korporus**, an open-source operating system purpose-built for AI-native applications. Korporus provides a containerized runtime where independently developed AI applications share a shell, system settings, and common services — the same way desktop operating systems let applications coexist and cooperate.

### The Problem

Teams building AI-powered products today face three compounding challenges:

1. **Agent chaos.** When multiple AI agents operate across features, there is no standard way to coordinate, observe, and govern them. Teams resort to ad-hoc integrations and custom dashboards that don't scale.

2. **Integration hell.** Every new AI-powered feature requires gluing together execution infrastructure, evaluation pipelines, UI scaffolding, and ops tooling from scratch — a months-long distraction from the actual product.

3. **The prototype-to-production gap.** AI demos are fast to build. Production-grade AI products are not. The surrounding infrastructure — sandboxing, durable execution, settings management, behavior governance — has to be built every time.

### The Solution

Korporus eliminates these problems by providing an OS-level foundation for AI-native applications. You deploy a Korporus container the way you'd boot a computer. Then you install and run apps inside it.

Each app is independently developed and deployed with zero build-time coupling. Apps register into standard UI slots — a menu bar, a main content area, and an optional settings panel — through a Web Component contract. The shell discovers apps at runtime, loads them via Module Federation, and provides shared system services.

### Key Capabilities

- **A real shell.** Like Finder on macOS, the Korporus shell provides the chrome — menu bar, app launcher, settings, help — and loads apps into it at runtime. No monolith. No iframe hacks.

- **Agent-native from the ground up.** Korporus is designed for applications where AI agents are first-class citizens. When you have a gaggle of agents doing different things across your product, you need more than a chat window. You need a kanban board, policies, and evaluation — and the OS provides the hooks for all of it.

- **True federation.** Apps are built independently using any framework (React, Angular, or anything that produces Web Components), bundled separately, and loaded at runtime via Module Federation 2.0. No shared build step. No monorepo requirement. Ship on your own schedule.

- **Embed anywhere.** Korporus apps run in their own container but surface as standard Web Components. Any product can embed them — no iframe, no proprietary SDK, no lock-in.

- **Behavior specification as a first-class concept.** Apps and agents are governed by policies and specifications, not just code. The platform supports BDD-driven development where behavior specs are written before implementation.

- **Evaluation built in.** Measuring whether your AI is actually working correctly isn't an afterthought — it's an OS-level capability. Evaluation integrates with the scoring and execution infrastructure.

- **AI-native UX.** The entire user experience is designed for AI-generated content and multi-agent workflows. A kanban board provides the observability surface for managing agent sessions across your applications — because a single chat window simply isn't enough when you have dozens of agents working in parallel.

### The Ecosystem

Korporus is the OS. Applications run on it. Several companion products from Anthus integrate with Korporus as independently developed applications:

- **Kanbus** — Project and task management with agent observability and behavior policies
- **Tactus** — Durable execution engine with containerized, sandboxed agents
- **Plexus** — AI evaluation and scoring framework
- **Babulus** — AI-native marketing automation, built on VideoML
- **Cadecus** — L0 operator agents for first-tier ops ticket resolution

These products are separate from Korporus — they run on it the way applications run on an operating system.

### Availability

Korporus is open source and available now at [repository URL]. It ships with a shell application, a developer-friendly app manifest contract, a system settings API, a Web Component wrapper library, and documentation for building your first app.

---

## FREQUENTLY ASKED QUESTIONS

### External FAQ (Customer / Developer)

**Q: What is Korporus, exactly?**
A: Korporus is an operating system for AI-native applications. You deploy it as a container — it boots a shell, discovers installed apps, and runs them in a federated micro-frontend architecture. Think of it as macOS for your AI products: a shell (like Finder), system settings, an app launcher, shared services, and standards for how apps are packaged, installed, and run.

**Q: What frameworks can I use to build Korporus apps?**
A: Any framework that can produce Web Components. The current reference apps use React and Angular. The contract is simple: your app exposes Web Components for up to three slots (menubar, main, settings) and publishes a JSON manifest. The shell handles the rest.

**Q: How do I deploy a Korporus app?**
A: Build your app as a federated module (Vite + Module Federation 2.0 is the current toolchain), publish the bundle to any static hosting or CDN, and register a manifest that points to your remote entry. The Korporus shell fetches manifests at startup, loads your app at runtime, and renders your components in the appropriate slots.

**Q: Can I embed Korporus apps in my existing product?**
A: Yes. Korporus apps surface as standard Web Components. You can load them directly into any web application. The demo apps show this working with both React and Angular host applications.

**Q: Do I need to use Kanbus, Tactus, or Plexus?**
A: No. Those are separate products that integrate with Korporus but are not required. Korporus is the OS layer — you can run any apps on it.

**Q: Is Korporus open source?**
A: Yes, fully open source.

---

### Internal FAQ (Skeptics / Stakeholders)

**Q: Why an "OS"? Isn't this just a micro-frontend framework with extra steps?**
A: A micro-frontend framework handles module loading and UI composition. An operating system handles that *plus* app lifecycle management, shared system services (settings, help, appearance), standards for how apps are packaged and discovered, and — critically — a runtime model for coordinating the agents that operate inside those apps. The "OS" distinction matters because AI-native applications have fundamentally different operational needs than traditional web apps: they need agent observability, behavior governance, durable execution, evaluation, and sandboxing. Korporus provides the standards and hooks for all of these at the platform level, not as afterthoughts bolted onto a UI framework.

**Q: Why not just use Docker Compose to run multiple apps in containers?**
A: Docker Compose runs multiple *processes* in multiple containers. Korporus runs multiple *applications* inside a single coordinated runtime with shared UI chrome, shared settings, a common appearance system, inter-app communication, and a standard contract for how apps present themselves. Docker Compose gives you process isolation. Korporus gives you application coordination. They operate at different layers — and in fact, Korporus runs inside Docker. It's what happens *after* the container starts that matters.

**Q: How is a kanban board better than existing agent observability tools like LangSmith or Weights & Biases?**
A: LangSmith and W&B are excellent for tracing individual LLM calls and evaluating model outputs. But when you have many agents operating across multiple applications — handling support tickets, generating marketing content, running evaluations — you need an operational view, not just a trace view. A kanban board shows you what every agent is working on, what's blocked, what's done, and what needs human attention. It's the difference between a debugger and a project manager. You need both. Korporus integrates with tools like Kanbus to provide the project-management-level observability that trace-level tools don't offer.

**Q: What's the business model if the core is open source?**
A: Korporus is the OS layer. The business comes from the applications and services that run on it — products like Babulus (marketing automation), Cadecus (L0 operator agents), and professional services for teams building on the platform. Open-sourcing the OS creates the ecosystem; the applications and services are the business.

**Q: Who is this for?**
A: Three audiences: (1) SaaS companies that want to embed AI-powered features into their existing products without building the surrounding infrastructure, (2) AI application developers who need a production-ready runtime with agent coordination and evaluation, and (3) teams within Anthus building AI-native products on a shared platform.

**Q: What exists today vs. what's planned?**
A: **Built and working:** The federated shell, runtime app loading, Web Component contract, app manifest system, system settings API (appearance/theme), settings session event contract, docs/help app, developer demos in React and Angular, AWS deployment infrastructure (App Runner, Amplify, CloudFront). **In progress or planned:** Dynamic app discovery, inter-app messaging, deeper agent lifecycle hooks, and the companion product integrations (Kanbus, Tactus, Plexus).
