import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const response = await axios.get("http://192.168.132.150:5000/notes");
    setNotes(response.data);
  };

  const createNote = async () => {
    if (!content.trim()) return;
    const response = await axios.post("http://192.168.132.150:5000/notes", { content });
    setNotes([response.data, ...notes]);
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
          <View key={index} style={styles.note}>
            <Text style={styles.noteText}><Text style={styles.bold}>Original:</Text> {note.content}</Text>
            <Text style={styles.suggestionText}><Text style={styles.bold}>Suggestion:</Text> {note.suggestions.map((text, index) => (
              <Text key={index}>{text}</Text>
            ))}</Text>
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
});
