import { usePickupStations } from "@/hooks/use-addresses";
import { useLocation } from "@/hooks/useLocation";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { Platform, StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { EmptyState, ErrorState } from "../state-full-widgets";
import { AlertDialog } from "../ui/alert-dialog";
import { Box } from "../ui/box";
import { Spinner } from "../ui/spinner";

type StationsMapViewProps = {
  search?: string;
  typeId?: string;
};

const StationsMapView = ({ search, typeId }: StationsMapViewProps) => {
  const params = useLocalSearchParams();
  const { stations, error, isLoading } = usePickupStations(params, "router");
  const stationsWithCordinates = useMemo(
    () => stations.filter((h) => h.coordinates?.lat && h.coordinates?.lng),
    [stations],
  );
  const { coordinates: userLocation, isLoading: isLocationLoading } =
    useLocation();
  const [selectedFacility, setSelectedFacility] = useState<{
    name: string;
    details: string;
  } | null>(null);

  // Calculate initial region based on facilities or user location
  const initialRegion = useMemo<Region | undefined>(() => {
    if (stationsWithCordinates.length === 0) {
      // Default to user location or a default location (e.g., Kenya)
      if (userLocation) {
        return {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        };
      }
      // Default to Nairobi, Kenya if no location
      return {
        latitude: -1.2921,
        longitude: 36.8219,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      };
    }

    // Calculate region to fit all facilities
    const latitudes = stationsWithCordinates.map((f) => f.coordinates!.lat);
    const longitudes = stationsWithCordinates.map((f) => f.coordinates!.lng);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    const latDelta = (maxLat - minLat) * 1.5 || 0.1;
    const lngDelta = (maxLng - minLng) * 1.5 || 0.1;

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max(latDelta, 0.1),
      longitudeDelta: Math.max(lngDelta, 0.1),
    };
  }, [stationsWithCordinates, userLocation]);

  if (isLoading || isLocationLoading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  const handleMarkerPress = (facility: (typeof stationsWithCordinates)[0]) => {
    setSelectedFacility({
      name: facility.name,
      details: `\CODE: ${facility.code}\nContact:${
        facility.email
      }\nAddress: ${facility.level1}, ${facility.level2}, ${
        facility.level3 ?? ""
      }`,
    });
  };

  return (
    <Box className="flex-1">
      {initialRegion ? (
        <MapView
          provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={!!userLocation}
          showsMyLocationButton={true}
          showsCompass={true}
          toolbarEnabled={false}
        >
          {stationsWithCordinates.map((facility) => (
            <Marker
              key={facility.id}
              coordinate={{
                latitude: facility.coordinates!.lat,
                longitude: facility.coordinates!.lng,
              }}
              title={facility.name}
              description={`${facility.level1}, ${facility.level2}, `}
              onPress={() => handleMarkerPress(facility)}
            />
          ))}
        </MapView>
      ) : (
        <EmptyState message="Unable to load map" />
      )}
      {selectedFacility && (
        <AlertDialog
          isOpen={!!selectedFacility}
          onClose={() => setSelectedFacility(null)}
          title={selectedFacility.name}
          message={selectedFacility.details}
          confirmText="OK"
          onConfirm={() => setSelectedFacility(null)}
        />
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
});

export default StationsMapView;
