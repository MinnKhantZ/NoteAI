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
import { FAB } from "react-native-paper";

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  // const [content, setContent] = useState("");

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  )


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
      <FAB icon='plus' style={styles.addButton} onPress={() => navigation.navigate("Details", { note: {content: ""}, index: notes.length })}/>
      <StatusBar style="auto" />
    </View>
  );
}

function DetailsScreen({ route, navigation }) {
  const { note, index } = route.params;
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState(note.content);

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  )

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
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={deleteNote}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={createNote}
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
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}} />
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
    marginTop: 50,
  },
  input: {
    padding: 10,
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
    position: 'absolute',
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
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: "#007bff",
    alignSelf: 'flex-end',
    right: 20,
    bottom: 20,
    borderRadius: 30,
  }
});
