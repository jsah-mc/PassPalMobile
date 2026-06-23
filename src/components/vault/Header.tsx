import { Text, View } from "react-native";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";

type HeaderProps = {
  title: string;
  subtitle: string;
  icon: string;
};

export default function Header({ title, subtitle, icon }: HeaderProps) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="mr-4 flex-1">
        <Text className="text-3xl font-bold text-[#cdd6f4]">{title}</Text>
        <Text className="mt-1 text-base text-[#a6adc8]">{subtitle}</Text>
      </View>

      <View className="h-12 w-12 items-center justify-center rounded-full bg-[#313244]">
        <MaterialDesignIcons name={icon as any} size={24} color="#cba6f7" />
      </View>
    </View>
  );
}
