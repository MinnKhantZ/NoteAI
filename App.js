import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ActivityIndicator, FAB } from "react-native-paper";

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  // const [content, setContent] = useState("");

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  const loadNotes = async () => {
    const savedNotes = await AsyncStorage.getItem("notes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Note-Taking App</Text>

      <ScrollView style={styles.notesContainer}>
        {notes.map((note, index) => (
          <TouchableOpacity
            key={index}
            style={styles.note}
            onPress={() => navigation.navigate("Edit", { note, index })}
          >
            <View>
              <Text style={styles.noteText}>
                {note.content.length < 220 ? note.content : note.content.slice(0, 200) + "..."}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FAB
        icon="plus"
        style={styles.addButton}
        onPress={() =>
          navigation.navigate("Edit", {
            note: { content: "" },
            index: notes.length,
          })
        }
      />
      <StatusBar style="auto" />
    </View>
  );
}

function EditScreen({ route, navigation }) {
  const { note, index } = route.params;
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState(note.content);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  const suggestNote = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://noteaibackend.onrender.com/suggestions", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching AI suggestions", error);
    } finally {
      setLoading(false);
    }
  };

  const loadNotes = async () => {
    const savedNotes = await AsyncStorage.getItem("notes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  };

  const saveNotes = async (newNotes) => {
    await AsyncStorage.setItem("notes", JSON.stringify(newNotes));
    setNotes(newNotes);
  };

  const deleteNote = async () => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));
    navigation.goBack();
  };

  const createNote = async () => {
    if (!content.trim()) return;
    const newNote = { content, createdAt: new Date().toISOString() };
    const updatedNotes = [...notes];
    updatedNotes[index] = newNote;
    await saveNotes(updatedNotes);
    setContent("");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Write your note here..."
        value={content}
        onChangeText={setContent}
      />
      {suggestions.length > 0 && (
        <ScrollView style={styles.suggestionsContainer}>
          {suggestions.map((suggestion, index) => (
            <TouchableOpacity key={index} style={styles.suggestion}>
              <Text style={styles.suggestionText}>
                {`${index+1}. ${suggestion}`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      <TouchableOpacity style={styles.suggestButton} onPress={suggestNote}>
        {
          loading? <ActivityIndicator /> : <Text style={styles.buttonText}>AI Suggestion</Text>
        }
        
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={deleteNote}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={createNote}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Edit" component={EditScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 50,
  },
  input: {
    padding: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#1a1a1a",
    borderColor: "#808080",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  notesContainer: { marginTop: 20 },
  note: {
    backgroundColor: "#fff",
    borderColor: "#e1e1e1",
    borderWidth: 1,
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    maxHeight: 136,
  },
  noteText: { fontSize: 16 },
  suggestionText: { fontSize: 14, color: "gray" },
  bold: { fontWeight: "bold" },
  suggestButton: {
    position: 'absolute',
    backgroundColor: "#007bff",
    padding: 11,
    borderRadius: 5,
    bottom: 20,
    left: 20,
  },
  suggestionsContainer: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
  },
  suggestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    position: "absolute",
    bottom: 20,
    right: 20,
    gap: 10,
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: "#ff0000",
    padding: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: "#008000",
    padding: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: "#007bff",
    alignSelf: "flex-end",
    right: 20,
    bottom: 20,
    borderRadius: 30,
  },
});
