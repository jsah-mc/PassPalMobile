import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from "expo-router/ui";
import { Pressable, StyleSheet, View } from "react-native";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";

import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";

type TabButtonProps = TabTriggerSlotProps & {
  icon: string;
  children: string;
};

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: "100%" }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href={"/" as any} asChild>
            <TabButton icon="view-dashboard">Home</TabButton>
          </TabTrigger>
          <TabTrigger name="passwords" href={"/passwords" as any} asChild>
            <TabButton icon="lock">Passwords</TabButton>
          </TabTrigger>
          <TabTrigger name="contacts" href={"/contacts" as any} asChild>
            <TabButton icon="account-group">Contacts</TabButton>
          </TabTrigger>
          <TabTrigger name="account" href={"/account" as any} asChild>
            <TabButton icon="account-circle">Account</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, icon, isFocused, ...props }: TabButtonProps) {
  return (
    <Pressable {...props} style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}>
      <ThemedView
        type={isFocused ? "backgroundSelected" : "backgroundElement"}
        style={styles.tabButtonView}
      >
        <MaterialDesignIcons
          name={icon as any}
          size={18}
          color={isFocused ? "#cba6f7" : "#a6adc8"}
        />
        <ThemedText type="small" themeColor={isFocused ? "text" : "textSecondary"}>
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView type="backgroundElement" style={styles.innerContainer}>
        <ThemedText type="smallBold" style={styles.brandText}>
          PassPal
        </ThemedText>

        {props.children}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: "absolute",
    width: "100%",
    padding: Spacing.three,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.five,
    flexDirection: "row",
    alignItems: "center",
    flexGrow: 1,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
  },
  brandText: {
    marginRight: "auto",
  },
  pressable: {
    flexShrink: 1,
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
});
