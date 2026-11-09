import {
    createShare,
    getShare,
    getShareContent
} from '../services/instantShare.service.js'

function sendError(res, error) {
    if (res.headersSent) return res.end()
    const status = Number.isInteger(error?.statusCode) &&
        error.statusCode >= 400 && error.statusCode < 600
        ? error.statusCode
        : 500
    if (status >= 500) {
        // Do not log request bodies, share links, codes, keys, or claim tokens.
        console.error('Instant Share request failed', { code: error?.code || 'INTERNAL_ERROR' })
    }
    res.setHeader('Cache-Control', 'no-store')
    return res.status(status).json({
        success: false,
        message: status >= 500 ? 'Unable to process the request' : error.message
    })
}

export async function createInstantShare(req, res) {
    try {
        const result = await createShare({
            file: req.file,
            accessCode: req.body.accessCode,
            salt: req.body.salt,
            iv: req.body.iv,
            claimTokenHash: req.body.claimTokenHash
        })
        res.setHeader('Cache-Control', 'no-store')
        return res.status(201).json({ success: true, ...result })
    } catch (error) {
        return sendError(res, error)
    }
}

export async function retrieveInstantShare(req, res) {
    try {
        const share = await getShare(req.params.code)
        res.setHeader('Cache-Control', 'no-store')
        return res.status(200).json({ success: true, share })
    } catch (error) {
        
        return sendError(res, error)
    }
}

// Mount as POST /:code/content, not GET. A successful claim has already
// deleted the database row before the response is sent.
export async function downloadInstantShare(req, res) {
    try {
        const file = await getShareContent(req.params.code, req.get('X-Share-Token'))
        res.setHeader('Content-Type', 'application/octet-stream')
        res.setHeader('Content-Length', file.content.length)
        res.setHeader('Content-Disposition', 'attachment; filename="encrypted.bin"')
        res.setHeader('X-Content-Type-Options', 'nosniff')
        res.setHeader('Cache-Control', 'no-store')
        return res.status(200).send(file.content)
    } catch (error) {
        return sendError(res, error)
    }
}
