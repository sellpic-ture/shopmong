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



      ctx.drawImage(

        img,

        0,

        0,

        canvas.width,

        canvas.height

      );



      const link =
        document.createElement("a");



      link.download =
        `${selectedPlatform.name}_대표이미지.jpg`;



      link.href =
        canvas.toDataURL("image/jpeg");



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

              "image/jpeg",

              0.9

            )

        );



      if(blob){


        zip.file(

          `${selectedPlatform.name}_상세페이지_${String(index).padStart(2,"0")}.jpg`,

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

          <div className="flex items-center gap-3">
  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
    <WandSparkles size={22} strokeWidth={2.2} />
  </div>

  <div>
    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
      샵몽
    </h1>

    <p className="mt-1 text-sm text-gray-500">
      쇼핑 플랫폼별 이미지 규격 자동 변환
    </p>
    <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
     네이버 스마트스토어, 쿠팡, 인스타그램, 11번가, G마켓·옥션 등
      쇼핑몰 플랫폼별 상품 이미지 규격에 맞게 대표이미지와 상세페이지 이미지를
     간편하게 변환할 수 있습니다.
    </p>
  </div>
</div>

        </header>




        {/* 이미지 업로드 */}

        <section className="rounded-2xl border border-gray-300 bg-white p-10 text-center shadow-sm">


          {image ? (

            <img

              ref={imageRef}

              src={image}

              alt="preview"

              className="mx-auto max-h-72 rounded-xl object-contain"

            />

          ) : (

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
  <Upload size={25} />
</div>

          )}



          <h2 className="mt-5 font-semibold text-gray-900">

            {fileName || "이미지를 업로드하세요"}

          </h2>




          <label className="mt-5 inline-block cursor-pointer text-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white">


            이미지 선택


            <input

              type="file"

              accept="image/*"

              className="hidden"

              onChange={uploadImage}

            />


          </label>



        </section>







        {/* 플랫폼 선택 */}


        <section className="mt-6 rounded-2xl border border-gray-300 bg-white p-6 shadow-sm">


          <h2 className="text-xl font-bold text-gray-900">

            플랫폼 선택

          </h2>



          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">


            {platforms.map((platform)=>(


              <button


                key={platform.name}


onClick={() => {
  setSelectedPlatform(platform);
  setSelectedType("thumbnail");
}}



                className={`cursor-pointer rounded-xl border p-4 font-semibold transition-all duration-150

${
  selectedPlatform.name === platform.name

  ? "border-blue-600 bg-blue-50 text-blue-700"

  : "border-gray-200 text-gray-800 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-sm"
}

`}


              >

                {platform.name}


              </button>


            ))}


          </div>


        </section>







        {/* 규격 선택 */}


        <section className="mt-6 rounded-2xl border border-gray-300 bg-white p-6 shadow-sm">


          <h2 className="text-xl font-bold text-gray-900">

            변환 규격 선택

          </h2>



          <div className="mt-5 grid gap-6 md:grid-cols-2">



            <button


              onClick={()=>setSelectedType("thumbnail")}


              className={`cursor-pointer rounded-xl border p-6 text-left transition-all duration-150
${
  selectedType === "thumbnail"
    ? "border-blue-600 bg-blue-50"
    : "border-gray-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-sm"
}
`}


            >


              <h3 className="text-lg font-bold text-gray-900">

                <div className="flex items-center gap-3">
  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
    <ImageIcon size={20} />
  </div>

  <h3 className="text-lg font-bold text-gray-900">
    대표이미지 규격
  </h3>
</div>

              </h3>



              <p className="mt-4 font-semibold text-gray-900">

                {selectedPlatform.thumbnail.sizeText}

              </p>



              <p className="mt-2 text-sm text-gray-700">

                {selectedPlatform.thumbnail.maxSize}

              </p>



              <p className="text-sm text-gray-700">

                {selectedPlatform.thumbnail.format}

              </p>



            </button>







            <button


              onClick={()=>setSelectedType("detail")}


              className={`cursor-pointer rounded-xl border p-6 text-left transition-all duration-150
${
  selectedType === "detail"
    ? "border-blue-600 bg-blue-50"
    : "border-gray-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-sm"
}
`}


            >


              <h3 className="text-lg font-bold text-gray-900">

                <div className="flex items-center gap-3">
  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
    <FileImage size={20} />
  </div>

  <h3 className="text-lg font-bold text-gray-900">
    상세페이지 규격
  </h3>
</div>

              </h3>



              <p className="mt-4 font-semibold text-gray-900">

                {selectedPlatform.detail.sizeText}

              </p>



              <p className="mt-2 text-sm text-gray-700">

                {selectedPlatform.detail.height}

              </p>



              <p className="text-sm text-gray-700">

                {selectedPlatform.detail.maxSize}

              </p>



            </button>



          </div>


        </section>
                {/* 변환 예상 */}

        {imageSize.width > 0 && selectedType && (

          <section className="mt-6 rounded-2xl border border-gray-300 bg-white p-6 shadow-sm">


            <h2 className="text-xl font-bold text-gray-900">

              📊 변환 예상

            </h2>



            <div className="mt-4 space-y-2 text-gray-800">


              <p>

                원본 이미지 :

                <span className="ml-2 font-semibold">

                  {imageSize.width} × {imageSize.height}px

                </span>

              </p>



              <p>

                변환 결과 :

                <span className="ml-2 font-semibold">

                  {getConvertInfo()?.width} × {getConvertInfo()?.height}px

                </span>

              </p>



              {getConvertInfo()?.warning && (

                <p className="mt-4 font-bold text-blue-600">

                  ℹ️ 업로드 규격에 맞춰 자동 분할됩니다.

                </p>

              )}



            </div>


          </section>

        )}







        {/* 변환 버튼 */}


        <div className="mt-8 text-center">


          <button


            onClick={convertImage}


            className="rounded-xl bg-black px-10 py-4 text-lg font-bold text-white hover:bg-gray-800"


          >

            변환하기 →

          </button>



        </div>



      </div>

    </main>

  );

}