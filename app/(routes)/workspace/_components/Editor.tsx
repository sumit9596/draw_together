"use client";
import React, { useRef } from 'react'
import EditorJs from '@editorjs/editorjs';
import { useEffect } from 'react';
import Header from '@editorjs/header';
// @ts-ignore
import Checklist from '@editorjs/checklist'
import EditorjsList from '@editorjs/list';
import { toast } from 'sonner';
import { FILE } from '../../dashboard/_components/FilesList';

const rawDocument =
{
  "time": 1550476186479,
  "blocks": [
    {
      data: {
        text: "Hello, this is a header",
        Level: 2
      },
      id: "123",
      type: "header"

    },

  ],
  "version": "2.8.1"
}




function Editor({ saveRequestId, onSaveComplete, fileId, fileData }: { saveRequestId: number, onSaveComplete: () => void, fileId: any, fileData?: FILE }) {
  const ref = useRef<EditorJs>(null);

  // replace Convex mutation with REST API
  const updateDocumnet = async (payload: any) => {
    await fetch(`/api/files/${fileId}/document`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ document: payload.document }) })
  }

  useEffect(() => {
    if (!fileData) return

    initEditor()

    return () => {
      if (ref.current && typeof (ref.current as any).destroy === 'function') {
        ; (ref.current as any).destroy()
        ref.current = null
      }
    }
  }, [fileData?._id, fileData?.document])

  useEffect(() => {
    if (!saveRequestId) return;

    let cancelled = false;

    const runSave = async () => {
      try {
        if (!ref.current) {
          return;
        }
        const outputData = await ref.current.save();
        await updateDocumnet({ document: JSON.stringify(outputData) });
        toast("Document Updated !!")
      } catch (error) {
        console.error('Saving failed: ', error)
        toast("Server Error !!")
      } finally {
        if (!cancelled) {
          onSaveComplete();
        }
      }
    }

    runSave();

    return () => {
      cancelled = true;
    }
  }, [saveRequestId])

  const initEditor = () => {
    if (ref.current && typeof (ref.current as any).destroy === 'function') {
      ; (ref.current as any).destroy()
      ref.current = null
    }

    const editor = new EditorJs({
      holder: 'editorjs',

      tools: {

        header: Header,
        checklist: {
          class: Checklist,
          inlineToolbar: true,
        },


        list: {
          // @ts-ignore
          class: EditorjsList,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered',
          },
        },
      },
      data: fileData?.document ? JSON.parse(fileData?.document) : rawDocument,
    });
    ref.current = editor;
  }
  return (
    <div>
      <div id='editorjs' className='ml-10' >

      </div>
    </div>
  )
}

export default Editor