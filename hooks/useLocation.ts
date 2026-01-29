import * as Location from "expo-location";
import { useCallback, useEffect, useRef, useState } from "react";

type Coordinates = {
  latitude: number;
  longitude: number;
};

export const useLocation = () => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const captureLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== Location.PermissionStatus.GRANTED) {
        throw new Error("Location permission is required to proceed.");
      }

      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      if (!isMountedRef.current) {
        return;
      }

      setCoordinates({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    } catch (err) {
      if (!isMountedRef.current) {
        return;
      }

      setCoordinates(null);
      const message =
        err instanceof Error
          ? err.message
          : "Unable to capture your location. Please try again.";
      setError(message);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    captureLocation();
  }, [captureLocation]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    coordinates,
    isLoading,
    error,
    retry: captureLocation,
  };
};

export type UseLocatioReturn = ReturnType<typeof useLocation>;
