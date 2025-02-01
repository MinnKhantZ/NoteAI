import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from "react-native";


export default function App() {
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

  const deleteNote = async (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    await saveNotes(updatedNotes);
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
          <View key={index} style={styles.note}>
            <View>
              <Text style={styles.noteText}><Text style={styles.bold}>Original:</Text> {note.content}</Text>
              <Text style={styles.suggestionText}><Text style={styles.bold}>Suggestion:</Text> Please go online</Text>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteNote(index)}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  header: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20, marginTop: 40 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, backgroundColor: "#fff", minHeight: 100 },
  button: { backgroundColor: "#007bff", padding: 15, borderRadius: 5, marginTop: 10 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  notesContainer: { marginTop: 20 },
  note: { backgroundColor: "#fff", padding: 10, marginVertical: 5, borderRadius: 5 },
  noteText: { fontSize: 16 },
  suggestionText: { fontSize: 14, color: "gray" },
  bold: { fontWeight: "bold" },
  deleteButton: { backgroundColor: "red", alignSelf: 'flex-end', padding: 10, borderRadius: 5 }
});
