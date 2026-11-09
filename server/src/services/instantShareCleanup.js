import { deleteExpiredInstantShares } from '../repositories/instantShare.repository.js'

// Call once when a long-running API process starts. Use a monitored external
// scheduler instead for serverless deployments or stronger operational guarantees.
export function startInstantShareCleanup() {
    let running = false
    let stopped = false

    const run = async () => {
        if (running || stopped) return
        running = true
        try {
            await deleteExpiredInstantShares()
        } catch (error) {
            console.error('Instant Share cleanup failed', { code: error?.code || 'INTERNAL_ERROR' })
        } finally {
            running = false
        }
    }

    void run()
    const timer = setInterval(() => { void run() }, 60_000)
    timer.unref?.()
    return () => {
        stopped = true
        clearInterval(timer)
    }
}
