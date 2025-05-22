import React, { useState } from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal
} from '@floating-ui/react';

interface CustomTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  delay?: number;
  className?: string;
}

export function CustomTooltip({
  children,
  content,
  delay = 200,
  className,
}: CustomTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom',
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, { delay });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()} className="inline-block">
        {children}
      </div>
      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              zIndex: 50, // Lower than dropdown menus (z-9999)
            }}
            {...getFloatingProps()}
            className={`bg-white px-3 py-2 rounded-md shadow-md text-sm border border-gray-200 max-w-xs pointer-events-none ${className || ''}`}
          >
            {content}
          </div>
        </FloatingPortal>
      )}
    </>
  );
}