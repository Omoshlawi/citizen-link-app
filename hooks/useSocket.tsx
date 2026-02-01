import Toaster from "@/components/toaster";
import { useToast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { BASE_URL } from "@/lib/constants";
import { useCallback, useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { io, Socket } from "socket.io-client";

type UseSocketOptions = {
  withAuth?: boolean;
  nameSpace?: string;
};

type UseSocketReturn = {
  socketRef: React.RefObject<Socket | null>;
  publishEvent: (event: string, ...args: any[]) => void;
  publishEventWithAck: <T = any>(event: string, ...args: any[]) => Promise<T>;
  addEventListener: (event: string, cb: (...args: any[]) => void) => () => void;
};

/**
 * useSocket()
 *
 * React hook for easily interacting with a socket.io server.
 * Provides convenient methods for publishing events (with optional ack),
 * subscribing to events, and tracking socket state.
 *
 * @param options - Configuration for the socket connection.
 *   - withAuth: whether to use authentication on the connection.
 *   - nameSpace: namespace for your socket connection (e.g. "/extraction").
 *
 * @returns {
 *   publishEvent: Function to emit a socket event,
 *   publishEventWithAck: Function to emit & await for an ACK response,
 *   addEventListener: Subscribe to a socket event with automatic cleanup,
 *   socketRef: React ref to the actual Socket instance.
 * }
 *
 * ## Basic Usage
 *
 * ```
 * import { useSocket } from '@/hooks/useSocket';
 *
 * export const MyComponent = () => {
 *   const { publishEvent, addEventListener, socketRef } = useSocket({
 *     withAuth: true,
 *     nameSpace: '/my-namespace',
 *   });
 *
 *   // Publish an event (fire-and-forget)
 *   const sendMessage = () => {
 *     publishEvent('my_event', { foo: 'bar' });
 *   };
 *
 *   // Subscribe to an event
 *   useEffect(() => {
 *     const cleanup = addEventListener('my_event', (data) => {
 *       console.log('Received data:', data);
 *     });
 *     return cleanup; // Automatically cleans up on unmount
 *   }, [addEventListener]);
 *
 *   return <button onClick={sendMessage}>Send Message</button>;
 * };
 * ```
 *
 * ## With Acknowledgement
 *
 * ```
 * const { publishEventWithAck } = useSocket({
 *   withAuth: true,
 *   nameSpace: '/example',
 * });
 *
 * const onClick = async () => {
 *   try {
 *     const response = await publishEventWithAck('do_something', { x: 123 });
 *     console.log('Server replied:', response);
 *   } catch (e) {
 *     console.error('Server error or timeout', e);
 *   }
 * };
 * ```
 *
 * ## Listening to Streaming or Progress Events
 *
 * ```
 * useEffect(() => {
 *   const stop = addEventListener('progress_update', (progress) => {
 *     setState(progress);
 *   });
 *   return stop;
 * }, [addEventListener]);
 * ```
 */
export const useSocket = ({
  withAuth = false,
  nameSpace = "",
}: UseSocketOptions = {}): UseSocketReturn => {
  const socketRef = useRef<Socket | null>(null);
  const toast = useToast();

  // 1. Create a Ref to hold the latest toast function
  // This allows us to use 'toast' inside the socket effect without adding it to the dependencies
  const toastRef = useRef(toast);

  // 2. Keep the ref updated whenever toast changes
  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  useEffect(() => {
    // 3. Construct URL
    const cleanBase = BASE_URL.replace(/\/$/, "");
    const cleanNamespace = nameSpace.startsWith("/")
      ? nameSpace
      : `/${nameSpace}`;
    const socketUrl = `${cleanBase}${cleanNamespace}`;

    // 4. Initialize Socket
    const socketInstance = io(socketUrl, {
      transports: ["websocket"], // Required for React Native
      autoConnect: true,
      forceNew: true,
      auth: withAuth
        ? async (cb) => {
            try {
              const session = await authClient.getSession();
              cb({ token: session.data?.session.token });
            } catch (e) {
              cb({});
            }
          }
        : undefined,
    });

    socketRef.current = socketInstance;

    // 5. Connection Handlers
    socketInstance.on("connect", () => {
      // Use toastRef.current instead of toast directly
      toastRef.current.show({
        placement: "top",
        render: ({ id }) => (
          <Toaster
            uniqueToastId={`toast-${id}`}
            variant="outline"
            title="Connected"
            description="Socket connection successful"
            action="success"
          />
        ),
      });
    });

    socketInstance.on("disconnect", (reason) => {
      // Ignore manual disconnects to avoid spam
      if (reason !== "io client disconnect") {
        toastRef.current.show({
          placement: "top",
          render: ({ id }) => (
            <Toaster
              uniqueToastId={`toast-${id}`}
              variant="outline"
              title="Disconnected"
              description="Socket connection lost"
              action="info"
            />
          ),
        });
      }
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket Error:", error);
      toastRef.current.show({
        placement: "top",
        render: ({ id }) => (
          <Toaster
            uniqueToastId={`toast-${id}`}
            variant="outline"
            title="Connection Error"
            description={error.message || "Failed to connect"}
            action="error"
          />
        ),
      });
    });

    // 6. Cleanup
    return () => {
      socketInstance.removeAllListeners();
      socketInstance.disconnect();
      socketRef.current = null;
    };

    // 7. CRITICAL: Only re-run if nameSpace or withAuth changes.
    // We intentionally exclude 'toast' and 'toastRef'.
  }, [nameSpace, withAuth]);

  // 8. Handle App State (Background/Foreground) //OPTIONAL
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      const socket = socketRef.current;

      if (nextAppState === "active" && socket && !socket.connected) {
        console.log("App came to foreground, reconnecting socket...");
        socket.connect();
      } else if (
        nextAppState.match(/inactive|background/) &&
        socket?.connected
      ) {
        console.log(
          "App went to background, disconnecting socket to save battery..."
        );
        // Optional: socket.disconnect();
        // Note: Disconnecting manually is safer for battery, but keeping it open
        // (if the OS allows) makes the UX faster.
        // If you need real-time updates even in background, you need Push Notifications, not sockets.
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, []);

  // --- Helper Methods ---

  const publishEvent = useCallback(
    (event: string, ...args: any[]) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit(event, ...args);
      } else {
        toastRef.current.show({
          placement: "top",
          render: ({ id }) => (
            <Toaster
              uniqueToastId={`toast-${id}`}
              variant="outline"
              title="Cannot Send"
              description="Waiting for connection..."
              action="warning"
            />
          ),
        });
      }
    },
    [] // No dependencies needed as we use refs
  );

  const publishEventWithAck = useCallback(
    async <T = any,>(event: string, ...args: any[]) => {
      if (socketRef.current?.connected) {
        return socketRef.current.emitWithAck(event, ...args) as Promise<T>;
      }
      toastRef.current.show({
        placement: "top",
        render: ({ id }) => (
          <Toaster
            uniqueToastId={`toast-${id}`}
            variant="outline"
            title="Cannot Send"
            description="Waiting for connection..."
            action="warning"
          />
        ),
      });
      throw new Error("Socket not connected");
    },
    []
  );

  const addEventListener = useCallback(
    (event: string, cb: (...args: any[]) => void) => {
      const socket = socketRef.current;
      if (!socket) return () => {};
      socket.on(event, cb);
      return () => {
        socket.off(event, cb);
      };
    },
    []
  );

  return {
    socketRef,
    publishEvent,
    publishEventWithAck,
    addEventListener,
  };
};

// Helper hook remains the same
export const useSocketEvent = (
  options: UseSocketOptions & {
    event: string;
    handleEvent: (...args: any[]) => void | Promise<void>;
  }
) => {
  const { event, handleEvent, ...socketOptions } = options;
  const { addEventListener } = useSocket(socketOptions);

  const handlerRef = useRef(handleEvent);
  useEffect(() => {
    handlerRef.current = handleEvent;
  }, [handleEvent]);

  useEffect(() => {
    const eventListener = (...args: any[]) => {
      if (handlerRef.current) handlerRef.current(...args);
    };
    return addEventListener(event, eventListener);
  }, [event, addEventListener]);
};
