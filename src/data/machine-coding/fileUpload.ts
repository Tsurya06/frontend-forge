import type { MachineCodingProblem } from "../../types";

export const fileUploadProblem: MachineCodingProblem = {
  id: "mc-file-upload",
  title: "File Upload",
  difficulty: "Intermediate",
  category: "Machine Coding",
  tags: [
    "file-upload",
    "progress",
    "error-handling",
    "retry",
    "cancellation",
    "drag-and-drop",
    "FormData",
  ],
  problemStatement: `Build a fully-featured File Upload component in React that allows users to select files through a file picker dialog or drag-and-drop, displays upload progress for each file, and handles errors gracefully with retry and cancellation support.

The component should simulate (or integrate with) an API endpoint for uploading. Each file should show its own progress bar, status indicator (queued, uploading, completed, failed), file size, and type icon. Users should be able to cancel an in-progress upload or retry a failed one. The UI must support multiple simultaneous uploads with a configurable concurrency limit.

Consider real-world constraints: file size limits, allowed MIME types, network interruptions, and duplicate file detection. The component should be reusable and accept configuration props for max file size, accepted types, and maximum number of files.`,
  functionalRequirements: [
    "File selection via click (native file input) and drag-and-drop onto a drop zone",
    "Display upload progress percentage and progress bar for each file",
    "Show file metadata: name, size (formatted), type icon",
    "Cancel an in-progress upload (abort the XHR/fetch request)",
    "Retry a failed upload without re-selecting the file",
    "Validate file size and MIME type before uploading, show inline errors for invalid files",
    "Support multiple file uploads with configurable concurrency (e.g., max 3 simultaneous)",
    "Display status per file: queued, uploading, completed, failed",
  ],
  nonFunctionalRequirements: [
    "Accessible drag-and-drop zone with keyboard support and ARIA live region for status updates",
    "Responsive layout that works on mobile and desktop",
    "Memory-efficient: revoke object URLs and clean up AbortControllers on unmount",
    "Smooth progress bar animations without layout thrashing",
  ],
  componentHierarchy: `FileUploader
├── DropZone
│   ├── DropOverlay (visible during drag-over)
│   └── HiddenFileInput
├── FileList
│   └── FileItem (per file)
│       ├── FileIcon
│       ├── FileInfo (name, size)
│       ├── ProgressBar
│       ├── StatusBadge
│       └── ActionButtons (cancel / retry / remove)
└── UploadSummary (total progress, count)`,
  stateDesign: `interface FileEntry {
  id: string;
  file: File;
  status: 'queued' | 'uploading' | 'completed' | 'failed';
  progress: number; // 0-100
  error?: string;
  abortController?: AbortController;
}

// Component state
const [files, setFiles] = useState<FileEntry[]>([]);
const [isDragOver, setIsDragOver] = useState(false);

// Derived
const activeUploads = files.filter(f => f.status === 'uploading').length;
const canUploadMore = activeUploads < maxConcurrent;`,
  propsApiDesign: `interface FileUploaderProps {
  uploadUrl: string;
  maxFileSize?: number;        // bytes, default 10MB
  acceptedTypes?: string[];    // MIME types
  maxFiles?: number;           // default 10
  maxConcurrent?: number;      // default 3
  onUploadComplete?: (file: File, response: unknown) => void;
  onUploadError?: (file: File, error: Error) => void;
}`,
  architecture: `The FileUploader uses a reducer pattern to manage the file queue. When files are added, they enter the queue with status 'queued'. A useEffect watches the queue and starts uploads for queued files up to the concurrency limit.

Each upload creates an AbortController stored in state so it can be cancelled. Upload progress is tracked via XMLHttpRequest's onprogress event (or a ReadableStream with fetch). On completion the status flips to 'completed'; on error it becomes 'failed' and the error message is stored.

The DropZone handles dragenter/dragleave/dragover/drop events, toggling a visual highlight. A hidden <input type="file"> provides the click-to-browse fallback. File validation runs synchronously before queueing.`,
  implementation: `import React, { useState, useCallback, useRef, useEffect } from 'react';

interface FileEntry {
  id: string;
  file: File;
  status: 'queued' | 'uploading' | 'completed' | 'failed';
  progress: number;
  error?: string;
  abortController?: AbortController;
}

interface FileUploaderProps {
  uploadUrl?: string;
  maxFileSize?: number;
  acceptedTypes?: string[];
  maxConcurrent?: number;
  maxFiles?: number;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export default function FileUploader({
  uploadUrl = '/api/upload',
  maxFileSize = 10 * 1024 * 1024,
  acceptedTypes,
  maxConcurrent = 3,
  maxFiles = 10,
}: FileUploaderProps) {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRefs = useRef<Map<string, AbortController>>(new Map());

  const validateFile = useCallback(
    (file: File): string | null => {
      if (file.size > maxFileSize) return \`File exceeds \${formatBytes(maxFileSize)} limit\`;
      if (acceptedTypes && !acceptedTypes.includes(file.type)) return 'File type not accepted';
      return null;
    },
    [maxFileSize, acceptedTypes]
  );

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const incoming = Array.from(newFiles);
      setFiles((prev) => {
        const remaining = maxFiles - prev.length;
        const toAdd = incoming.slice(0, remaining);
        return [
          ...prev,
          ...toAdd.map((file) => {
            const error = validateFile(file);
            return {
              id: generateId(),
              file,
              status: error ? ('failed' as const) : ('queued' as const),
              progress: 0,
              error: error ?? undefined,
            };
          }),
        ];
      });
    },
    [maxFiles, validateFile]
  );

  const uploadFile = useCallback(
    (entry: FileEntry) => {
      const controller = new AbortController();
      abortRefs.current.set(entry.id, controller);

      setFiles((prev) =>
        prev.map((f) =>
          f.id === entry.id ? { ...f, status: 'uploading' as const, progress: 0, error: undefined } : f
        )
      );

      const xhr = new XMLHttpRequest();
      xhr.open('POST', uploadUrl);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setFiles((prev) => prev.map((f) => (f.id === entry.id ? { ...f, progress } : f)));
        }
      };

      xhr.onload = () => {
        abortRefs.current.delete(entry.id);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === entry.id
              ? xhr.status >= 200 && xhr.status < 300
                ? { ...f, status: 'completed' as const, progress: 100 }
                : { ...f, status: 'failed' as const, error: \`Server error: \${xhr.status}\` }
              : f
          )
        );
      };

      xhr.onerror = () => {
        abortRefs.current.delete(entry.id);
        setFiles((prev) =>
          prev.map((f) => (f.id === entry.id ? { ...f, status: 'failed' as const, error: 'Network error' } : f))
        );
      };

      xhr.onabort = () => {
        abortRefs.current.delete(entry.id);
        setFiles((prev) =>
          prev.map((f) => (f.id === entry.id ? { ...f, status: 'failed' as const, error: 'Upload cancelled' } : f))
        );
      };

      controller.signal.addEventListener('abort', () => xhr.abort());

      const formData = new FormData();
      formData.append('file', entry.file);
      xhr.send(formData);
    },
    [uploadUrl]
  );

  useEffect(() => {
    const activeCount = files.filter((f) => f.status === 'uploading').length;
    const queued = files.filter((f) => f.status === 'queued');
    const slotsAvailable = maxConcurrent - activeCount;

    queued.slice(0, slotsAvailable).forEach((entry) => uploadFile(entry));
  }, [files, maxConcurrent, uploadFile]);

  const cancelUpload = (id: string) => {
    abortRefs.current.get(id)?.abort();
  };

  const retryUpload = (id: string) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, status: 'queued' as const, progress: 0, error: undefined } : f)));
  };

  const removeFile = (id: string) => {
    abortRefs.current.get(id)?.abort();
    abortRefs.current.delete(id);
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  useEffect(() => {
    return () => {
      abortRefs.current.forEach((c) => c.abort());
    };
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div
        role="button"
        tabIndex={0}
        aria-label="Drop files here or click to browse"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
        style={{
          border: \`2px dashed \${isDragOver ? '#2563eb' : '#cbd5e1'}\`,
          borderRadius: 8,
          padding: 32,
          textAlign: 'center',
          background: isDragOver ? '#eff6ff' : '#f8fafc',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        <p style={{ margin: 0, fontWeight: 600 }}>
          {isDragOver ? 'Drop files here' : 'Drag & drop files or click to browse'}
        </p>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
          Max {formatBytes(maxFileSize)} per file
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={acceptedTypes?.join(',')}
          style={{ display: 'none' }}
          onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ''; }}
        />
      </div>

      <ul style={{ listStyle: 'none', padding: 0, marginTop: 16 }} aria-live="polite">
        {files.map((entry) => (
          <li
            key={entry.id}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '8px 12px', borderRadius: 6,
              background: '#fff', border: '1px solid #e2e8f0', marginBottom: 8,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {entry.file.name}
              </div>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                {formatBytes(entry.file.size)} — {entry.status}
                {entry.error && <span style={{ color: '#ef4444' }}> ({entry.error})</span>}
              </div>
              {entry.status === 'uploading' && (
                <div style={{ height: 4, background: '#e2e8f0', borderRadius: 2, marginTop: 4 }}>
                  <div
                    style={{
                      height: '100%', width: \`\${entry.progress}%\`,
                      background: '#2563eb', borderRadius: 2,
                      transition: 'width 0.3s ease',
                    }}
                    role="progressbar"
                    aria-valuenow={entry.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {entry.status === 'uploading' && (
                <button onClick={() => cancelUpload(entry.id)} aria-label={\`Cancel \${entry.file.name}\`}>✕</button>
              )}
              {entry.status === 'failed' && (
                <button onClick={() => retryUpload(entry.id)} aria-label={\`Retry \${entry.file.name}\`}>↻</button>
              )}
              <button onClick={() => removeFile(entry.id)} aria-label={\`Remove \${entry.file.name}\`}>🗑</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
  accessibility: `The drop zone is a focusable element with role="button" and an aria-label explaining usage. Keyboard users can trigger file selection with Enter or Space. The file list uses aria-live="polite" so screen readers announce additions and status changes. Each progress bar has role="progressbar" with aria-valuenow/min/max. Action buttons have descriptive aria-labels including the file name. Error messages are associated with each file item so assistive technology reads them in context.`,
  performance: `Upload concurrency is capped (default 3) to avoid saturating bandwidth. Progress state updates use functional setters to avoid stale closures. AbortControllers are cleaned up on unmount to prevent memory leaks. The file list uses stable keys (generated IDs) to minimize React reconciliation. Object URLs (if used for previews) should be revoked after rendering. The hidden file input is reused rather than recreated.`,
  edgeCases: [
    "Dropping a folder (should filter to valid files or show error)",
    "Network drops mid-upload — the onerror handler fires and status becomes failed with retry available",
    "User navigates away during upload — cleanup effect aborts all active uploads",
    "Selecting the same file twice — detect duplicates by name+size+lastModified and warn",
    "Zero-byte files — validate and reject before queueing",
    "Very long file names — CSS truncation with ellipsis",
  ],
  testingStrategy: [
    "Unit test: validateFile rejects files over maxFileSize and wrong MIME types",
    "Unit test: addFiles respects maxFiles limit and does not exceed it",
    "Integration test: selecting files via input populates the file list with correct metadata",
    "Integration test: drag-and-drop adds files and triggers upload queue",
    "Integration test: cancel button aborts the XMLHttpRequest and sets status to failed",
    "Integration test: retry re-queues a failed file and it uploads successfully",
    "Accessibility test: drop zone is reachable and activatable via keyboard",
  ],
  improvements: [
    "Add thumbnail previews for image files using URL.createObjectURL",
    "Chunk large files and upload in parts with resumable upload support",
    "Persist upload queue in localStorage so refreshing the page resumes uploads",
    "Add a global progress indicator summarizing all files",
    "Support paste from clipboard (Ctrl+V) for images",
  ],
  followUpQuestions: [
    "How would you implement resumable uploads for very large files?",
    "What strategy would you use to prevent duplicate files from being uploaded?",
    "How would you handle authentication tokens expiring mid-upload?",
    "How would you test the drag-and-drop behavior in an automated test suite?",
  ],
};
