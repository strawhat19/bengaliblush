import { useState, type KeyboardEvent } from 'react';

const formModes = [`message`, `appointment`] as const;

export const useContactInquiry = () => {
  const [mode, setMode] = useState<(typeof formModes)[number]>(`message`);
  const [appointmentSubmitted, setAppointmentSubmitted] = useState(false);

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (![ `End`, `Home`, `ArrowLeft`, `ArrowRight` ].includes(event.key)) return;
    event.preventDefault();
    const currentIndex = formModes.indexOf(mode);
    const nextIndex = event.key === `Home` ? 0 : event.key === `End` ? formModes.length - 1
      : (currentIndex + (event.key === `ArrowLeft` ? -1 : 1) + formModes.length) % formModes.length;
    const nextMode = formModes[nextIndex];
    if (!nextMode) return;
    setMode(nextMode);
    document.getElementById(`bb-contact-${nextMode}-tab`)?.focus();
  };

  const clearAppointmentStatus = () => setAppointmentSubmitted(false);
  const handleAppointmentSubmit = () => setAppointmentSubmitted(true);

  return { mode, setMode, handleTabKeyDown, clearAppointmentStatus, handleAppointmentSubmit, appointmentSubmitted };
};
