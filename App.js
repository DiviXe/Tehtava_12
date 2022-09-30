import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { initializeApp } from "firebase/app";
import { getDatabase, push, ref, onValue, remove } from "firebase/database";

export default function App() {
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [items, setItems] = useState([]);

  const firebaseConfig = {
    apiKey: "AIzaSyDrZQHPdk7SzUN9d90W0paovWqn5dl3R_Q",
    authDomain: "teht12.firebaseapp.com",
    projectId: "teht12",
    storageBucket: "teht12.appspot.com",
    messagingSenderId: "517096915063",
    appId: "1:517096915063:web:8be3d50afdab2416294672",
    measurementId: "G-9KFMTWHFHF",
  };
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

  useEffect(() => {
    const itemsRef = ref(database, "items/");
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data == null) {
      } else {
        setItems(Object.values(data));
      }
    });
  }, []);

  const saveItem = () => {
    push(ref(database, "items/"), { product: product, amount: amount });
  };

  const deleteItem = (key) => {
    remove(ref(database, "items/" + key));
    //(ref.database, "items/" + key).remove();
    //Detele ei jostain syystä toimi yritin löytää apua myös stack overflowista. Mikään ei toiminut.
  };
  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%",
        }}
      />
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.container}>
        <View style={styles.textInput}>
          <TextInput
            placeholder="Tuote"
            onChangeText={(product) => setProduct(product)}
            value={product}
          />
        </View>
        <View style={styles.textInput}>
          <TextInput
            placeholder="Määrä"
            onChangeText={(amount) => setAmount(amount)}
            value={amount}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={saveItem}>
          <Text style={styles.AddItem}>Lisää Tuote</Text>
        </TouchableOpacity>
        <Text style={styles.textStyle}>Ostoslista</Text>
        <FlatList
          style={{ marginLeft: "5%" }}
          renderItem={({ item }) => (
            <View style={styles.listcontainer}>
              <Text style={{ fontSize: 16 }}>
                {item.product}, {item.amount}
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  color: "#FF0000",
                }}
                onPress={() => deleteItem(item.key)}
              >
                {" "}
                ostettu
              </Text>
            </View>
          )}
          data={items}
          ItemSeparatorComponent={listSeparator}
        />
      </View>
      <StatusBar hidden={true} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  listcontainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  textStyle: {
    marginTop: 15,
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#888100",
  },
  button: {
    height: 40,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: "gray",
    borderWidth: 2,
  },
  AddItem: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  textInput: {
    borderWidth: 2,
    borderColor: "gray",
    width: 150,
    margin: 2,
  },
});
