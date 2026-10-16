"use client";

import { useState, useRef, useEffect } from "react";
import JSZip from "jszip";
import Link from "next/link";
import { platforms } from "@/lib/platforms";
import { FileThumbnail } from "@/components/file-thumbnail";
import { drawThumbnail, encodeImage, type Fit } from "@/lib/image-converter";
import {
  ArrowDownToLine, ArrowRight, Check, ChevronDown, Crop, FileImage,
  Image as ImageIcon, Images, Info, LoaderCircle, Maximize, Plus,
  ShieldCheck, SlidersHorizontal, Sparkles, Upload, X,
} from "lucide-react";


export default function Home() {


  const [selectedPlatform, setSelectedPlatform] =
    useState(platforms[0]);


  const [selectedType, setSelectedType] =
useState<"thumbnail" | "detail">("thumbnail");

const [outputFormat, setOutputFormat] =
  useState<"jpg" | "png" | "webp">("jpg");


  const [image, setImage] =
    useState<string | null>(null);


  const [fileName, setFileName] =
    useState("");


  const [imageSize, setImageSize] =
    useState({
      width:0,
      height:0,
    });


  const inputRef = useRef<HTMLInputElement>(null);
  const nextJobId = useRef(0);
  const [previewMode, setPreviewMode] = useState<"result" | "original">("result");
  const [dragging, setDragging] = useState(false);



  const [fit, setFit] = useState<Fit>("crop");
  const [position, setPosition] = useState(0.5);
  const [quality, setQuality] = useState(0.9);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const previewRef = useRef<HTMLCanvasElement>(null);
  const sourceRef = useRef<HTMLImageElement | null>(null);
  const uploadId = useRef(0);
  type Job = { id: number; file: File; fit: Fit; position: number; outcome: string };
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);

  const selectJob = async (job: Job) => {
    const id = ++uploadId.current;
    setLoading(true);
    setActiveId(job.id);
    setFileName(job.file.name);
    setImage(null);
    sourceRef.current = null;
    setImageSize({ width: 0, height: 0 });
    setFit(job.fit);
    setPosition(job.position);
    const url = URL.createObjectURL(job.file);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      if (!img.naturalWidth || img.naturalWidth * img.naturalHeight > 40_000_000) throw new Error("이미지는 4천만 픽셀 이하로 선택해주세요.");
      if (id !== uploadId.current) { URL.revokeObjectURL(url); return; }
      sourceRef.current = img;
      setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
      setImage(url);
    } catch {
      URL.revokeObjectURL(url);
      if (id === uploadId.current) setError(`${job.file.name}: 이미지를 읽을 수 없거나 해상도가 너무 큽니다.`);
    } finally { if (id === uploadId.current) setLoading(false); }
  };

  const updateFraming = (nextFit: Fit, nextPosition: number) => {
    setFit(nextFit);
    setPosition(nextPosition);
    setJobs((items) => items.map((job) => job.id === activeId ? { ...job, fit: nextFit, position: nextPosition } : job));
  };


  useEffect(() => () => { if (image) URL.revokeObjectURL(image); }, [image]);

  useEffect(() => {
    if (image && !loading && selectedType === "thumbnail" && previewRef.current && sourceRef.current) {
      drawThumbnail(previewRef.current, sourceRef.current, selectedPlatform.thumbnail.width, fit, position);
    }
  }, [image, loading, selectedType, selectedPlatform, fit, position, previewMode]);

  const addFiles = async (files: File[]) => {
    if (!files.length || busy || loading) return;
    setError("");
    setStatus("");
    if (files.length + jobs.length > 20 || [...jobs.map((job) => job.file), ...files].reduce((sum, file) => sum + file.size, 0) > 150 * 1024 * 1024) {
      setError("한 번에 최대 20장, 합계 150MB까지 선택해주세요.");
      return;
    }
    const accepted = files.filter((file) => ["image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp"].includes(file.type) && file.size <= 30 * 1024 * 1024);
    if (accepted.length !== files.length) setError("지원하지 않는 형식이나 30MB를 초과한 파일은 제외했습니다.");
    if (!accepted.length) return;
    const next = accepted.map((file) => ({ id: nextJobId.current++, file, fit: "crop" as Fit, position: 0.5, outcome: "대기" }));
    setJobs((items) => [...items, ...next]);
    if (!jobs.length) await selectJob(next[0]);
  };

  const removeJob = (id: number) => {
    const remaining = jobs.filter((job) => job.id !== id);
    setJobs(remaining);
    setStatus("");
    setError("");
    if (activeId === id) {
      if (remaining.length) void selectJob(remaining[0]);
      else { setImage(null); setImageSize({ width: 0, height: 0 }); setFileName(""); setActiveId(null); sourceRef.current = null; }
    }
  };

  const getConvertInfo = () => {


    if(!imageSize.width || !selectedType)
      return null;



    if(selectedType === "thumbnail"){


      return {

        width:selectedPlatform.thumbnail.width,

        height:selectedPlatform.thumbnail.height,

        warning:false,

      };


    }



    const ratio =
      selectedPlatform.detail.width /
      imageSize.width;



    const height =
      Math.round(
        imageSize.height * ratio
      );



    return {

      width:selectedPlatform.detail.width,

      height,

      warning:
        height > selectedPlatform.detail.maxHeight,

    };


  };
  const convertImage = async () => {
    if (!jobs.length || busy || loading) return;
    setBusy(true);
    setError("");
    setStatus("변환 중…");
    setJobs((items) => items.map((job) => ({ ...job, outcome: "대기" })));
    let downloadUrl: string | undefined;
    try {
      const archive = new JSZip();
      let single: Blob | undefined;
      let singleName = "";
      let success = 0;
      let archiveBytes = 0;
      for (const [jobIndex, job] of jobs.entries()) {
        let sourceUrl: string | undefined;
        try {
          setStatus(`이미지 변환 ${jobIndex + 1}/${jobs.length} · ${job.file.name}`);
          await new Promise((resolve) => setTimeout(resolve, 0));
          sourceUrl = URL.createObjectURL(job.file);
          const img = new Image();
          img.src = sourceUrl;
          try { await img.decode(); } catch { throw new Error("이미지를 읽을 수 없습니다."); }
          if (!img.naturalWidth || img.naturalWidth * img.naturalHeight > 40_000_000) throw new Error("4천만 픽셀을 초과합니다.");
          const stem = job.file.name.replace(/\.[^.]+$/, "").replace(/[\/\\:*?"<>|\x00-\x1f]/g, "_").replace(/^\.+$/, "image").slice(0, 100) || "image";
          const preset = selectedType === "thumbnail" ? selectedPlatform.thumbnail : selectedPlatform.detail;
          const maxBytes = preset.maxBytes ?? Infinity;
          const outputs: { name: string; blob: Blob }[] = [];
          if (selectedType === "thumbnail") {
            const canvas = document.createElement("canvas");
            drawThumbnail(canvas, img, selectedPlatform.thumbnail.width, job.fit, job.position);
            outputs.push({ name: `${stem}_대표이미지.${outputFormat}`, blob: await encodeImage(canvas, outputFormat, maxBytes, quality) });
          } else {
            const width = selectedPlatform.detail.width;
            const ratio = width / img.naturalWidth;
            const totalHeight = Math.max(1, Math.round(img.naturalHeight * ratio));
            const maxHeight = selectedPlatform.detail.maxHeight;
            if (Math.ceil(totalHeight / maxHeight) > 100 || width * totalHeight > 80_000_000) throw new Error("변환 결과가 너무 큽니다. 원본을 나눠주세요.");
            for (let y = 0, index = 1; y < totalHeight; y += maxHeight, index++) {
              const canvas = document.createElement("canvas");
              canvas.width = width;
              canvas.height = Math.min(maxHeight, totalHeight - y);
              const ctx = canvas.getContext("2d");
              if (!ctx) throw new Error("이미지 처리를 사용할 수 없습니다.");
              ctx.fillStyle = "#fff";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, y / ratio, img.naturalWidth, canvas.height / ratio, 0, 0, width, canvas.height);
              outputs.push({ name: `${stem}_상세페이지_${String(index).padStart(2, "0")}.${outputFormat}`, blob: await encodeImage(canvas, outputFormat, maxBytes, quality) });
            }
          }
          const bytes = outputs.reduce((sum, output) => sum + output.blob.size, 0);
          if (archiveBytes + bytes > 200 * 1024 * 1024) throw new Error("전체 결과가 200MB를 초과합니다. 파일 수를 줄여주세요.");
          archiveBytes += bytes;
          for (const output of outputs) archive.file(jobs.length > 1 ? `${String(jobIndex + 1).padStart(2, "0")}_${stem}/${output.name}` : output.name, output.blob);
          single = outputs[0].blob;
          singleName = outputs[0].name;
          success++;
          setJobs((items) => items.map((item) => item.id === job.id ? { ...item, outcome: `완료 · ${outputs.length}개 파일` } : item));
        } catch (err) {
          const message = err instanceof Error ? err.message : "변환 실패";
          setJobs((items) => items.map((item) => item.id === job.id ? { ...item, outcome: `실패 · ${message}` } : item));
        } finally { if (sourceUrl) URL.revokeObjectURL(sourceUrl); }
      }
      if (!success) throw new Error("변환된 이미지가 없습니다. 파일별 실패 사유를 확인해주세요.");
      const result = jobs.length === 1 && selectedType === "thumbnail" ? single! : await archive.generateAsync({ type: "blob" }, (metadata) => setStatus(`ZIP 생성 ${Math.round(metadata.percent)}%`));
      const name = jobs.length === 1 && selectedType === "thumbnail" ? singleName : `${selectedPlatform.name.replace(/[\/\\]/g, "_")}_이미지.zip`;
      if (success < jobs.length) setError(`${jobs.length - success}장 변환 실패. 성공한 ${success}장만 ZIP에 포함했습니다. 파일별 사유를 확인해주세요.`);
      downloadUrl = URL.createObjectURL(result);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setStatus(`변환 ${success}/${jobs.length}장 완료 · ${(result.size / 1024 / 1024).toFixed(2)}MB · 다운로드를 요청했습니다.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "변환에 실패했습니다. 다른 이미지로 다시 시도해주세요.");
      setStatus("");
    } finally {
      if (downloadUrl) { const url = downloadUrl; setTimeout(() => URL.revokeObjectURL(url), 60_000); }
      setBusy(false);
    }
  };

  const info = getConvertInfo();
  const sliceCount = info && selectedType === "detail" ? Math.ceil(info.height / selectedPlatform.detail.maxHeight) : 1;
  const shortNames: Record<string, string> = { naver: "스마트스토어", coupang: "쿠팡", instagram: "인스타그램", "11st": "11번가", esm: "G마켓·옥션" };
  const channelMarks: Record<string, string> = { naver: "N", coupang: "c", instagram: "◎", "11st": "11", esm: "G" };
  const disabled = busy || loading;

  return (
    <main className="studio">
      <header className="site-header">
        <Link className="brand" href="/" aria-label="샵몽 홈"><span className="brand-mark"><Crop size={23} strokeWidth={2.5} /></span><span>샵몽<span className="brand-dot">.</span></span></Link>
        <span className="header-divider" />
        <span className="header-label">셀러를 위한 이미지 작업실</span>
        <div className="header-note"><ShieldCheck size={15} /> 이미지는 내 기기에서만 처리돼요</div>
      </header>

      <div className="studio-body">
        <section className="intro">
          <div><p className="eyebrow"><span /> LESS EDITING, MORE SELLING</p><h1>상품 사진, 판매할 준비 끝.</h1><p className="intro-description">업로드하고, 규격을 고르고, 한 번에 내려받으세요.</p></div>
          <div className="workflow" aria-label="작업 순서"><span className={jobs.length ? "step done" : "step current"}><b>{jobs.length ? <Check size={11} /> : "1"}</b>이미지 추가</span><span className="step-line"/><span className={jobs.length ? "step current" : "step"}><b>2</b>규격 설정</span><span className="step-line"/><span className="step"><b>3</b>다운로드</span></div>
        </section>

        {error && <div role="alert" className="notice error-notice"><Info size={17} /><span>{error}</span><button type="button" aria-label="오류 알림 닫기" onClick={() => setError("")}><X size={15}/></button></div>}
        <p role="status" className={loading || status ? "notice status-notice" : "sr-only"}>{loading ? "이미지 읽는 중…" : status}</p>

        <fieldset disabled={disabled} className="workspace" aria-label="이미지 변환 작업실">
          <section className="files-panel" aria-labelledby="files-title">
            <div className="panel-heading"><h2 id="files-title">내 이미지 <span className="count-badge">{jobs.length.toString().padStart(2, "0")}</span></h2><button type="button" className="icon-button" aria-label="이미지 추가" onClick={() => inputRef.current?.click()}><Plus size={18}/></button></div>
            <input ref={inputRef} id="image-upload" className="sr-only" type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif,image/bmp" aria-label="이미지 파일 선택" onChange={(event) => { const files = Array.from(event.target.files ?? []); event.target.value = ""; void addFiles(files); }} />
            <button type="button" className={`upload-zone ${dragging ? "dragging" : ""}`} onClick={() => inputRef.current?.click()} onDragOver={(event) => { event.preventDefault(); if (!disabled) setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); void addFiles(Array.from(event.dataTransfer.files)); }}>
              <span className="upload-icon"><Upload size={21}/></span><strong>이미지를 놓아주세요</strong><span>또는 클릭해서 파일 선택</span><small>최대 20장 · 파일당 30MB</small>
            </button>
            {jobs.length ? <ul className="file-list">{jobs.map((job, index) => <li key={job.id} className={`file-row ${activeId === job.id ? "active" : ""}`}>
              <button type="button" className="file-select" aria-label={`${job.file.name} 미리보기 ${index + 1}`} aria-pressed={activeId === job.id} onClick={() => { setError(""); void selectJob(job); }}><FileThumbnail file={job.file}/><span className="file-text"><strong>{job.file.name}</strong><small className={job.outcome.startsWith("실패") ? "file-error" : ""}>{job.outcome === "대기" ? `${(job.file.size / 1024 / 1024).toFixed(1)} MB · 변환 대기` : job.outcome}</small></span></button>
              <button type="button" className="file-remove" aria-label={`${job.file.name} 삭제 ${index + 1}`} onClick={() => removeJob(job.id)}><X size={13}/></button>
            </li>)}</ul> : <div className="files-empty"><div className="ghost-row"><span/><i/><i/></div><div className="ghost-row"><span/><i/><i/></div><p>선택한 이미지가<br/>여기에 차곡차곡 모여요.</p></div>}
            <div className="files-help"><Info size={14}/><p>JPG, PNG, WebP, GIF, BMP<br/>합계 150MB · 이미지당 4천만 픽셀<br/>GIF는 정지 이미지로 변환돼요.</p></div>
          </section>

          <section className="preview-panel" aria-labelledby="preview-title">
            <div className="preview-toolbar"><h2 id="preview-title">미리보기 <span className="live-badge"><span/> LIVE</span></h2><div className="preview-tabs" aria-label="미리보기 종류"><button type="button" aria-pressed={previewMode === "original"} onClick={() => setPreviewMode("original")}>원본</button><button type="button" aria-pressed={previewMode === "result"} onClick={() => setPreviewMode("result")}>변환 결과</button></div></div>
            <div className={`preview-stage ${image ? "has-image" : ""}`} onDragOver={(event) => { event.preventDefault(); }} onDrop={(event) => { event.preventDefault(); void addFiles(Array.from(event.dataTransfer.files)); }}>
              {image ? <>
                <div className="canvas-caption"><span className={`channel-dot ${selectedPlatform.id}`}/>{previewMode === "original" ? "원본 이미지" : `${shortNames[selectedPlatform.id]} · ${selectedType === "thumbnail" ? "대표이미지" : "상세페이지"}`}</div>
                <div className={`image-surface ${selectedType === "detail" && previewMode === "result" ? "detail-surface" : ""}`}>
                  {selectedType === "thumbnail" && previewMode === "result" ? <canvas ref={previewRef} aria-label="대표이미지 변환 결과"/> : <>
                    {/* Local object URLs don't require Next image optimization. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt={previewMode === "original" ? "원본 이미지" : "상세페이지 전체 미리보기"}/>
                    {selectedType === "detail" && previewMode === "result" && sliceCount > 1 && <span className="slice-overlay">{sliceCount}개 이미지로 나눠 저장</span>}
                  </>}
                </div>
                <span className="dimension-label">{previewMode === "original" ? `${imageSize.width} × ${imageSize.height}` : info ? `${info.width} × ${info.height}` : ""}<small> px{selectedType === "detail" && previewMode === "result" ? " · 분할 전 전체" : ""}</small></span>
              </> : loading ? <div className="preview-empty"><LoaderCircle className="spin" size={30}/><h3>이미지를 준비하고 있어요</h3></div> : <div className="preview-empty">
                <div className="empty-art" aria-hidden="true"><div className="art-card art-back"><Images size={40} strokeWidth={1}/></div><div className="art-card art-front"><ImageIcon size={48} strokeWidth={1.2}/><span/><i/></div><div className="art-spark"><Sparkles size={21}/></div><span className="art-dimension">1000 × 1000</span></div>
                <h3>좋은 상품 사진의 마지막 한 단계</h3><p>이미지를 추가하면<br/>판매 채널에 맞춘 결과를 바로 볼 수 있어요.</p><button type="button" className="empty-upload" onClick={() => inputRef.current?.click()}>첫 이미지 추가하기 <ArrowRight size={15}/></button>
              </div>}
            </div>
            {image && selectedType === "thumbnail" && fit === "crop" && previewMode === "result" && <div className="preview-crop-controls"><label htmlFor="crop-position"><Crop size={13}/>자르기 위치</label><input id="crop-position" aria-label="자르기 위치" type="range" min="0" max="1" step="0.01" value={position} onChange={(event) => updateFraming(fit, Number(event.target.value))}/><span>{Math.round(position * 100)}%</span></div>}
            <div className="preview-footer"><span><Maximize size={13}/>{image ? <span className="preview-filename">{fileName}</span> : "크롭과 여백을 미리 확인하세요"}</span><span>{image ? `${jobs.findIndex((job) => job.id === activeId) + 1} / ${jobs.length}` : "실시간 미리보기"}</span></div>
            <div className="preview-tip"><Sparkles size={15}/><p>{image ? "목록에서 이미지를 선택해 자르기 위치를 각각 조절할 수 있어요." : "여러 장도 한 번에. 같은 설정으로 바꾸고 ZIP으로 내려받으세요."}</p></div>
          </section>

          <aside className="settings-panel" aria-labelledby="settings-title">
            <div className="panel-heading settings-heading"><h2 id="settings-title"><SlidersHorizontal size={16}/> 변환 설정</h2><span>전체 이미지에 적용</span></div>
            <section className="setting-group"><div className="setting-label"><span>01</span><h3>판매 채널</h3></div><div className="channel-grid">{platforms.map((platform) => <button type="button" key={platform.id} className={`channel-button ${selectedPlatform.id === platform.id ? "selected" : ""}`} aria-label={platform.name} aria-pressed={selectedPlatform.id === platform.id} onClick={() => { setSelectedPlatform(platform); if (selectedType === "thumbnail" && platform.thumbnail.allowedOutputs && !platform.thumbnail.allowedOutputs.includes(outputFormat)) setOutputFormat("jpg"); }}><span className={`channel-logo ${platform.id}`}>{channelMarks[platform.id]}</span><span>{shortNames[platform.id]}</span>{selectedPlatform.id === platform.id && <Check className="channel-check" size={12}/>}</button>)}</div></section>
            <section className="setting-group"><div className="setting-label"><span>02</span><h3>이미지 용도</h3></div><div className="segmented type-tabs"><button type="button" aria-pressed={selectedType === "thumbnail"} onClick={() => { setSelectedType("thumbnail"); if (selectedPlatform.thumbnail.allowedOutputs && !selectedPlatform.thumbnail.allowedOutputs.includes(outputFormat)) setOutputFormat("jpg"); }}><ImageIcon size={14}/>대표이미지</button><button type="button" aria-pressed={selectedType === "detail"} onClick={() => setSelectedType("detail")}><FileImage size={14}/>{selectedPlatform.id === "instagram" ? "피드 세로형" : "상세페이지"}</button></div><div className="preset-summary"><span>{selectedType === "thumbnail" ? "출력 크기" : "출력 가로"}</span><strong>{selectedType === "thumbnail" ? `${selectedPlatform.thumbnail.width} × ${selectedPlatform.thumbnail.height}` : selectedPlatform.detail.width}<small> px</small></strong></div>
              {selectedType === "thumbnail" ? <><label className="sub-label">이미지 맞추기</label><div className="fit-options"><button type="button" aria-pressed={fit === "crop"} onClick={() => updateFraming("crop", position)}><Crop size={15}/><span>꽉 채우기<small>가장자리 자르기</small></span></button><button type="button" aria-pressed={fit === "contain"} onClick={() => updateFraming("contain", 0.5)}><Maximize size={15}/><span>전체 보존<small>흰 여백 추가</small></span></button></div></> : <p className="setting-description">{selectedPlatform.detail.maxHeight.toLocaleString()}px 높이로 자동 분할해 ZIP으로 저장해요.</p>}
            </section>
            <section className="setting-group"><div className="setting-label"><span>03</span><h3>저장 형식</h3></div><div className="segmented format-tabs">{(["jpg", "png", "webp"] as const).map((format) => { const unsupported = selectedType === "thumbnail" && selectedPlatform.thumbnail.allowedOutputs !== null && !selectedPlatform.thumbnail.allowedOutputs.includes(format); return <button type="button" key={format} aria-pressed={outputFormat === format} disabled={unsupported} title={unsupported ? "공식 업로드 지원이 확인되지 않은 형식입니다" : undefined} onClick={() => setOutputFormat(format)}>{format === "webp" ? "WebP" : format.toUpperCase()}</button>; })}</div><p className="format-description">{outputFormat === "jpg" ? "호환성이 좋은 형식 · 흰 배경으로 저장" : outputFormat === "png" ? "화질 손실 없이 저장 · 파일 크기가 클 수 있어요" : "작은 파일 크기 · 채널별 업로드 지원을 확인하세요"}</p>{outputFormat !== "png" && <label className="slider-label">출력 품질 <span>{Math.round(quality * 100)}%</span><input aria-label="출력 품질" type="range" min="0.35" max="1" step="0.05" value={quality} onChange={(event) => setQuality(Number(event.target.value))}/><small>작은 용량 <span>선명한 화질</span></small></label>}</section>
            <details className="spec-details"><summary><span><Info size={14}/>규격 정보와 출처</span><ChevronDown size={14}/></summary><div><strong>{selectedPlatform.evidence.status}</strong><p>{selectedPlatform.evidence.summary}</p><p>압축 기준: {selectedType === "thumbnail" ? selectedPlatform.thumbnail.maxSize : selectedPlatform.detail.maxSize}. 용량이 크면 품질을 자동으로 낮춰요.</p>{selectedPlatform.evidence.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a>)}{selectedPlatform.id === "naver" && selectedType === "thumbnail" && <p>WebP는 공식 업로드 지원이 확인되지 않아 선택에서 제외했어요.</p>}</div></details>
          </aside>
        </fieldset>

        <footer className="download-bar"><div className="download-summary"><span className="download-icon"><Images size={20}/></span><div><strong>{jobs.length ? `${jobs.length}장 변환 준비` : "이미지를 추가하고 시작해보세요"}</strong><p>{jobs.length ? `${shortNames[selectedPlatform.id]} · ${selectedType === "thumbnail" ? `${selectedPlatform.thumbnail.width} × ${selectedPlatform.thumbnail.height}px` : `가로 ${selectedPlatform.detail.width}px · 자동 분할`} · ${outputFormat.toUpperCase()}` : "복잡한 편집 없이, 판매 채널에 딱 맞게."}</p></div></div><div className="download-actions"><span className="download-hint">{jobs.length > 1 || selectedType === "detail" ? "ZIP 파일로 한 번에" : "원본은 그대로 보관돼요"}</span><button type="button" className="download-button" disabled={!jobs.length || disabled} onClick={convertImage}>{busy ? <LoaderCircle className="spin" size={17}/> : <ArrowDownToLine size={17}/>}<span>{busy ? "변환 중…" : jobs.length > 1 ? `${jobs.length}장 변환하고 다운로드` : "변환하고 다운로드"}</span>{!busy && <ArrowRight size={16}/>}</button></div></footer>
        <div className="site-footer"><span>작업은 가볍게. 가능성은 더 크게.</span><span>MADE FOR YOUR NEXT SALE <span className="tiny-spark">✳</span></span></div>
      </div>
    </main>
  );
}
