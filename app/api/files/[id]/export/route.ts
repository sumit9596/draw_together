import connectToDatabase from '@/lib/mongoose'
import File from '@/models/File'

export async function GET(req: Request, ctx: any) {
  try {
    const params = await Promise.resolve(ctx?.params || {})
    const { id } = params || {}
    if (!id) return new Response(JSON.stringify({ error: 'File ID is required' }), { status: 400 })
    await connectToDatabase()
    const f = await File.findById(id).lean() as {
      fileName?: string
      document?: string
      whiteboard?: string
    } | null
    if (!f) return new Response(JSON.stringify({ error: 'File not found' }), { status: 404 })

    try {
      const pdfMod = await import('jspdf')
      const { jsPDF } = pdfMod as any

      const sanitizeFileName = (name: string) => name.replace(/[^a-z0-9\-_.]/gi, '_')
      const baseName = sanitizeFileName(f.fileName || 'file')

      const extractDocumentText = (documentValue: string) => {
        const maybe = String(documentValue || '')
        if (!maybe) return ''

        try {
          if (maybe.trim().startsWith('{') || maybe.trim().startsWith('[')) {
            const parsed = JSON.parse(maybe)
            if (parsed && Array.isArray(parsed.blocks)) {
              return parsed.blocks.map((block: any) => {
                if (block?.type === 'header') return block?.data?.text || ''
                if (block?.type === 'paragraph' || block?.type === 'quote' || block?.type === 'code') {
                  return block?.data?.text || block?.data?.message || ''
                }
                if (block?.type === 'list' && Array.isArray(block?.data?.items)) {
                  return block.data.items.map((item: any) => {
                    if (typeof item === 'string') return item
                    if (item?.text) return item.text
                    return JSON.stringify(item)
                  }).join('\n')
                }
                return JSON.stringify(block)
              }).join('\n\n')
            }
            if (Array.isArray(parsed)) return JSON.stringify(parsed, null, 2)
            return JSON.stringify(parsed, null, 2)
          }
        } catch {
          // fall through to plain-text handling below
        }

        return maybe.replace(/<[^>]+>/g, '')
      }

      const buildPdfBuffer = async (text: string) => {
        const pdf = new jsPDF({ unit: 'pt', format: 'a4' })
        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()
        const margin = 48
        const maxWidth = pageWidth - margin * 2
        const lineHeight = 16
        let cursorY = margin

        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(16)
        pdf.text(f.fileName || 'Untitled', margin, cursorY)
        cursorY += 28

        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(12)
        const lines = pdf.splitTextToSize(text || '(empty)', maxWidth) as string[]

        for (const line of lines) {
          if (cursorY > pageHeight - margin) {
            pdf.addPage()
            cursorY = margin
          }
          pdf.text(line, margin, cursorY)
          cursorY += lineHeight
        }

        return Buffer.from(pdf.output('arraybuffer'))
      }

      const documentText = extractDocumentText(f.document || '')
      const pdfBuffer = await buildPdfBuffer(documentText)
      return new Response(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${baseName}.pdf"`,
          'Cache-Control': 'no-store',
        },
      })
    } catch (e) {
      console.error('GET /api/files/[id]/export', e)
      return new Response(JSON.stringify({ error: 'Failed to prepare PDF' }), { status: 500 })
    }
  } catch (e: any) {
    console.error('GET /api/files/[id]/export', e)
    return new Response(JSON.stringify({ error: e?.message || String(e) }), { status: 500 })
  }
}
