import { create } from "zustand";

interface InferenceMetrics {
  psnr: number;
  ssim: number;
  fid: number;
  inferenceTime: number;
}

interface ImageResults {
  original: string;
  enhanced: string;
  generated: string;
  groundTruth?: string;
}

interface AppState {
  isProcessing: boolean;
  uploadedFile: File | null;
  results: ImageResults | null;
  metrics: InferenceMetrics | null;
  setProcessing: (status: boolean) => void;
  setUploadedFile: (file: File | null) => void;
  setResults: (results: ImageResults | null) => void;
  setMetrics: (metrics: InferenceMetrics | null) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isProcessing: false,
  uploadedFile: null,
  results: null,
  metrics: null,
  setProcessing: (status) => set({ isProcessing: status }),
  setUploadedFile: (file) => set({ uploadedFile: file }),
  setResults: (results) => set({ results }),
  setMetrics: (metrics) => set({ metrics }),
  reset: () => set({
    isProcessing: false,
    uploadedFile: null,
    results: null,
    metrics: null,
  }),
}));
