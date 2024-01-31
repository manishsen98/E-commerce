"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  if (status == "loading") {
    return <h1>Loding......</h1>;
  } else if (!user) {
    router.push("sign-in");
    return null;
  } else {
    return (
      <div className="text-red-600">Home page is here and it is protected</div>
    );
  }
}
