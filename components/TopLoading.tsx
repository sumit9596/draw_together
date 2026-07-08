"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import { LOADING_END_EVENT, LOADING_START_EVENT, resetLoading } from "./loadingEvents";

export default function TopLoading() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const startTimeRef = useRef<number | null>(null);
    const finishTimerRef = useRef<number | null>(null);
    const isActiveRef = useRef(false);

    const startProgress = () => {
        // Always (re)start progress so repeated clicks restart the bar
        startTimeRef.current = Date.now();
        if (finishTimerRef.current !== null) {
            window.clearTimeout(finishTimerRef.current);
            finishTimerRef.current = null;
        }
        isActiveRef.current = true;
        NProgress.start();
    };

    const finishProgress = () => {
        if (finishTimerRef.current !== null) {
            window.clearTimeout(finishTimerRef.current);
        }

        if (!isActiveRef.current && startTimeRef.current === null) {
            return;
        }

        const startedAt = startTimeRef.current;
        const elapsed = startedAt ? Date.now() - startedAt : 0;
        const remaining = Math.max(0, 400 - elapsed);

        finishTimerRef.current = window.setTimeout(() => {
            // Force done and ensure DOM element is removed to avoid leftover invisible nodes
            try {
                NProgress.done(true);
                if ((NProgress as any).remove) (NProgress as any).remove();
            } catch (e) {
                // fallback to regular done
                try { NProgress.done(); } catch (ee) { }
            }
            startTimeRef.current = null;
            isActiveRef.current = false;
            finishTimerRef.current = null;
        }, remaining);
    };

    useEffect(() => {
        NProgress.configure({ showSpinner: false, minimum: 0.12, easing: "ease", speed: 250 });

        const handleLoadingStart = () => startProgress();
        const handleLoadingEnd = () => finishProgress();

        const originalPushState = window.history.pushState;
        const originalReplaceState = window.history.replaceState;

        window.history.pushState = function (...args) {
            startProgress();
            return originalPushState.apply(this, args as Parameters<History["pushState"]>);
        };

        window.history.replaceState = function (...args) {
            startProgress();
            return originalReplaceState.apply(this, args as Parameters<History["replaceState"]>);
        };

        const isInternalNavigationTarget = (anchor: HTMLAnchorElement | null, button: HTMLButtonElement | null) => {
            if (button) {
                const type = button.getAttribute('type');
                if (!type || type === 'submit' || button.dataset.navigate === 'true') {
                    return true;
                }
            }

            if (!anchor) return false;

            try {
                const url = new URL(anchor.href);
                const current = new URL(window.location.href);

                const isInternal = url.origin === current.origin;
                const isDifferentRoute = url.pathname !== current.pathname || url.search !== current.search;

                return isInternal && anchor.target !== '_blank' && !url.hash && isDifferentRoute;
            } catch (err) {
                return false;
            }
        };

        const onDocClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            const anchor = target?.closest ? (target.closest('a') as HTMLAnchorElement | null) : null;
            const button = target?.closest ? (target.closest('button') as HTMLButtonElement | null) : null;

            if (isInternalNavigationTarget(anchor, button)) {
                startProgress();
            }
        };

        const onDocPointerDown = (e: PointerEvent) => {
            if (e.button !== 0) return;
            const target = e.target as HTMLElement | null;
            const anchor = target?.closest ? (target.closest('a') as HTMLAnchorElement | null) : null;
            const button = target?.closest ? (target.closest('button') as HTMLButtonElement | null) : null;

            if (isInternalNavigationTarget(anchor, button)) {
                startProgress();
            }
        };

        const onSubmit = () => startProgress();
        const onPopState = () => startProgress();

        document.addEventListener('pointerdown', onDocPointerDown, true);
        document.addEventListener('click', onDocClick, true);
        document.addEventListener('submit', onSubmit, true);
        window.addEventListener('popstate', onPopState);
        window.addEventListener(LOADING_START_EVENT, handleLoadingStart);
        window.addEventListener(LOADING_END_EVENT, handleLoadingEnd);

        return () => {
            window.history.pushState = originalPushState;
            window.history.replaceState = originalReplaceState;
            document.removeEventListener('pointerdown', onDocPointerDown, true);
            document.removeEventListener('click', onDocClick, true);
            document.removeEventListener('submit', onSubmit, true);
            window.removeEventListener('popstate', onPopState);
            window.removeEventListener(LOADING_START_EVENT, handleLoadingStart);
            window.removeEventListener(LOADING_END_EVENT, handleLoadingEnd);

            if (finishTimerRef.current !== null) {
                window.clearTimeout(finishTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        resetLoading();
        isActiveRef.current = false;
        finishProgress();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, searchParams?.toString()]);

    return null;
}
