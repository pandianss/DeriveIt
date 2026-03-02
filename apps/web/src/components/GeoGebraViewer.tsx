'use client';

import { useEffect, useRef, useState } from 'react';

interface GeoGebraViewerProps {
    id: string;
    material_id?: string;
    appName?: 'graphing' | 'geometry' | '3d' | 'classic';
    width?: number;
    height?: number;
    showResetIcon?: boolean;
    enableShiftDragZoom?: boolean;
    showZoomButtons?: boolean;
}

export default function GeoGebraViewer({
    id,
    material_id,
    appName = 'graphing',
    width = 800,
    height = 600,
    showResetIcon = false,
    enableShiftDragZoom = true,
    showZoomButtons = false
}: GeoGebraViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        let script = document.getElementById('ggb-script') as HTMLScriptElement;

        const initApplet = () => {
            const parameters: any = {
                id: id,
                width: width,
                height: height,
                showResetIcon: showResetIcon,
                enableShiftDragZoom: enableShiftDragZoom,
                showZoomButtons: showZoomButtons,
                useBrowserForJS: false
            };

            if (material_id) {
                parameters.material_id = material_id;
            } else {
                parameters.appName = appName;
            }

            // @ts-ignore
            const applet = new window.GGBApplet(parameters, true);

            if (containerRef.current) {
                applet.inject(containerRef.current.id);
            }
        };

        if (!script) {
            script = document.createElement('script');
            script.src = 'https://www.geogebra.org/apps/deployggb.js';
            script.id = 'ggb-script';
            script.async = true;
            script.onload = () => {
                setIsLoaded(true);
                initApplet();
            };
            document.body.appendChild(script);
        } else {
            setIsLoaded(true);
            setTimeout(initApplet, 300); // Wait for existing script parsing
        }

        return () => {
            // Optional: Destroy old applet logic
        };
    }, [material_id, appName, id, width, height, showResetIcon, enableShiftDragZoom, showZoomButtons]);

    return (
        <div className="geogebra-wrapper overflow-hidden bg-gray-50 flex items-center justify-center rounded-lg border border-gray-200">
            {!isLoaded && <div className="animate-pulse p-8 text-gray-500">Loading interactive diagram...</div>}
            <div id={`${id}-container`} ref={containerRef}></div>
        </div>
    );
}
