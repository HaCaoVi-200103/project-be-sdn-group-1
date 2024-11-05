import { Colors } from "@constants/Colors";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
interface CustomerModalProps {
  customer: any;
  setModalVisible: any;
  modalVisible: boolean;
}
export const CustomerModal: React.FC<CustomerModalProps> = ({
  customer,
  setModalVisible,
  modalVisible,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Customer Information</Text>
          <Text style={styles.modalText}>Name: {customer?.full_name}</Text>
          <Text style={styles.modalText}>Email: {customer?.email}</Text>
          <Text style={styles.modalText}>Phone: {customer?.phone_number}</Text>
          <Text style={styles.modalText}>Address: {customer?.address}</Text>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={[
              {
                backgroundColor: Colors.BRICKRED,
                borderRadius: 10,
              },
            ]}
          >
            <Text style={{ color: Colors.IVORYWHITE, padding: 10 }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: Colors.IVORYWHITE,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
});
