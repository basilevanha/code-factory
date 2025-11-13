'use client';

import { supabase } from '@/lib/supabaseClient';
import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function useTrackVisitor() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tracked = useRef(false); // 🧠 évite les doublons

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    // ✅ Génère / récupère un visitor_id unique local
    let visitor_id = localStorage.getItem('visitor_id');
    if (!visitor_id) {
      visitor_id = crypto.randomUUID();
      localStorage.setItem('visitor_id', visitor_id);
    }

    // 🔍 Données techniques
    const device = /Mobi|Android/i.test(navigator.userAgent)
      ? 'mobile'
      : 'desktop';
    const screen_width = window.screen.width;
    const screen_height = window.screen.height;

    // 🔗 Données UTM
    const utm_source = searchParams.get('utm_source');
    const utm_medium = searchParams.get('utm_medium');
    const utm_campaign = searchParams.get('utm_campaign');

    const start = Date.now();

    // 🕓 Fonction d’enregistrement
    const saveSession = async () => {
      const duration_seconds = Math.round((Date.now() - start) / 1000);

      try {
        await supabase.from('visitor_sessions').insert([
          {
            visitor_id,
            utm_source,
            utm_medium,
            utm_campaign,
            device,
            screen_width,
            screen_height,
            duration_seconds,
            page: pathname,
          },
        ]);
        // console.log('✅ Tracking enregistré :', pathname);
      } catch (error) {
        console.warn('Tracking échoué :', error);
      }
    };

    // 📤 Utilise sendBeacon si dispo (meilleur pour beforeunload)
    const onUnload = () => {
      const duration_seconds = Math.round((Date.now() - start) / 1000);
      const payload = JSON.stringify({
        visitor_id,
        utm_source,
        utm_medium,
        utm_campaign,
        device,
        screen_width,
        screen_height,
        duration_seconds,
        page: pathname,
      });

      if ('sendBeacon' in navigator) {
        navigator.sendBeacon(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/visitor_sessions`,
          payload
        );
      } else {
        saveSession();
      }
    };

    window.addEventListener('beforeunload', onUnload);
    return () => {
      window.removeEventListener('beforeunload', onUnload);
      // Enregistre aussi si la page change (Next navigation)
      saveSession();
    };
  }, [pathname, searchParams]);
}
