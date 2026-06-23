import { Text, TextInput, View } from "react-native";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";

type InputProps = React.ComponentProps<typeof TextInput> & {
  label: string;
  icon: string;
};

export default function Input({ label, icon, ...props }: InputProps) {
  return (
    <View className="mb-4">
      <Text className="mb-2 font-semibold text-[#cdd6f4]">{label}</Text>

      <View className="flex-row items-center rounded-2xl border border-[#45475a] bg-[#313244] px-4 py-1">
        <MaterialDesignIcons name={icon as any} size={22} color="#a6adc8" />

        <TextInput
          {...props}
          placeholderTextColor="#6c7086"
          className="ml-3 flex-1 py-3 text-[#cdd6f4]"
        />
      </View>
    </View>
  );
}
