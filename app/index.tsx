import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { data, Todo } from "../data/todos";
import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import { ThemeContext } from "@/context/ThemeContext";
import { Octicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import Animated, { LinearTransition } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

export default function Index() {
  const [todo, setTodo] = React.useState<Todo[]>([]);
  const [input, onChangeInput] = React.useState("");

  const { colorScheme, setColorScheme, theme } = React.useContext(ThemeContext);
  const styles = createStyles(theme);

  const router = useRouter();
  const isFocused = useIsFocused();

  const [loaded, error] = useFonts({
    Inter_500Medium,
  });

  React.useEffect(() => {
    if (isFocused) {
      const fetchData = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem("todos");
          const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null;

          if (storageTodos && storageTodos.length) {
            setTodo(storageTodos);
          } else {
            setTodo(data);
          }
        } catch (error) {
          console.error(error);
        }
      };

      fetchData();
    }
  }, [isFocused]);

  React.useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem("todos", JSON.stringify(todo));
      } catch (error) {
        console.error(error);
      }
    };

    saveData();
  }, [todo]);

  if (!loaded && !error) {
    return null;
  }

  const onAddTodo = () => {
    setTodo([
      {
        id: +new Date(),
        title: input,
        completed: false,
      },
      ...todo,
    ]);
    onChangeInput("");
  };

  const onCompleteTodo = (id: number) => {
    setTodo(
      todo.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const onDeleteTodo = (id: number) => {
    setTodo(todo.filter((item) => item.id !== id));
  };

  const handleNavigate = (id: number) => {
    router.push(`/todos/${id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={[styles.input, styles.border]}
          placeholder="Add a new todo"
          placeholderTextColor="gray"
          onChangeText={onChangeInput}
          value={input}
        />

        <Pressable style={[styles.border, styles.button]} onPress={onAddTodo}>
          <Text style={{ color: theme.background }}>Add</Text>
        </Pressable>

        <Pressable
          onPress={() =>
            setColorScheme(colorScheme === "dark" ? "light" : "dark")
          }
          style={{ marginLeft: 8 }}
        >
          <Octicons
            name={colorScheme === "dark" ? "sun" : "moon"}
            size={24}
            color={theme.text}
          />
        </Pressable>
      </View>

      <Animated.FlatList
        data={todo}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <Text style={[{ textAlign: "center", marginTop: 20 }, styles.text]}>
            No todos
          </Text>
        )}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Pressable
              onPress={() => handleNavigate(item.id)}
              onLongPress={() => onCompleteTodo(item.id)}
              style={styles.item}
            >
              <Text
                style={[styles.text, item.completed && styles.completedText]}
              >
                {item.title}
              </Text>
            </Pressable>

            <Pressable
              style={styles.delete}
              onPress={() => onDeleteTodo(item.id)}
            >
              <FontAwesome name="trash" size={20} color={theme.icon} />
            </Pressable>
          </View>
        )}
        itemLayoutAnimation={LinearTransition}
        keyboardDismissMode={"on-drag"}
      />
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}

const createStyles = (theme: typeof Colors.light) => {
  const MAX_WIDTH = 1024;

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.background,
      width: "100%",
    },
    form: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      maxWidth: MAX_WIDTH,
      marginHorizontal: "auto",
      marginBottom: 10,
    },
    border: {
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 4,
    },
    input: {
      flex: 1,
      padding: 4,
      color: theme.text,
      fontSize: 18,
      fontFamily: "Inter_500Medium",
    },
    button: {
      width: 50,
      padding: 4,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.button,
      marginLeft: 8,
    },
    delete: {
      width: 32,
      height: 32,
      backgroundColor: "#c92a2a",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 100,
    },
    list: {
      width: "100%",
      maxWidth: MAX_WIDTH,
      marginHorizontal: "auto",
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      height: 50,
      maxHeight: 100,
      overflow: "hidden",
      paddingVertical: 8,
    },
    item: {
      flex: 1,
    },
    text: {
      color: theme.text,
      fontSize: 18,
      fontFamily: "Inter_500Medium",
    },
    completedText: {
      textDecorationLine: "line-through",
      color: "gray",
    },
    separator: {
      height: 1,
      backgroundColor: "gray",
    },
  });
};
