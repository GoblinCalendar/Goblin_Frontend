import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { FullWindowOverlay } from "react-native-screens";
import colors from "../styles/colors";

export const BottomSheetModalComponent = ({
  setIsBottomSheetOpen,
  isBottomSheetOpen,
  children,
  bottomSheetRef,
  height,
}) => {
  useEffect(() => {
    bottomSheetRef.current?.present();
  }, [isBottomSheetOpen]);

  // const snapPoints = useMemo(() => ["70%"], []);

  const handleComponent = (props) => (
    <View {...props} style={styles.handleWrapper}>
      <View style={styles.handle}></View>
    </View>
  );

  const onDismiss = useCallback(() => setIsBottomSheetOpen(false), [setIsBottomSheetOpen]);

  const containerComponent = useCallback(
    ({ children }) => (
      <FullWindowOverlay style={StyleSheet.absoluteFill}>{children}</FullWindowOverlay>
    ),
    []
  );

  const backdropComponent = useCallback(
    (props) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.4} />
    ),
    []
  );

  return (
    <BottomSheetModal
      index={0}
      ref={bottomSheetRef}
      onDismiss={onDismiss}
      // snapPoints={snapPoints}
      enableDynamicSizing
      enablePanDownToClose={true}
      handleComponent={handleComponent}
      containerComponent={containerComponent}
      backdropComponent={backdropComponent}
      keyboardBlurBehavior="restore"
      keyboardBehavior="extend"
    >
      <BottomSheetView style={[styles.wrapper, { height }]}>{children}</BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  handleWrapper: {
    flex: 1,
    marginHorizontal: "auto",
    marginVertical: 9,
  },
  handle: {
    width: 70,
    height: 2,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: colors.calendarColor,
  },
  wrapper: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
});
