import connectToDatabase from '@/lib/mongoose'
import File from '@/models/File'
import Project from '@/models/Project'

export async function GET(req: Request, context: any) {
  try {
    const params = await Promise.resolve(context?.params || {})
    const { id } = params || {}

    let useInMemory = false
    try {
      await connectToDatabase()
    } catch {
      useInMemory = true
    }

    if (useInMemory) {
      const memFiles = (globalThis as any).__inMemoryFiles = (globalThis as any).__inMemoryFiles || []
      const memProjects = (globalThis as any).__inMemoryProjects = (globalThis as any).__inMemoryProjects || []
      const foundMem = memFiles.find((file: any) => String(file._id) === String(id))
      if (foundMem) {
        return new Response(JSON.stringify(foundMem), { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } })
      }

      const projectMem = memProjects.find((project: any) => String(project.id) === String(id))
      if (projectMem) {
        const placeholderFromProject = { _id: id, fileName: projectMem.name || 'Untitled', document: '', whiteboard: '' }
        return new Response(JSON.stringify(placeholderFromProject), { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } })
      }

      const placeholder = { _id: id, fileName: 'Untitled', document: '', whiteboard: '' }
      return new Response(JSON.stringify(placeholder), { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } })
    }

    const found = await File.findById(id).lean()

    if (found) {
      return new Response(JSON.stringify(found), { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } })
    }

    // if no File exists yet, try to find a Project with the same id and use its name
    try {
      const project = await Project.findById(id).lean() as { name?: string } | null
      if (project) {
        const placeholderFromProject = { _id: id, fileName: project.name || 'Untitled', document: '', whiteboard: '' }
        return new Response(JSON.stringify(placeholderFromProject), { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } })
      }
    } catch (e) {
      // ignore errors and fall back to default placeholder
    }

    // return a minimal placeholder if not found
    const placeholder = { _id: id, fileName: 'Untitled', document: '', whiteboard: '' }
    return new Response(JSON.stringify(placeholder), { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } })
  } catch (e: any) {
    console.error('GET /api/files/[id]', e)
    const { id } = await Promise.resolve(context?.params || {})
    const placeholder = { _id: id, fileName: 'Untitled', document: '', whiteboard: '' }
    return new Response(JSON.stringify(placeholder), { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } })
  }
}
