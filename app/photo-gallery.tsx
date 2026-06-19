"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { SignInButton, useUser } from "@clerk/react";

type Photo = {
  id: string;
  src: string;
  description: string;
  createdAt: string;
};

const MAX_FILE_SIZE = 2.5 * 1024 * 1024;

export default function PhotoGallery() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#f7f4ee] px-6 text-stone-950">
        <p className="text-sm font-semibold text-stone-600">
          갤러리를 준비하고 있습니다.
        </p>
      </main>
    );
  }

  if (!isSignedIn || !user) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-[#f7f4ee] text-stone-950">
        <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
          <p className="mb-4 text-sm font-semibold text-rose-700">
            가족 사진은 로그인 후에만 볼 수 있어요
          </p>
          <h1 className="max-w-2xl text-4xl font-bold tracking-normal sm:text-5xl">
            나의 가족 이야기
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-stone-700 sm:text-lg">
            소중한 사진과 그날의 이야기를 한곳에 모아두는 가족 전용 사진
            갤러리입니다.
          </p>
          <SignInButton mode="modal">
            <button className="mt-8 rounded-lg bg-stone-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800">
              로그인하고 갤러리 보기
            </button>
          </SignInButton>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#f7f4ee] text-stone-950">
      <GalleryWorkspace
        key={user.id}
        storageKey={`family-photos:${user.id}`}
        userName={user.firstName}
      />
    </main>
  );
}

function loadPhotos(storageKey: string) {
  if (typeof window === "undefined") {
    return [];
  }

  const savedPhotos = window.localStorage.getItem(storageKey);
  if (!savedPhotos) {
    return [];
  }

  try {
    return JSON.parse(savedPhotos) as Photo[];
  } catch {
    return [];
  }
}

function GalleryWorkspace({
  storageKey,
  userName,
}: {
  storageKey: string;
  userName: string | null;
}) {
  const [photos, setPhotos] = useState<Photo[]>(() => loadPhotos(storageKey));
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileData, setFileData] = useState("");
  const [error, setError] = useState("");
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(photos));
  }, [photos, storageKey]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setError("");

    if (!file) {
      setFileName("");
      setFileData("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 등록할 수 있습니다.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("MVP에서는 2.5MB 이하의 이미지만 등록할 수 있습니다.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFileName(file.name);
      setFileData(String(reader.result));
    };
    reader.onerror = () => {
      setError("이미지를 읽는 중 문제가 발생했습니다.");
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!fileData) {
      setError("등록할 사진을 먼저 선택해 주세요.");
      return;
    }

    const nextPhoto: Photo = {
      id: crypto.randomUUID(),
      src: fileData,
      description: description.trim(),
      createdAt: new Date().toISOString(),
    };

    setPhotos((currentPhotos) => [nextPhoto, ...currentPhotos]);
    setDescription("");
    setFileName("");
    setFileData("");
    event.currentTarget.reset();
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8">
      <div className="mb-8 flex flex-col gap-4 border-b border-stone-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-rose-700">
            {userName ? `${userName}님의 갤러리` : "가족 갤러리"}
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            나의 가족 이야기
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-700">
            사진을 등록하고 그날의 기억을 짧게 남겨보세요. 등록한 사진은
            이 브라우저에 저장됩니다.
          </p>
        </div>
        <p className="text-sm text-stone-600">등록된 사진 {photos.length}장</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mb-8 grid gap-4 rounded-lg border border-stone-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_2fr_auto]"
      >
        <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-stone-300 bg-stone-50 px-4 py-5 text-center text-sm text-stone-700 transition hover:border-stone-500 hover:bg-stone-100">
          <span className="font-semibold">사진 선택</span>
          <span className="mt-1 max-w-full truncate text-xs text-stone-500">
            {fileName || "PNG, JPG, GIF 등 이미지"}
          </span>
          <input
            className="sr-only"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-stone-800">사진 설명</span>
          <textarea
            className="min-h-28 resize-none rounded-md border border-stone-300 px-3 py-2 text-sm outline-none transition placeholder:text-stone-400 focus:border-stone-950"
            value={description}
            maxLength={240}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="예: 할머니 생신날, 모두 모여 찍은 사진"
          />
        </label>

        <button className="h-12 rounded-lg bg-rose-700 px-5 text-sm font-semibold text-white transition hover:bg-rose-800 md:self-end">
          등록하기
        </button>

        {error ? (
          <p className="text-sm font-medium text-red-700 md:col-span-3">
            {error}
          </p>
        ) : null}
      </form>

      {photos.length === 0 ? (
        <div className="flex min-h-80 items-center justify-center rounded-lg border border-dashed border-stone-300 bg-white px-6 text-center">
          <div>
            <h2 className="text-xl font-bold text-stone-900">
              아직 등록된 사진이 없습니다
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-stone-600">
              첫 가족 사진을 등록하면 이곳에 masonry 갤러리가 만들어집니다.
            </p>
          </div>
        </div>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {photos.map((photo) => (
            <button
              className="mb-4 block w-full break-inside-avoid overflow-hidden rounded-lg bg-white text-left shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-0.5 hover:shadow-md"
              key={photo.id}
              type="button"
              onClick={() => setActivePhoto(photo)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- MVP uploads use local data URLs with unknown dimensions. */}
              <img
                alt={photo.description || "가족 사진"}
                className="h-auto w-full bg-stone-100 object-cover"
                src={photo.src}
              />
              {photo.description ? (
                <p className="px-4 py-3 text-sm leading-6 text-stone-700">
                  {photo.description}
                </p>
              ) : null}
            </button>
          ))}
        </div>
      )}

      {activePhoto ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3">
              <p className="text-sm font-semibold text-stone-800">사진 보기</p>
              <button
                className="rounded-md px-3 py-1 text-sm font-semibold text-stone-600 transition hover:bg-stone-100 hover:text-stone-950"
                type="button"
                onClick={() => setActivePhoto(null)}
              >
                닫기
              </button>
            </div>
            <div className="grid max-h-[calc(92vh-3.25rem)] overflow-auto lg:grid-cols-[minmax(0,1fr)_22rem]">
              <div className="flex items-center justify-center bg-stone-950">
                {/* eslint-disable-next-line @next/next/no-img-element -- MVP uploads use local data URLs with unknown dimensions. */}
                <img
                  alt={activePhoto.description || "확대된 가족 사진"}
                  className="max-h-[75vh] w-full object-contain"
                  src={activePhoto.src}
                />
              </div>
              <aside className="p-5">
                <h2 className="text-lg font-bold text-stone-950">
                  사진 설명
                </h2>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-stone-700">
                  {activePhoto.description || "아직 설명이 없습니다."}
                </p>
                <p className="mt-6 text-xs text-stone-500">
                  등록일{" "}
                  {new Intl.DateTimeFormat("ko-KR", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(activePhoto.createdAt))}
                </p>
              </aside>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
