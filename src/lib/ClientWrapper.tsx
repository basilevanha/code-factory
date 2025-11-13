'use client';

import useTrackVisitor from '@/lib/trackingVisitor';

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useTrackVisitor(); // 👈 Tracking actif sur tout le site
  return <>{children}</>;
}
