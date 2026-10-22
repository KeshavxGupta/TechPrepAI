# Changelog

All notable changes to the TechPrep AI project will be documented in this file.

## [2.3.0] - 2026-10-22
### Added
- High-performance instant quiz loading: Server-side in-memory caching (60s TTL) and client-side Stale-While-Revalidate (SWR) for 0ms initial render.
- Strict proctoring session overhaul: Early exit termination policy (exiting, navigating away, closing or reloading marks quiz as FAILED with 0% score).
- High-stakes exit confirmation modal with back-button (`popstate`), `beforeunload`, and `pagehide` beacon fail-safes.
- Real-time webcam optical gaze/presence monitor with AI optical radar HUD fallback.
- Infraction burst debouncer (2500ms cooldown) and native Web Audio API synthesizer warning chime.
- Fully responsive examination interface and LeetCode-grade coding split-view across mobile, tablet, and desktop viewports.

## [2.2.0] - 2026-10-18
### Added
- LeetCode-grade multi-language split-screen compiler in Quiz examination environment.
- Native host compiler service with Node.js 22, Python 3.12, G++ 14.2, and Adoptium OpenJDK 21.
- Tab-key 2-space indentation and line-number gutter with synced vertical scrolling.
- MongoDB Atlas cloud integration.

## [2.1.0] - 2026-10-06
### Added
- Split-screen DSA IDE layout.
- Coding Challenge questions in Admin Quiz Hub.

## [2.0.0] - 2026-08-24
### Added
- TechPrepAI Phase 2 release.
- Active recall study planner and Kanban placement tracker.
