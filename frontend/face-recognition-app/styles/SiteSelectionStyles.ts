import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  card: {
    maxWidth: 400,
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    paddingHorizontal: 32,
    paddingVertical: 32,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerIcon: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#dbeafe',
    borderRadius: 50,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#4b5563',
    textAlign: 'center',
  },
  scrollView: {
    marginBottom: 24,
  },
  placesContainer: {
    gap: 12,
  },
  placeButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  placeButtonSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#f0f7ff',
  },
  placeButtonUnselected: {
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  placeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#2563eb',
  },
  radioButtonUnselected: {
    borderColor: '#d1d5db',
  },
  placeName: {
    fontWeight: '500',
    color: '#111827',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderColor: '#d1d5db',
    borderWidth: 2,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '500',
    fontSize: 13,
  },
  continueButton: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueButtonEnabled: {
    backgroundColor: '#2563eb',
  },
  continueButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  continueButtonText: {
    fontWeight: '500',
    fontSize: 13,
  },
  continueButtonTextEnabled: {
    color: '#ffffff',
  },
  continueButtonTextDisabled: {
    color: '#6b7280',
  },
});
