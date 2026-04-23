export class WebSocketClient {
  private socket: WebSocket | null = null;
  private url: string;
  private onMessageCallback: (data: any) => void;
  private reconnectInterval: number = 5000;

  constructor(homeId: number, onMessage: (data: any) => void) {
    // Assuming backend is at localhost:8000
    this.url = `ws://localhost:8000/ws/${homeId}`;
    this.onMessageCallback = onMessage;
  }

  connect() {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log("WebSocket Connected");
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.onMessageCallback(data);
    };

    this.socket.onclose = () => {
      console.log("WebSocket Disconnected, attempting reconnect...");
      setTimeout(() => this.connect(), this.reconnectInterval);
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket Error Details:", {
        url: this.url,
        readyState: this.socket?.readyState,
        error: error
      });
      this.socket?.close();
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.onclose = null; // Prevent reconnect
      this.socket.close();
    }
  }
}
