import { useState, useCallback } from 'react';

export function useStep(maxStep: number) {
  const [currentStep, setCurrentStep] = useState(1);
  const canGoToNextStep = currentStep < maxStep;
  const canGoToPrevStep = currentStep > 1;
  const setStep = useCallback((step: number | ((step: number) => number)) => {
    setCurrentStep(prev => {
      const nextStep = typeof step === 'function' ? step(prev) : step;
      if (nextStep >= 1 && nextStep <= maxStep) return nextStep;
      return prev;
    });
  }, [maxStep]);
  const goToNextStep = useCallback(() => {
    if (canGoToNextStep) setCurrentStep(step => step + 1);
  }, [canGoToNextStep]);
  const goToPrevStep = useCallback(() => {
    if (canGoToPrevStep) setCurrentStep(step => step - 1);
  }, [canGoToPrevStep]);
  const reset = useCallback(() => setCurrentStep(1), []);
  return { currentStep, goToNextStep, goToPrevStep, canGoToNextStep, canGoToPrevStep, setStep, reset };
}