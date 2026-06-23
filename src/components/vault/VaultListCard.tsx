import { Text, TouchableOpacity, View } from "react-native";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";

type VaultListCardProps = {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  bg: string;
  onDelete: () => void;
};

export default function VaultListCard({
  title,
  subtitle,
  icon,
  color,
  bg,
  onDelete,
}: VaultListCardProps) {
  return (
    <View className="flex-row items-center rounded-[26px] border border-[#45475a] bg-[#1e1e2e] p-4">
      <View className={`h-14 w-14 items-center justify-center rounded-2xl ${bg}`}>
        <MaterialDesignIcons name={icon as any} size={28} color={color} />
      </View>

      <View className="ml-4 flex-1">
        <Text className="text-lg font-semibold text-[#cdd6f4]">{title}</Text>
        <Text className="mt-0.5 text-[#a6adc8]">{subtitle}</Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onDelete}
        className="h-10 w-10 items-center justify-center rounded-full bg-[#f38ba8]/20"
      >
        <MaterialDesignIcons name="trash-can-outline" size={22} color="#f38ba8" />
      </TouchableOpacity>
    </View>
  );
}
