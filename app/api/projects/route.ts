import connectToDatabase from '../../../lib/mongoose'
import Project from '../../../models/Project'
import File from '../../../models/File'
import getUserFromRequest from '../../../lib/auth'

export async function GET(req: Request) {
  try {
    let useInMemory = false
    try { await connectToDatabase() } catch { useInMemory = true }

    const user = await getUserFromRequest(req)
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

    if (useInMemory) {
      const mem = (globalThis as any).__inMemoryProjects = (globalThis as any).__inMemoryProjects || []
      const list = mem.filter((p: any) => p.owner === user.email)
      return new Response(JSON.stringify(list), { status: 200, headers: { 'Content-Type': 'application/json' } })
    }

    const projects = await Project.find({ owner: user.id }).lean().exec()
    return new Response(JSON.stringify(projects), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (e: any) {
    console.error('GET /api/projects', e)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name } = body
    if (!name) return new Response(JSON.stringify({ error: 'Name required' }), { status: 400 })

    let useInMemory = false
    try { await connectToDatabase() } catch { useInMemory = true }

    const user = await getUserFromRequest(req)
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

    if (useInMemory) {
      const mem = (globalThis as any).__inMemoryProjects = (globalThis as any).__inMemoryProjects || []
      const p = { id: `proj_${Date.now()}`, name, owner: user.email }
      mem.push(p)
      // also create an in-memory File placeholder so workspace shows correct name
      const memFiles = (globalThis as any).__inMemoryFiles = (globalThis as any).__inMemoryFiles || []
      memFiles.push({ _id: p.id, fileName: name, document: '', whiteboard: '' })
      return new Response(JSON.stringify(p), { status: 201, headers: { 'Content-Type': 'application/json' } })
    }

    const proj = await Project.create({ name, owner: user.id })
    // create associated File document so workspace immediately shows the project name
    try {
      await File.create({ _id: String(proj._id), fileName: name, document: '', whiteboard: '' })
    } catch (e: any) {
      // ignore duplicate key or other errors
      console.warn('Could not create File for project:', e?.message || e)
    }
    return new Response(JSON.stringify(proj), { status: 201, headers: { 'Content-Type': 'application/json' } })
  } catch (e: any) {
    console.error('POST /api/projects', e)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { id, name } = body
    if (!id || !name) return new Response(JSON.stringify({ error: 'Id and name required' }), { status: 400 })

    let useInMemory = false
    try { await connectToDatabase() } catch { useInMemory = true }

    const user = await getUserFromRequest(req)
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

    if (useInMemory) {
      const mem = (globalThis as any).__inMemoryProjects = (globalThis as any).__inMemoryProjects || []
      const p = mem.find((x: any) => x.id === id && x.owner === user.email)
      if (!p) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 })
      p.name = name
      // update in-memory File placeholder
      const memFiles = (globalThis as any).__inMemoryFiles = (globalThis as any).__inMemoryFiles || []
      const f = memFiles.find((x: any) => String(x._id) === String(id))
      if (f) f.fileName = name
      return new Response(JSON.stringify(p), { status: 200, headers: { 'Content-Type': 'application/json' } })
    }

    const proj = await Project.findOneAndUpdate({ _id: id, owner: user.id }, { name }, { new: true }).lean().exec()
    if (!proj) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 })

    try {
      await File.updateOne({ _id: String(id) }, { $set: { fileName: name } }).exec()
    } catch (e: any) {
      console.warn('Could not update File for project:', e?.message || e)
    }

    return new Response(JSON.stringify(proj), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (e: any) {
    console.error('PATCH /api/projects', e)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const { id } = body
    if (!id) return new Response(JSON.stringify({ error: 'Id required' }), { status: 400 })

    let useInMemory = false
    try { await connectToDatabase() } catch { useInMemory = true }

    const user = await getUserFromRequest(req)
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

    if (useInMemory) {
      const mem = (globalThis as any).__inMemoryProjects = (globalThis as any).__inMemoryProjects || []
      const idx = mem.findIndex((x: any) => x.id === id && x.owner === user.email)
      if (idx === -1) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 })
      mem.splice(idx, 1)
      const memFiles = (globalThis as any).__inMemoryFiles = (globalThis as any).__inMemoryFiles || []
      const fidx = memFiles.findIndex((x: any) => String(x._id) === String(id))
      if (fidx !== -1) memFiles.splice(fidx, 1)
      return new Response(null, { status: 204 })
    }

    const res = await Project.deleteOne({ _id: id, owner: user.id }).exec()
    if (!res || res.deletedCount === 0) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 })

    try {
      await File.deleteOne({ _id: String(id) }).exec()
    } catch (e: any) {
      console.warn('Could not delete File for project:', e?.message || e)
    }

    return new Response(null, { status: 204 })
  } catch (e: any) {
    console.error('DELETE /api/projects', e)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}
