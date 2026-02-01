import { View, Text, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { getJobs } from "../../services/jobService";

export default function Home() {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    getJobs().then(setJobs);
  }, []);

  return (
    <FlatList
      data={jobs}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View>
          <Text>{item.title}</Text>
        </View>
      )}
    />
  );
}
