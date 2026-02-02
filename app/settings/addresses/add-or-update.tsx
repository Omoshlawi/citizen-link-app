import { ScreenLayout } from "@/components/layout";
import { AddressForm } from "@/components/settings";
import { ErrorState, When } from "@/components/state-full-widgets";
import { Spinner } from "@/components/ui/spinner";
import { useAddress } from "@/hooks/use-addresses";
import { useLocalSearchParams } from "expo-router";
import React from "react";

const AddOrUpdateAddressScreen = () => {
  const { addressId } = useLocalSearchParams<{ addressId: string }>();
  const { address, error, isLoading } = useAddress(addressId);
  return (
    <ScreenLayout title={addressId ? "Update Address" : "Add Address"}>
      <When
        asyncState={{ isLoading, error, data: address }}
        error={(e) => <ErrorState error={e} />}
        loading={() => <Spinner />}
        success={(address) => {
          return <AddressForm address={address} />;
        }}
      />
    </ScreenLayout>
  );
};

export default AddOrUpdateAddressScreen;
