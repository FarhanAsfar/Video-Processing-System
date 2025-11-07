# Video Processing System - Architecture Notes

## Phase 1 - Foundations

### Services
- PostgreSQL: Stores video metadata (status, URLs, etc.)
- Redis: Manages job queues for video processing
- API: Will handle video upload & queue jobs (to be added)
- Worker: Will process queued jobs (to be added)

### Network Topology
All services run via Docker Compose on the same network.

### Environment
- Node.js 20.x
- Postgres 15
- Redis 7
- Docker Compose 3.8

