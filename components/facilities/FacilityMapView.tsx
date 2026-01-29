import { useHealthFacilities } from "@/hooks/useHealthFacilities";
import { useLocation } from "@/hooks/useLocation";
import React, { useMemo, useState } from "react";
import { Platform, StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { EmptyState, ErrorState } from "../state-full-widgets";
import { AlertDialog } from "../ui/alert-dialog";
import { Box } from "../ui/box";
import { Spinner } from "../ui/spinner";

type FacilityMapViewProps = {
  search?: string;
  typeId?: string;
};

const FacilityMapView = ({ search, typeId }: FacilityMapViewProps) => {
  const { healthFacilities, error, isLoading } = useHealthFacilities({
    search: search || "",
    typeId: typeId || "",
  });
  const healthFacilitiesWithCordinates = useMemo(
    () =>
      healthFacilities.filter(
        (h) => h.coordinates?.latitude && h.coordinates?.longitude
      ),
    [healthFacilities]
  );
  const { coordinates: userLocation, isLoading: isLocationLoading } =
    useLocation();
  const [selectedFacility, setSelectedFacility] = useState<{
    name: string;
    details: string;
  } | null>(null);

  // Calculate initial region based on facilities or user location
  const initialRegion = useMemo<Region | undefined>(() => {
    if (healthFacilitiesWithCordinates.length === 0) {
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
    const latitudes = healthFacilitiesWithCordinates.map(
      (f) => f.coordinates!.latitude
    );
    const longitudes = healthFacilitiesWithCordinates.map(
      (f) => f.coordinates!.longitude
    );

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
  }, [healthFacilitiesWithCordinates, userLocation]);

  if (isLoading || isLocationLoading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  const handleMarkerPress = (
    facility: (typeof healthFacilitiesWithCordinates)[0]
  ) => {
    setSelectedFacility({
      name: facility.name,
      details: `\nMFL: ${facility.kmflCode}\nOwner:${
        facility.owner
      }\nAddress: ${facility.county}, ${facility.subcounty}, ${
        facility.ward ?? ""
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
          {healthFacilitiesWithCordinates.map((facility) => (
            <Marker
              key={facility.id}
              coordinate={{
                latitude: facility.coordinates!.latitude,
                longitude: facility.coordinates!.longitude,
              }}
              title={facility.name}
              description={`${facility.county}, ${facility.subcounty}, `}
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

export default FacilityMapView;
