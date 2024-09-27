import LoginForm from "@/app/(auth)/login/login-form";
import { ModeToggle } from "@/components/mode-toggle";
import Image from "next/image";

export default function LoginPage() {
  return (
    <section className="h-[65vh] flex items-center justify-center">
  <div className="container max-w-screen-lg px-4 py-12">
    <div className="flex h-fit flex-wrap items-center justify-center lg:justify-between border border-gray-300 dark:border-gray-500 p-8 bg-white  dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="shrink-1 mb-12 grow-0 basis-auto md:mb-0 md:w-4/12 md:shrink-0 lg:w-5/12 xl:w-5/12">
        <Image src="/images/pickleball-sport-player.jpg" alt="login" width={500} height={500} />
      </div>
      <div className="mb-12 md:mb-0 md:w-8/12 lg:w-7/12 xl:w-7/12">
        <LoginForm />
      </div>
    </div>
  </div>
</section>

  );
}
