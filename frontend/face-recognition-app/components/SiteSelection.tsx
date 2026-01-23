import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAppContext } from '@/components/context/AdminContext';
import { MapPin, ArrowRight, Check } from 'lucide-react-native';
import { styles } from '@/styles/SiteSelectionStyles';

interface SiteSelectionProps {
  onSelectSite: (placeId: string) => void;
  onCancel: () => void;
}

const SiteSelection: React.FC<SiteSelectionProps> = ({ onSelectSite, onCancel }) => {
  const { places } = useAppContext();
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>('');

  const handleContinue = () => {
    if (selectedPlaceId) {
      onSelectSite(selectedPlaceId);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerSection}>
          <View style={styles.headerIcon}>
            <MapPin size={32} color="#2563EB" />
          </View>
          <Text style={styles.headerTitle}>Selecciona tu Sede</Text>
          <Text style={styles.headerSubtitle}>
            Antes de marcar entrada, confirma en qué sede te encuentras
          </Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.placesContainer}>
            {places.map((place) => (
              <TouchableOpacity
                key={place.id}
                onPress={() => setSelectedPlaceId(place.id)}
                style={[
                  styles.placeButton,
                  selectedPlaceId === place.id
                    ? styles.placeButtonSelected
                    : styles.placeButtonUnselected,
                ]}
              >
                <View style={styles.placeContent}>
                  <View
                    style={[
                      styles.radioButton,
                      selectedPlaceId === place.id
                        ? styles.radioButtonSelected
                        : styles.radioButtonUnselected,
                    ]}
                  >
                    {selectedPlaceId === place.id && (
                      <Check size={12} color="#FFFFFF" strokeWidth={3} />
                    )}
                  </View>
                  <Text style={styles.placeName}>{place.name}</Text>
                </View>
                <MapPin size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={onCancel}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleContinue}
            disabled={!selectedPlaceId}
            style={[
              styles.continueButton,
              selectedPlaceId
                ? styles.continueButtonEnabled
                : styles.continueButtonDisabled,
            ]}
          >
            <Text style={[
              styles.continueButtonText,
              selectedPlaceId
                ? styles.continueButtonTextEnabled
                : styles.continueButtonTextDisabled,
            ]}>
              Continuar
            </Text>
            <ArrowRight size={20} color={selectedPlaceId ? '#FFFFFF' : '#6B7280'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SiteSelection;