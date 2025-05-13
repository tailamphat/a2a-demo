export interface A2ARequest {
  jsonrpc: '2.0';
  method: string;
  params: {
    topic: string;
  };
  id: string;
}

export interface A2AResponse {
  jsonrpc: '2.0';
  result: {
    artifacts: Artifact[];
  };
  id: string;
}

export interface Artifact {
  name: string;
  index: number;
  parts: {
    type: string;
    text: string;
  }[];
}
