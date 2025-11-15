import { AlertCircle, CheckCircle, Loader2, WifiOff } from "lucide-react";

interface ConnectionStatusProps {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  reconnectionAttempt: number;
  maxAttempts: number;
}

export default function ConnectionStatus({
  isConnected,
  isConnecting,
  error,
  reconnectionAttempt,
  maxAttempts,
}: ConnectionStatusProps) {
  if (isConnected) {
    return (
      <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
        <CheckCircle className="size-4" />
        <span className="text-sm font-medium">Connected to Backend</span>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
        <Loader2 className="size-4 animate-spin" />
        <span className="text-sm font-medium">Connecting to Backend...</span>
      </div>
    );
  }

  if (error) {
    const isMaxAttemptsReached = reconnectionAttempt >= maxAttempts;

    return (
      <div className="flex flex-col gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-200">
        <div className="flex items-center gap-2">
          {isMaxAttemptsReached ? (
            <WifiOff className="size-4" />
          ) : (
            <AlertCircle className="size-4" />
          )}
          <span className="text-sm font-medium">
            {isMaxAttemptsReached
              ? 'Connection Failed'
              : `Reconnecting... (${reconnectionAttempt}/${maxAttempts})`}
          </span>
        </div>

        {isMaxAttemptsReached && (
          <p className="text-xs text-red-500">
            Max reconnection attempts reached. Please check if the backend is running.
          </p>
        )}

        {!isMaxAttemptsReached && (
          <div className="w-full bg-red-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-red-500 h-full transition-all duration-300 animate-pulse"
              style={{
                width: `${(reconnectionAttempt / maxAttempts) * 100}%`,
              }}
            />
          </div>
        )}
      </div>
    );
  }

  return null;
}
