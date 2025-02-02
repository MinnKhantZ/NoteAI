import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    loadNotes();
  }, [notes]);

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

  const createNote = async () => {
    if (!content.trim()) return;
    const newNote = { content, createdAt: new Date().toISOString() };
    const updatedNotes = [...notes, newNote];
    await saveNotes(updatedNotes);
    setContent("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Note-Taking App</Text>

      <TextInput
        style={styles.input}
        multiline
        placeholder="Write your note here..."
        value={content}
        onChangeText={setContent}
      />

      <TouchableOpacity style={styles.button} onPress={createNote}>
        <Text style={styles.buttonText}>Save Note</Text>
      </TouchableOpacity>

      <ScrollView style={styles.notesContainer}>
        {notes.map((note, index) => (
          <TouchableOpacity
            key={index}
            style={styles.note}
            onPress={() => navigation.navigate("Details", { note, index })}
          >
            <View>
              <Text style={styles.noteText}>
                <Text style={styles.bold}>Original:</Text> {note.content}
              </Text>
              <Text style={styles.suggestionText}>
                <Text style={styles.bold}>Suggestion:</Text> Please go online
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

function DetailsScreen({ route, navigation }) {
  const { note, index } = route.params;
  const [content, setContent] = useState(note.content);

  const deleteNote = async () => {
    const notes = await AsyncStorage.getItem("notes");
    const updatedNotes = JSON.parse(notes).filter((_, i) => i !== index);
    await AsyncStorage.setItem("notes", JSON.stringify(updatedNotes));
    navigation.goBack();
  };

  const saveNote = async () => {
    const notes = JSON.parse(await AsyncStorage.getItem("notes"));
    notes[index].content = content;
    await AsyncStorage.setItem("notes", JSON.stringify(notes));
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Write your note here..."
        value={content}
        onChangeText={setContent}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={deleteNote}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveNote}
        >
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
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
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
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    minHeight: 100,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  notesContainer: { marginTop: 20 },
  note: {
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  noteText: { fontSize: 16 },
  suggestionText: { fontSize: 14, color: "gray" },
  bold: { fontWeight: "bold" },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
});
