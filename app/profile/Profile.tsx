import ProfileSkeleton from "@/components/skeletons/ProfileSkeleton";
import { sections } from "@/constants/sections-profile";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Profile() {
  const { user, logout } = useAuthStore();
  const [refresh, setRefresh] = useState(false);
  const { profile, setProfile, loadingProfile } = useProfileStore();
  const uriIfNoProfileImage =
    "https://res.cloudinary.com/dsm9c4emg/image/upload/v1751077004/icono-perfil-usuario-estilo-plano-ilustracion-vector-avatar-miembro-sobre-fondo-aislado-concepto-negocio-signo-permiso-humano_157943-15752_ewx5pm.avif";

  useEffect(() => {
    if (user?.id) {
      setProfile(user.id);
    }
  }, [user?.id]);

  if (loadingProfile) {
    return <ProfileSkeleton />;
  }

  function shortNameOrEmail(name: string | undefined) {
    if (!name) return "Usuario Desconocido";
    return name.length > 16 ? name.slice(0, 16) + "..." : name;
  }
  // Limitar el nombre a 16 caracteres y agregar "..." si es más largo
  const name = shortNameOrEmail(profile?.name);
  const email = shortNameOrEmail(profile?.email);

  const handleRefresh = () => {
    setRefresh(true);
    setTimeout(() => {
      //volver a cargar el perfil
      if (user?.id) {
        setProfile(user.id);
      }
      setRefresh(false);
    }, 1000); // Simula un retraso de 1 segundo para la actualización
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: "#fff" }}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Mi perfil</Text>
          <View style={styles.profileCard}>
            <Image
              source={{
                uri: profile?.image_url
                  ? profile?.image_url
                  : uriIfNoProfileImage,
              }}
              style={styles.profileImage}
            />
            <View style={styles.profileDivider} />
            <View style={styles.profileInfo}>
              <Text style={styles.welcome}>¡Bienvenid@ {name}!</Text>
              <Text style={styles.email}>{email}</Text>
            </View>
          </View>
          {/* Renderizado de secciones */}
          {sections.map((section, idx) => (
            <View
              key={section.title}
              style={{
                width: "100%",
                paddingHorizontal: 16,
                marginTop: idx === 0 ? 24 : 8,
              }}
            >
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.data.map((item) => (
                <Link key={item.label} href={item.href as any} asChild>
                  <Pressable style={styles.link}>
                    <FontAwesome5
                      name={item.icon}
                      size={18}
                      color={item.color}
                      style={styles.linkIcon}
                    />
                    <Text style={styles.linkText}>{item.label}</Text>
                    <FontAwesome5
                      name="chevron-right"
                      size={16}
                      color="#888"
                      style={styles.linkArrow}
                    />
                  </Pressable>
                </Link>
              ))}
            </View>
          ))}
          {user ? (
            <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
              <Pressable onPress={logout} style={styles.logoutButton}>
                <FontAwesome5 name="door-open" size={20} color="white" />
                <Text style={styles.logoutText}>Cerrar sesión</Text>
              </Pressable>
            </View>
          ) : (
            <Text style={styles.loginMsg}>
              Inicia sesión para ver tu perfil.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "left",
    alignSelf: "flex-start",
    marginLeft: 16,
  },
  welcome: {
    flexWrap: "wrap",
    fontSize: 20,
    marginBottom: 8,
    fontWeight: "bold",
    textAlign: "right",
    width: "100%",
    maxWidth: 220,
    alignSelf: "flex-end",
  },
  email: {
    fontSize: 17,
    color: "#555",
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
    borderWidth: 1,
    borderColor: "rgba(34,34,34,0.25)",
    justifyContent: "flex-start",
    marginLeft: 0,
    marginRight: 0,
    alignSelf: "center",
    width: "100%",
    minWidth: 0,
    maxWidth: 500,
  },
  linkText: {
    fontSize: 16,
    color: "#222",
    fontWeight: "500",
    flex: 1,
  },
  linkIcon: {
    marginRight: 16,
    width: 22,
    textAlign: "center",
  },
  linkArrow: {
    marginLeft: 8,
  },
  logoutButton: {
    backgroundColor: "#E53935",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,

    paddingHorizontal: 16,
  },
  loginMsg: {
    color: "#888",
    marginTop: 20,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },

    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 24,
    width: "92%",
    alignSelf: "center",
    maxWidth: 500,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginRight: 16,
    backgroundColor: "#f0f0f0",
  },
  profileDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "#e0e0e0",
    marginHorizontal: 16,
    borderRadius: 1,
  },
  profileInfo: {
    flex: 1,

    alignItems: "flex-end",
    flexDirection: "column",
    justifyContent: "center",
    alignSelf: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1976D2",
    marginBottom: 8,
    marginLeft: 4,
    marginTop: 8,
  },
});
