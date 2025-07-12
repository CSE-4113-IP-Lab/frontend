import React from 'react';

interface Props {
  message: string;
}

const ErrorMessage: React.FC<Props> = ({ message }) => (
  <div className="text-red-600 text-center py-8">{message}</div>
);

export default ErrorMessage;
