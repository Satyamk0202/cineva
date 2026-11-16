import { Children, isValidElement, useState } from "react";
import "./Stepper.css";

export function Step({ children, title, description, icon }) {
  return <section className="stepper__step" data-title={title}>{children}</section>;
}

export default function Stepper({
  children,
  initialStep = 1,
  onStepChange,
  onFinalStepCompleted,
  nextButtonText = "Continue",
  backButtonText = "Back",
  completeButtonText = "Complete",
  completedContent = <p>You're all set.</p>,
  className = ""
}) {
  const steps = Children.toArray(children).filter(isValidElement);
  const [step, setStep] = useState(initialStep);
  const total = steps.length;
  const complete = step > total;
  const go = (next) => {
    const value = Math.max(1, Math.min(total + 1, next));
    if (value === step) return;
    setStep(value);
    if (value > total) onFinalStepCompleted?.();
    else onStepChange?.(value);
  };

  return (
    <div className={`stepper ${className}`}>
      <div className="stepper__progress" aria-label={`Step ${Math.min(step,total)} of ${total}`}>
        {steps.map((child, index) => (
          <button
            type="button"
            key={index}
            className={`stepper__indicator ${index + 1 < step ? "is-done" : ""} ${index + 1 === step ? "is-active" : ""}`}
            onClick={() => go(index + 1)}
            aria-label={`Go to step ${index + 1}`}
          >
            {index + 1 < step ? "✓" : index + 1}
            {child.props.title && <span>{child.props.title}</span>}
          </button>
        ))}
      </div>
      <div className="stepper__content" aria-live="polite">
        {complete ? completedContent : steps[step - 1]}
      </div>
      {!complete && (
        <div className="stepper__actions">
          <button type="button" className="stepper__back" disabled={step === 1} onClick={() => go(step - 1)}>{backButtonText}</button>
          <button type="button" className="stepper__next" onClick={() => go(step + 1)}>
            {step === total ? completeButtonText : nextButtonText}
          </button>
        </div>
      )}
    </div>
  );
}
