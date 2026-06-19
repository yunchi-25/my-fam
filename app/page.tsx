import { Show, SignInButton } from "@clerk/nextjs";
import PhotoGallery from "./photo-gallery";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#f7f4ee] text-stone-950">
      <Show when="signed-out">
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
      </Show>

      <Show when="signed-in">
        <PhotoGallery />
      </Show>
    </main>
  );
}
