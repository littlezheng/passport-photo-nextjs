import React, { Suspense } from "react";
import MakePhotoView from "@/views/MakePhotoView";

export default function MakePhotoPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MakePhotoView />
    </Suspense>
  );
}
