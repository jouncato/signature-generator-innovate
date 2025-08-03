/**
 * Download Service
 * Single Responsibility: Handle file downloads
 */
class DownloadService {
    async downloadAsImage(element, fileName = 'signature') {
        if (!element) {
            throw new Error('Element not found for download');
        }

        try {
            const canvas = await html2canvas(element, {
                backgroundColor: '#ffffff',
                scale: 2,
                useCORS: true
            });
            
            this._downloadCanvas(canvas, fileName);
        } catch (error) {
            throw new Error(`Download failed: ${error.message}`);
        }
    }

    _downloadCanvas(canvas, fileName) {
        const link = document.createElement('a');
        link.download = `${fileName}.png`;
        link.href = canvas.toDataURL();
        link.click();
    }
}

if (typeof window !== 'undefined') {
    window.DownloadService = DownloadService;
}