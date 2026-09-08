// Persists the rich-text document content for one workspace file.
import connectToDatabase from '@/lib/mongoose'
import File from '@/models/File'

export async function POST(req: Request, ctx: any) {
  try {
    const { id } = ctx?.params || {}
    const body = await req.json()
    const { document } = body

    let useInMemory = false
    try {
      await connectToDatabase()
    } catch {
      useInMemory = true
    }

    if (useInMemory) {
      const memFiles = (globalThis as any).__inMemoryFiles = (globalThis as any).__inMemoryFiles || []
      let f = memFiles.find((file: any) => String(file._id) === String(id))
      if (!f) {
        f = { _id: id, fileName: 'Untitled', document: document || '', whiteboard: '' }
        memFiles.push(f)
      } else {
        f.document = document || ''
      }
      return new Response(JSON.stringify({ ok: true, file: f }), { status: 200 })
    }

    let f = await File.findById(id)
    if (!f) {
      f = new File({
        _id: id,
        fileName: 'Untitled',
        document: document || '',
        whiteboard: ''
      })
      await f.save()
    } else {
      f.document = document || ''
      await f.save()
    }
    
    return new Response(JSON.stringify({ ok: true, file: f }), { status: 200 })
  } catch (e: any) {
    console.error('POST /api/files/[id]/document', e)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}
