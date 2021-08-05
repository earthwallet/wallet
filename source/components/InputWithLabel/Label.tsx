import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  label: string;
}

function Label({
  children,
  className,
  label,
}: Props): React.ReactElement<Props> {
  return (
    <>
      {label !== '' && <label className={className}>{label}</label>}
      {children}
    </>
  );
}

export default Label;
