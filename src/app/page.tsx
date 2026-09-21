"use client";

import { useState, useRef } from "react";
import JSZip from "jszip";
import {
  ArrowRight,
  Check,
  FileImage,
  Image as ImageIcon,
  ImagePlus,
  Upload,
  WandSparkles,
} from "lucide-react";


const platforms = [
  {
    name: "네이버 스마트스토어",

    thumbnail: {
      width: 640,
      height: 640,
      sizeText: "640 × 640px",
      maxSize: "최대 4MB",
      format: "JPG, PNG, GIF, BMP",
    },

    detail: {
      width: 860,
      maxHeight: 5000,
      sizeText: "가로 860px 권장",
      height: "세로 5,000px 이하 권장",
      maxSize: "최대 20MB",
    },
  },


  {
    name: "쿠팡",

    thumbnail: {
      width: 500,
      height: 500,
      sizeText: "500 × 500px",
      maxSize: "최대 2MB",
      format: "JPG, PNG",
    },

    detail: {
      width: 780,
      maxHeight: 3000,
      sizeText: "가로 780px 권장",
      height: "이미지 최대 3,000px 권장",
      maxSize: "이미지당 최대 20MB",
    },
  },


  {
    name: "인스타그램",

    thumbnail: {
      width: 1080,
      height: 1080,
      sizeText: "1080 × 1080px",
      maxSize: "-",
      format: "JPG, PNG",
    },

    detail: {
      width: 1080,
      maxHeight: 1350,
      sizeText: "1080 × 1350px",
      height: "스토리 1080 × 1920px",
      maxSize: "-",
    },
  },


  {
    name: "11번가",

    thumbnail: {
      width: 1000,
      height: 1000,
      sizeText: "1000 × 1000px",
      maxSize: "-",
      format: "JPG, PNG",
    },

    detail: {
      width: 800,
      maxHeight: 5000,
      sizeText: "가로 800px",
      height: "세로 제한 없음",
      maxSize: "-",
    },
  },


  {
    name: "G마켓 / 옥션",

    thumbnail: {
      width: 1000,
      height: 1000,
      sizeText: "1000 × 1000px",
      maxSize: "-",
      format: "JPG, PNG",
    },

    detail: {
      width: 860,
      maxHeight: 4000,
      sizeText: "가로 860px",
      height: "세로 최대 4,000px",
      maxSize: "-",
    },
  },
];



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


  const imageRef =
    useRef<HTMLImageElement | null>(null);



  const uploadImage = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {


    const file =
      e.target.files?.[0];


    if(!file) return;



    setFileName(file.name);



    const url =
      URL.createObjectURL(file);



    setImage(url);



    const img =
      new Image();



    img.onload = () => {

      setImageSize({

        width: img.width,

        height: img.height,

      });

    };


    img.src = url;


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


    if(!imageRef.current || !selectedType){

      alert("이미지와 변환 규격을 선택하세요.");

      return;

    }



    const img =
      imageRef.current;

    const mimeType =
    outputFormat === "jpg"
      ? "image/jpeg"
      : outputFormat === "png"
        ? "image/png"
        : "image/webp";

    const extension =
      outputFormat === "jpg"
        ? "jpg"
        : outputFormat;



    // 대표이미지 변환

    if(selectedType === "thumbnail"){


      const canvas =
        document.createElement("canvas");


      const ctx =
        canvas.getContext("2d");


      if(!ctx) return;



      canvas.width =
        selectedPlatform.thumbnail.width;


      canvas.height =
        selectedPlatform.thumbnail.height;



      const sourceWidth = img.naturalWidth;
const sourceHeight = img.naturalHeight;

const sourceRatio = sourceWidth / sourceHeight;
const targetRatio = canvas.width / canvas.height;

let cropWidth = sourceWidth;
let cropHeight = sourceHeight;
let cropX = 0;
let cropY = 0;

if (sourceRatio > targetRatio) {
  cropWidth = sourceHeight * targetRatio;
  cropX = (sourceWidth - cropWidth) / 2;
} else {
  cropHeight = sourceWidth / targetRatio;
  cropY = (sourceHeight - cropHeight) / 2;
}

ctx.drawImage(
  img,
  cropX,
  cropY,
  cropWidth,
  cropHeight,
  0,
  0,
  canvas.width,
  canvas.height
);



      const link =
        document.createElement("a");



      link.download =
  `${selectedPlatform.name}_대표이미지.${extension}`;

link.href =
  canvas.toDataURL(mimeType);



      link.click();



      return;

    }




    // 상세페이지 변환


    const targetWidth =
      selectedPlatform.detail.width;



    const maxHeight =
      selectedPlatform.detail.maxHeight;



    const ratio =
      targetWidth /
      img.naturalWidth;



    const totalHeight =
      Math.round(
        img.naturalHeight * ratio
      );



    const zip =
      new JSZip();



    let currentY = 0;

    let index = 1;



    while(currentY < totalHeight){



      const sliceHeight =
        Math.min(

          maxHeight,

          totalHeight - currentY

        );



      const canvas =
        document.createElement("canvas");



      const ctx =
        canvas.getContext("2d");



      if(!ctx) return;



      canvas.width =
        targetWidth;



      canvas.height =
        sliceHeight;



      ctx.drawImage(

        img,

        0,

        currentY / ratio,

        img.naturalWidth,

        sliceHeight / ratio,

        0,

        0,

        targetWidth,

        sliceHeight

      );




      const blob =
        await new Promise<Blob | null>(

          (resolve)=>

            canvas.toBlob(
              resolve,
              mimeType,
              0.9
           )

        );



      if(blob){


        zip.file(
  `${selectedPlatform.name}_상세페이지_${String(index).padStart(2, "0")}.${extension}`,
  blob
);


      }



      currentY += sliceHeight;

      index++;


    }




    const content =
      await zip.generateAsync({

        type:"blob"

      });



    const link =
      document.createElement("a");



    link.href =
      URL.createObjectURL(content);



    link.download =
      `${selectedPlatform.name}_상세페이지.zip`;



    link.click();


  };



  return (

    <main className="min-h-screen bg-white px-6 py-10">


      <div className="mx-auto max-w-5xl">
<header className="mb-10">
  <div className="flex items-start justify-between gap-6">
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
        <WandSparkles size={23} strokeWidth={2.2} />
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          샵몽
        </h1>

        <p className="mt-1 text-sm font-medium text-gray-500">
          쇼핑몰 이미지 규격, 간편하게 맞춰보세요
        </p>
      </div>
    </div>

    <div className="hidden rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-500 md:block">
      이미지 규격 자동 변환
    </div>
  </div>
</header>




        {/* 이미지 업로드 */}

        <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
  <div className="text-center">
    {image ? (
      <div className="mx-auto flex min-h-64 items-center justify-center rounded-2xl bg-gray-50 p-6">
        <img
          ref={imageRef}
          src={image}
          alt="업로드 이미지 미리보기"
          className="max-h-72 max-w-full rounded-xl object-contain shadow-sm"
        />
      </div>
    ) : (
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <ImagePlus size={32} strokeWidth={1.8} />
      </div>
    )}

    <h2 className="mt-6 text-lg font-bold text-gray-900">
      {fileName || "상품 이미지를 업로드하세요"}
    </h2>

    {!image && (
      <p className="mt-2 text-sm text-gray-500">
        JPG, PNG 등 이미지 파일을 선택해주세요.
      </p>
    )}

    <label className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700">
      <Upload size={18} strokeWidth={2} />
      {image ? "이미지 다시 선택" : "이미지 선택"}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={uploadImage}
      />
    </label>
  </div>
</section>







        {/* 플랫폼 선택 */}


        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
  <div>
    <h2 className="text-xl font-bold text-gray-900">플랫폼 선택</h2>
    <p className="mt-1 text-sm text-gray-500">
      변환할 쇼핑몰 플랫폼을 선택하세요.
    </p>
  </div>

  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {platforms.map((platform) => {
      const isSelected = selectedPlatform.name === platform.name;

      return (
        <button
          key={platform.name}
          type="button"
          onClick={() => setSelectedPlatform(platform)}
          className={`group rounded-xl border p-4 text-left transition-all duration-150 ${
            isSelected
              ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
              : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3
                className={`font-semibold ${
                  isSelected ? "text-blue-700" : "text-gray-900"
                }`}
              >
                {platform.name}
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                대표 {platform.thumbnail.width} ×{" "}
                {platform.thumbnail.height}px
              </p>

              <p className="mt-1 text-xs text-gray-500">
                상세 가로 {platform.detail.width}px
              </p>
            </div>

            {isSelected && (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                <Check size={15} strokeWidth={2.5} />
              </div>
            )}
          </div>
        </button>
      );
    })}
  </div>
</section>







        {/* 규격 선택 */}


        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
  <div>
    <h2 className="text-xl font-bold text-gray-900">변환 규격 선택</h2>
    <p className="mt-1 text-sm text-gray-500">
      사용할 이미지 규격을 선택하세요.
    </p>
  </div>

  <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
    <button
      type="button"
      onClick={() => setSelectedType("thumbnail")}
      className={`rounded-2xl border p-5 text-left transition-all ${
        selectedType === "thumbnail"
          ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${
              selectedType === "thumbnail"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            <ImageIcon size={21} />
          </div>

          <div>
            <h3 className="font-bold text-gray-900">
              대표이미지
            </h3>
            <p className="mt-0.5 text-xs text-gray-500">
              상품 목록에 표시되는 이미지
            </p>
          </div>
        </div>

        {selectedType === "thumbnail" && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
            <Check size={15} strokeWidth={2.5} />
          </div>
        )}
      </div>

      <div className="mt-5 rounded-xl bg-white/80 px-4 py-3">
        <p className="text-xs font-medium text-gray-400">변환 규격</p>
        <p className="mt-1 text-lg font-bold text-gray-900">
          {selectedPlatform.thumbnail.width} ×{" "}
          {selectedPlatform.thumbnail.height}px
        </p>
      </div>
    </button>

    <button
      type="button"
      onClick={() => setSelectedType("detail")}
      className={`rounded-2xl border p-5 text-left transition-all ${
        selectedType === "detail"
          ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${
              selectedType === "detail"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            <FileImage size={21} />
          </div>

          <div>
            <h3 className="font-bold text-gray-900">
              상세페이지
            </h3>
            <p className="mt-0.5 text-xs text-gray-500">
              상세페이지용 이미지로 변환
            </p>
          </div>
        </div>

        {selectedType === "detail" && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
            <Check size={15} strokeWidth={2.5} />
          </div>
        )}
      </div>

      <div className="mt-5 rounded-xl bg-white/80 px-4 py-3">
        <p className="text-xs font-medium text-gray-400">변환 규격</p>
        <p className="mt-1 text-lg font-bold text-gray-900">
          가로 {selectedPlatform.detail.width}px
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {selectedPlatform.detail.height}
        </p>
      </div>
    </button>
  </div>
</section>

{/* 출력 형식 선택 */}
<section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
  <div>
    <h2 className="text-xl font-bold text-gray-900">
      출력 형식 선택
    </h2>
    <p className="mt-1 text-sm text-gray-500">
      변환할 이미지의 파일 형식을 선택하세요.
    </p>
  </div>

  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
    {[
      {
        value: "jpg" as const,
        name: "JPG",
        description: "범용성이 높은 이미지 형식",
      },
      {
        value: "png" as const,
        name: "PNG",
        description: "화질 손실 없이 저장",
      },
      {
        value: "webp" as const,
        name: "WebP",
        description: "효율적인 이미지 형식",
      },
    ].map((format) => {
      const isSelected = outputFormat === format.value;

      return (
        <button
          key={format.value}
          type="button"
          onClick={() => setOutputFormat(format.value)}
          className={`rounded-xl border p-4 text-left transition-all ${
            isSelected
              ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
              : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3
                className={`font-bold ${
                  isSelected ? "text-blue-700" : "text-gray-900"
                }`}
              >
                {format.name}
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                {format.description}
              </p>
            </div>

            {isSelected && (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                <Check size={15} strokeWidth={2.5} />
              </div>
            )}
          </div>
        </button>
      );
    })}
  </div>
</section>

                {/* 변환 예상 */}

{imageSize.width > 0 && selectedType && (
  <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <div>
      <h2 className="text-xl font-bold text-gray-900">
        변환 예상
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        현재 선택한 플랫폼과 규격으로 변환됩니다.
      </p>
    </div>

    <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="rounded-2xl bg-gray-50 p-5">
        <p className="text-xs font-semibold text-gray-400">
          원본 이미지
        </p>

        <p className="mt-2 text-lg font-bold text-gray-900">
          {imageSize.width} × {imageSize.height}px
        </p>
      </div>

      <div className="rounded-2xl bg-blue-50 p-5">
        <p className="text-xs font-semibold text-blue-500">
          변환 결과
        </p>

        <p className="mt-2 text-lg font-bold text-gray-900">
          {getConvertInfo()?.width} × {getConvertInfo()?.height}px
        </p>

        <p className="mt-1 text-sm text-gray-500">
          {selectedPlatform.name} ·{" "}
          {selectedType === "thumbnail"
            ? "대표이미지"
            : "상세페이지"}
        </p>
      </div>
    </div>

    {getConvertInfo()?.warning && (
      <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
        <p className="text-sm leading-6 text-blue-700">
          업로드 규격에 맞춰 이미지가 자동 분할됩니다.
        </p>
      </div>
    )}
  </section>
)}







        {/* 변환 버튼 */}

<div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
  <button
    type="button"
    onClick={convertImage}
    className="flex w-full cursor-pointer items-center justify-center rounded-xl bg-gray-900 px-6 py-4 text-base font-bold text-white transition-all hover:bg-black active:scale-[0.99]"
  >
    변환하기
  </button>

<p className="mt-3 text-center text-xs text-gray-400">
  {selectedType === "thumbnail"
    ? `플랫폼 규격에 맞는 ${outputFormat.toUpperCase()} 이미지로 변환됩니다.`
    : `플랫폼 규격에 맞춰 크기 조정 후 ${outputFormat.toUpperCase()} ZIP 파일로 제공됩니다.`}
</p>
</div>



      </div>

    </main>

  );

}