import { Text, View } from "react-native";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";

type StatCardProps = {
  title: string;
  value: number;
  icon: string;
  bg: string;
  color: string;
};

export default function StatCard({ title, value, icon, bg, color }: StatCardProps) {
  return (
    <View className={`flex-1 rounded-[28px] p-5 ${bg}`}>
      <MaterialDesignIcons name={icon as any} size={30} color={color} />

      <Text className="mt-4 text-3xl font-bold text-[#cdd6f4]">{value}</Text>
      <Text className="mt-1 text-[#bac2de]">{title}</Text>
    </View>
  );
}
