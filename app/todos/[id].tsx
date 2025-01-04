import { useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { Todo } from "@/data/todos";
import { StatusBar } from "expo-status-bar";
import { Colors } from "@/constants/Colors";

export default function EditScreen() {
  const { id } = useLocalSearchParams();
  const [todo, setTodo] = React.useState<Todo>();

  const { colorScheme, theme } = React.useContext(ThemeContext);
  const styles = createStyles(theme);

  const router = useRouter();

  const [loaded, error] = useFonts({
    Inter_500Medium,
  });

  React.useEffect(() => {
    const fetchData = async (id: string) => {
      try {
        const jsonValue = await AsyncStorage.getItem("todos");
        const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null;

        if (storageTodos && storageTodos.length) {
          const todo = storageTodos.find(
            (todo: any) => todo.id.toString() == id
          );
          setTodo(todo);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData(id as string);
  }, []);

  const onSaveTodo = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("todos");
      const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null;

      if (storageTodos && storageTodos.length) {
        const newTodos = storageTodos.map((item: Todo) => {
          return item.id.toString() == id ? todo : item;
        });

        await AsyncStorage.setItem("todos", JSON.stringify(newTodos));
      }

      router.back();
    } catch (error) {
      console.error(error);
    }
  };

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={[styles.input, styles.border]}
          value={todo?.title}
          onChangeText={(value) =>
            // @ts-ignore
            setTodo((prev) => ({ ...prev, title: value }))
          }
        />
        <Pressable style={[styles.button, styles.border]} onPress={onSaveTodo}>
          <Text style={styles.buttonText}>Save</Text>
        </Pressable>
      </View>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}

const createStyles = (theme: typeof Colors.light) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.background,
      width: "100%",
    },
    form: {
      flexDirection: "column",
      alignItems: "flex-end",
      gap: 8,
      width: "100%",
      maxWidth: 1024,
      marginHorizontal: "auto",
    },
    border: {
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 4,
    },
    input: {
      minHeight: 30,
      flex: 1,
      width: "100%",
      padding: 6,
      color: theme.text,
      fontSize: 16,
      fontFamily: "Inter_500Medium",
    },
    button: {
      width: 50,
      padding: 4,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.button,
      fontFamily: "Inter_500Medium",
      fontSize: 14,
    },
    buttonText: {
      color: theme.background,
    },
  });
};
