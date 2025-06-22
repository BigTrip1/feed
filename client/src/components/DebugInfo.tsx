import React from 'react';
import styled from 'styled-components';

const DebugContainer = styled.div`
  position: fixed;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 1rem;
  border-radius: 8px;
  font-family: monospace;
  font-size: 12px;
  z-index: 9999;
  max-width: 300px;
`;

interface DebugInfoProps {
  tokens: any[];
  connectionStatus: string;
  loading: boolean;
  error: any;
}

const DebugInfo: React.FC<DebugInfoProps> = ({ tokens, connectionStatus, loading, error }) => {
  return (
    <DebugContainer>
      <div><strong>Debug Info:</strong></div>
      <div>Tokens: {tokens.length}</div>
      <div>Connection: {connectionStatus}</div>
      <div>Loading: {loading ? 'Yes' : 'No'}</div>
      <div>Error: {error ? 'Yes' : 'No'}</div>
      <div>API URL: http://localhost:5000</div>
      <div>WS URL: ws://localhost:8080</div>
    </DebugContainer>
  );
};

export default DebugInfo; 