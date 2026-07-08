import connectToDatabase from '@/lib/mongoose'
import Project from '@/models/Project'
import File from '@/models/File'
import getUserFromRequest from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { anonId, name } = body || {}

    let useInMemory = false
    try { await connectToDatabase() } catch { useInMemory = true }

    const user = await getUserFromRequest(req)
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

    if (useInMemory) {
      const memProjects = (globalThis as any).__inMemoryProjects = (globalThis as any).__inMemoryProjects || []
      const memFiles = (globalThis as any).__inMemoryFiles = (globalThis as any).__inMemoryFiles || []

      // find anon file by anonId
      const anonFile = memFiles.find((f: any) => String(f._id) === String(anonId))
      const projectId = `proj_${Date.now()}`
      const projectName = name || (anonFile && anonFile.fileName) || 'Untitled'
      const p = { id: projectId, name: projectName, owner: user.email }
      memProjects.push(p)

      const fileObj = { _id: projectId, fileName: projectName, document: anonFile?.document || '', whiteboard: anonFile?.whiteboard || '' }
      memFiles.push(fileObj)

      return new Response(JSON.stringify({ ok: true, project: p }), { status: 201, headers: { 'Content-Type': 'application/json' } })
    }

    const proj = await Project.create({ name: name || 'Untitled', owner: user.id })

    // try to copy data from an existing file with anonId if present
    try {
      let sourceFile = null
      if (anonId) {
        sourceFile = await File.findById(anonId).lean() as {
          fileName?: string
          document?: string
          whiteboard?: string
        } | null
      }

      const fileName = name || (sourceFile && sourceFile.fileName) || 'Untitled'
      const document = (sourceFile && sourceFile.document) || ''
      const whiteboard = (sourceFile && sourceFile.whiteboard) || ''

      try {
        await File.create({ _id: String(proj._id), fileName, document, whiteboard })
      } catch (e) {
        // ignore if already exists
        try {
          await File.updateOne({ _id: String(proj._id) }, { $set: { fileName, document, whiteboard } }).exec()
        } catch (e2) { }
      }
    } catch (e) {
      console.warn('claim: could not copy anon file', e)
    }

    return new Response(JSON.stringify({ ok: true, project: proj }), { status: 201, headers: { 'Content-Type': 'application/json' } })
  } catch (e: any) {
    console.error('POST /api/projects/claim', e)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}
