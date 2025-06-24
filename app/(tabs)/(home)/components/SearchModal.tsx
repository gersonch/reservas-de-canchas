import { useComplexStore } from "@/store/useComplexStore";
import { useLocationStore } from "@/store/useLocation";
import { Link } from "expo-router";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type SearchModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
};

export const SearchModal = forwardRef(function SearchModal(
  { isModalOpen, setIsModalOpen }: SearchModalProps,
  ref
) {
  const translateY = useState(new Animated.Value(-300))[0];
  const opacity = useState(new Animated.Value(0))[0];
  const overlayOpacity = useState(new Animated.Value(0))[0];
  const city = useLocationStore((state) => state.city);
  const complejos = useComplexStore((state) => state.complejos);
  const [searchText, setSearchText] = useState("");
  const [filteredComplejos, setFilteredComplejos] = useState<typeof complejos>(
    []
  );

  function searchComplejo(e: { nativeEvent: { text: any } }) {
    const text = e.nativeEvent.text;
    setSearchText(text);

    const complejosFiltered = complejos.filter((c) =>
      c.name.toLowerCase().includes(text.toLowerCase())
    );

    const cityLower = city?.toLowerCase() ?? "";
    const citySorted = complejosFiltered.sort((a, b) => {
      const aIsCity = a.city?.toLowerCase() === cityLower;
      const bIsCity = b.city?.toLowerCase() === cityLower;
      if (aIsCity && !bIsCity) return -1;
      if (!aIsCity && bIsCity) return 1;
      return 0;
    });

    const citySliced = citySorted.slice(0, 10);
    setFilteredComplejos(citySliced);
  }

  function openModal() {
    setIsModalOpen(true);
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }

  function closeModal() {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -300,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsModalOpen(false);
    });
  }

  useImperativeHandle(ref, () => ({
    openModal,
    closeModal,
  }));

  return (
    <Modal transparent={true} visible={isModalOpen} onRequestClose={openModal}>
      <Animated.View style={[styles.modalOverlay, { opacity: overlayOpacity }]}>
        {/* Capa invisible para detectar el press fuera del modal */}
        <Pressable style={StyleSheet.absoluteFill} onPress={closeModal} />
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateY }], opacity },
          ]}
          onStartShouldSetResponder={() => true}
          onResponderStart={(e) => e.stopPropagation()}
        >
          <View style={styles.containerInputCards}>
            <TextInput
              style={styles.modalTitle}
              placeholder="Buscar complejo"
              placeholderTextColor="gray"
              onChange={searchComplejo}
              value={searchText}
            />
            <View>
              {filteredComplejos.length !== 0 ? (
                <ScrollView style={[styles.containerCards]}>
                  {filteredComplejos.map((complejo) => (
                    <Link
                      key={complejo._id}
                      href={{
                        pathname: "/details/[id]",
                        params: { id: complejo._id },
                      }}
                      onPress={closeModal}
                      style={styles.cardItem} // <-- Aplica el estilo aquí
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle}>{complejo.name}</Text>
                        <Text style={styles.cardSubtitle}>{complejo.city}</Text>
                      </View>
                    </Link>
                  ))}
                </ScrollView>
              ) : (
                <Text>No hay complejos con ese nombre</Text>
              )}
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 150,
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.86)",
    height: "70%",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
    justifyContent: "space-between",
    color: "black",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    backgroundColor: "white",
    width: "100%",
    height: "15%",
    padding: 20,
    borderRadius: 5,
    color: "black ",
  },
  containerInputCards: {
    flex: 1,
    width: "100%",
    color: "black",
  },

  containerCards: {
    width: "100%",
    height: "85%",
    maxHeight: "95%", // limita la altura del scroll para que no ocupe todo el modal

    color: "black",

    // limita altura del scroll para que no ocupe todo el modal
  },
  cardItem: {
    backgroundColor: "white",
    paddingBlock: 25,
    paddingInline: 20,
    borderRadius: 8,
    marginVertical: 6,
    alignSelf: "stretch",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
});
