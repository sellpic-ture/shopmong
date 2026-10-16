"use client";

import { useEffect, useRef } from "react";
import { FileImage } from "lucide-react";

export function FileThumbnail({ file }: { file: File }) {
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const url = URL.createObjectURL(file);
    const element = ref.current;
    if (element) element.src = url;
    return () => { URL.revokeObjectURL(url); };
  }, [file]);
  return <span className="file-thumbnail">
    <FileImage size={18} aria-hidden="true" />
    {/* Local object URLs are already in the browser; no remote image optimization is needed. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img ref={ref} alt="" loading="lazy" onError={(event) => { event.currentTarget.style.visibility = "hidden"; }} />
  </span>;
}
