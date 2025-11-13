'use client';

import { Suspense } from 'react';
import useTrackVisitor from '@/lib/trackingVisitor';

function TrackingWrapper() {
  useTrackVisitor();
  return null;
}

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <TrackingWrapper />
      </Suspense>
      {children}
    </>
  );
}
