import { View, TextInput, Button } from "react-native";
import { addJob } from "../../services/jobService";
import { useState } from "react";

export default function CreateJob() {
  const [title, setTitle] = useState("");

  const save = async () => {
    await addJob({ title, createdAt: Date.now() });
  };

  return (
    <View>
      <TextInput placeholder="Job Title" onChangeText={setTitle} />
      <Button title="Save Job" onPress={save} />
    </View>
  );
}
