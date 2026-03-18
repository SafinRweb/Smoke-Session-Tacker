import Constants from 'expo-constants';
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import * as SystemUI from "expo-system-ui";
import { useEffect, useState } from "react";
import { Linking, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ui } from "../constants/ui";

export default function Layout() {
  const currentVersion = Constants.expoConfig.version;
  
  // NEW: State to control when our custom popup shows up
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateInfo, setUpdateInfo] = useState({ notes: "", url: "", version: "" });

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(ui.colors.bg).catch(() => {});
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync(ui.colors.bg).catch(() => {});
      NavigationBar.setButtonStyleAsync("light").catch(() => {});
    }
    checkForUpdates();
  }, []);

  const checkForUpdates = () => {
    const githubUrl = "https://raw.githubusercontent.com/SafinRweb/Smoke-Session-Tacker/main/update.json?t=" + new Date().getTime();
    
    fetch(githubUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data.latest_version !== currentVersion) {
          // Instead of a boring alert, we save the data and trigger our Modal!
          setUpdateInfo({ notes: data.release_notes, url: data.apk_url, version: data.latest_version });
          setShowUpdateModal(true);
        }
      })
      .catch((err) => console.log("🚨 ERROR checking updates:", err));
  };

  const handleDownload = () => {
    Linking.openURL(updateInfo.url).catch((err) =>
      console.error("Couldn't open browser:", err)
    );
    setShowUpdateModal(false); // Hide the popup after they click download
  };

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
          animationDuration: 260,
          contentStyle: { backgroundColor: ui.colors.bg },
        }}
      />
      
      {/* OUR BRAND NEW CUSTOM BLACK & ORANGE POPUP */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showUpdateModal}
        onRequestClose={() => setShowUpdateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Update Available! 🚀</Text>
            
            <Text style={styles.modalText}>
              You are on v{currentVersion}. Version {updateInfo.version} is ready!
            </Text>
            
            <Text style={styles.releaseNotes}>"{updateInfo.notes}"</Text>
            
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setShowUpdateModal(false)}
              >
                <Text style={styles.cancelText}>Maybe Later</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.downloadButton} 
                onPress={handleDownload}
              >
                <Text style={styles.downloadText}>Download Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

// --- THE STYLESHEET (Black & Orange Theme) ---
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#111111', // Very dark grey/black box
    borderColor: '#FF8C00', // Dark Orange border
    borderWidth: 2,
    borderRadius: 15,
    padding: 25,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
    elevation: 10, // Adds a shadow on Android
  },
  modalTitle: {
    color: '#FF8C00', // Orange Title
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    color: '#FFFFFF', // White text
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  releaseNotes: {
    color: '#AAAAAA', // Light Grey for release notes
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 25,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#555555', // Grey border for the cancel button
    alignItems: 'center',
  },
  cancelText: {
    color: '#CCCCCC',
    fontSize: 16,
    fontWeight: '600',
  },
  downloadButton: {
    flex: 1,
    backgroundColor: '#FF8C00', // Solid Orange Button
    paddingVertical: 12,
    marginLeft: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  downloadText: {
    color: '#000000', // Black text on the Orange button
    fontSize: 16,
    fontWeight: 'bold',
  },
});