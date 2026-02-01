import { Button, View } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";

export default function Profile() {
  return (
    <View>
      <Button title="Logout" onPress={() => signOut(auth)} />
    </View>
  );
}
