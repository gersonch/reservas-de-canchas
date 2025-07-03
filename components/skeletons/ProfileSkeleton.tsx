import { StyleSheet, View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function ProfileSkeleton() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi perfil</Text>
      <View style={styles.profileCard}>
        <LinearGradient
          colors={["#e0e0e0", "#f5f5f5", "#e0e0e0"]}
          style={styles.profileImage}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.profileDivider} />
        <View style={styles.profileInfo}>
          <View style={styles.skeletonTextLarge} />
          <View style={styles.skeletonTextSmall} />
        </View>
      </View>
      {/* Secciones skeleton */}
      {[1, 2].map((sectionIdx) => (
        <View
          key={sectionIdx}
          style={{
            width: "100%",
            paddingHorizontal: 16,
            marginTop: sectionIdx === 1 ? 24 : 8,
          }}
        >
          <View style={styles.skeletonSectionTitle} />
          {[1, 2].map((itemIdx) => (
            <View key={itemIdx} style={styles.link}>
              <View style={styles.skeletonIcon} />
              <View style={styles.skeletonLinkText} />
              <View style={styles.skeletonArrow} />
            </View>
          ))}
        </View>
      ))}
      <View style={styles.logoutButton}>
        <View style={styles.skeletonLogoutIcon} />
        <View style={styles.skeletonLogoutText} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    marginTop: 30,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "left",
    alignSelf: "flex-start",
    marginLeft: 16,
    color: "#e0e0e0",
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
    borderRadius: 100,
    marginRight: 16,
    backgroundColor: "#e0e0e0",
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
  skeletonTextLarge: {
    width: 120,
    height: 22,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
    marginBottom: 8,
  },
  skeletonTextSmall: {
    width: 90,
    height: 18,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
  },
  skeletonSectionTitle: {
    width: 100,
    height: 18,
    borderRadius: 4,
    backgroundColor: "#e0e0e0",
    marginBottom: 8,
    marginLeft: 4,
    marginTop: 8,
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
  skeletonIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#e0e0e0",
    marginRight: 16,
  },
  skeletonLinkText: {
    flex: 1,
    height: 16,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
  },
  skeletonArrow: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
    marginLeft: 8,
  },
  logoutButton: {
    backgroundColor: "#fff",
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
  skeletonLogoutIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
    marginRight: 8,
  },
  skeletonLogoutText: {
    width: 90,
    height: 18,
    borderRadius: 6,
    backgroundColor: "#e0e0e0",
  },
});
