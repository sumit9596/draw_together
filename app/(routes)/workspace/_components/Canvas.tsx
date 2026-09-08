// Hosts the visual whiteboard and persists drawing changes for the active file.
import dynamic from "next/dynamic";
import "@excalidraw/excalidraw/index.css";
import { FILE } from "../../dashboard/_components/FilesList";
import { useEffect, useRef, useState } from "react";
import { toast } from 'sonner'

const Excalidraw = dynamic(
    async () => (await import("@excalidraw/excalidraw")).Excalidraw,
    { ssr: false },
);
const ExcalidrawAny: any = Excalidraw

export default function Canvas({ saveRequestId, onSaveComplete, fileId, fileData }: { saveRequestId: number, onSaveComplete: () => void, fileId: any, fileData: FILE }) {

    const [whiteBoardData, setWhiteBoardData] = useState<any>([]);
    const excalidrawRef = useRef<any>(null)

    // Update local whiteboard state when fileData changes (e.g., after fetching)
    useEffect(() => {
        if (!fileData) return
        try {
            const parsed = JSON.parse(fileData.whiteboard || '[]')
            setWhiteBoardData(parsed)
        } catch (e) {
            setWhiteBoardData([])
        }
        // removed temporary debug exposure of excalidrawRef
    }, [fileData])
    useEffect(() => {
        if (!saveRequestId) return;

        let cancelled = false;

        const runSave = async () => {
            try {
                await saveWhiteboard();
            } catch (e) {
                console.error('Whiteboard save failed', e)
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
    }, [saveRequestId]);

    const saveWhiteboard = async () => {
        try {
            // Prefer getting the canonical scene from the excalidraw instance if available
            let elementsToSave = whiteBoardData
            try {
                if (excalidrawRef && excalidrawRef.current && typeof excalidrawRef.current.getSceneElements === 'function') {
                    const scene = await excalidrawRef.current.getSceneElements()
                    elementsToSave = scene || whiteBoardData
                }
            } catch (e) {
                console.warn('Could not get scene elements from Excalidraw ref, falling back to onChange cache', e)
            }

            const payload = { whiteboard: JSON.stringify(elementsToSave) }
            const res = await fetch(`/api/files/${fileId}/whiteboard`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
            await res.text()
            if (res.ok) {
                toast.success('Whiteboard saved')
            } else {
                toast.error('Failed to save whiteboard')
            }
        } catch (e) { console.error('Whiteboard save failed', e) }
    }

    return (
        <div className="h-screen w-full flex items-center justify-center bg-gray-100">
            {fileData ? (
                <ExcalidrawAny
                    ref={excalidrawRef}
                    key={`${fileId}_${(fileData as any).updatedAt || ''}`}
                    onChange={(elements: any) => {
                        setWhiteBoardData(elements);
                    }}
                    initialData={{
                        elements: JSON.parse(fileData.whiteboard || "[]"),
                    }}
                />
            ) : (
                <div>Loading canvas...</div>
            )}
        </div>
    );
}