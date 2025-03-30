import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Job } from '../context/JobContext';
import { ThemeContext } from '../context/ThemeContext';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

// ✅ Navigation Prop Type
type ApplicationFormScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ApplicationForm'
>;

const ApplicationFormScreen = () => {
  const navigation = useNavigation<ApplicationFormScreenNavigationProp>();
  const route = useRoute();
  const { job, fromSaved } = route.params as { job: Job; fromSaved: boolean };
  const { theme } = useContext(ThemeContext);

  // ✅ Empty Form State (No Auto-Fill)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [successAnim] = useState(new Animated.Value(0)); // ✅ Success Animation

  // ✅ Format Date (MM/DD/YYYY)
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US');
  };

  // ✅ Check if Expiry Date is Near
  const isExpiryNear = () => {
    const today = Date.now() / 1000;
    return job.expiryDate && job.expiryDate - today < 432000; // 5 days in seconds
  };

  // ✅ Calculate Days Until Expiry
  const daysUntilExpiry = () => {
    if (!job.expiryDate) return null;
    const daysLeft = Math.floor((job.expiryDate * 1000 - Date.now()) / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? `${daysLeft} days left` : 'Expired';
  };

  // ✅ Handle Form Validation
  const isValidForm = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required.');
      return false;
    }
    if (!email.includes('@')) {
      Alert.alert('Error', 'Enter a valid email address.');
      return false;
    }
    if (!contact.trim()) {
      Alert.alert('Error', 'Contact number is required.');
      return false;
    }
    if (!reason.trim()) {
      Alert.alert('Error', 'Please provide a reason for hiring.');
      return false;
    }
    return true;
  };

  // ✅ Handle Successful Animation
  const startSuccessAnimation = () => {
    Animated.timing(successAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      successAnim.setValue(0); // Reset animation
    });
  };

  // ✅ Handle Form Submission
  const handleSubmit = () => {
    if (!isValidForm()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      startSuccessAnimation(); // Show animation
      Alert.alert(
        '🎉 Application Submitted',
        `Thank you for applying to ${job.companyName}!`,
        [
          {
            text: 'Okay',
            onPress: () => {
              // ✅ Clear Form after Submission
              setName('');
              setEmail('');
              setContact('');
              setReason('');
              // ✅ Navigate Back Based on Origin
              if (fromSaved) {
                navigation.reset({
                  index: 1,
                  routes: [
                    { name: 'JobFinder' },
                    { name: 'SavedJobs' },
                  ],
                });
              } else {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'JobFinder' }],
                });
              }
            },
          },
        ]
      );
    }, 1500); // Simulated API delay
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ✅ Company Logo + Job Details */}
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          {job.companyLogo ? (
            <Image
              source={{ uri: job.companyLogo }}
              style={styles.companyLogo}
              resizeMode="contain"
            />
          ) : (
            <View style={[styles.logoPlaceholder, { backgroundColor: theme.colors.border }]}>
              <Text style={[styles.placeholderText, { color: theme.colors.text }]}>
                No Logo
              </Text>
            </View>
          )}
          <Text style={[styles.heading, { color: theme.colors.text }]}>{job.title}</Text>
          <Text style={[styles.subheading, { color: theme.colors.text }]}>{job.companyName}</Text>

          {/* Job Details with Icons */}
          <View style={styles.detailsContainer}>
            <FontAwesome5 name="briefcase" size={12} color="#6c757d" />
            <Text style={styles.detailText}> {job.jobType}</Text>
            <FontAwesome5 name="laptop-house" size={12} color="#6c757d" />
            <Text style={styles.detailText}> {job.workModel}</Text>
            <FontAwesome5 name="user-tie" size={12} color="#6c757d" />
            <Text style={styles.detailText}> {job.seniorityLevel}</Text>
          </View>

          {/* Main Category & Salary Info */}
          <Text style={styles.categoryText}>📚 {job.mainCategory}</Text>
          {(job.minSalary || job.maxSalary) && (
            <Text style={styles.salaryText}>
              💸 {job.minSalary ? `$${job.minSalary}` : 'N/A'} -{' '}
              {job.maxSalary ? `$${job.maxSalary}` : 'N/A'}
            </Text>
          )}

          {/* Publication Date & Expiry Info */}
          <Text style={styles.dateText}>🗓️ Posted on {formatDate(job.pubDate)}</Text>
          {job.expiryDate && (
            <Text style={styles.expiryWarning}>
              ⚠️ {isExpiryNear() ? `Expires soon! ${daysUntilExpiry()}` : `Expires in ${daysUntilExpiry()}`}
            </Text>
          )}
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            placeholder="Name"
            placeholderTextColor="#6c757d"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            placeholder="Email"
            placeholderTextColor="#6c757d"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            placeholder="Contact Number"
            placeholderTextColor="#6c757d"
            value={contact}
            onChangeText={setContact}
            keyboardType="phone-pad"
          />
          <TextInput
            style={[styles.input, styles.multiline, { color: theme.colors.text }]}
            placeholder="Why should we hire you?"
            placeholderTextColor="#6c757d"
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* ✅ Submit Button */}
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: loading ? '#6c757d' : theme.colors.primary,
              shadowColor: theme.colors.primary,
            },
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Submit Application</Text>
          )}
        </TouchableOpacity>

        {/* ✅ Success Animation */}
        <Animated.View
          style={[
            styles.successContainer,
            {
              opacity: successAnim,
              transform: [{ scale: successAnim }],
            },
          ]}
        >
          <MaterialIcons name="check-circle" size={70} color="#28a745" />
          <Text style={styles.successText}>Application Successful!</Text>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 3,
  },
  companyLogo: {
    width: 80,
    height: 80,
    marginBottom: 12,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 12,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 5,
  },
  detailText: {
    color: '#6c757d',
    marginLeft: 5,
    marginRight: 8,
    fontSize: 12,
  },
  categoryText: {
    color: '#17a2b8',
    fontSize: 14,
    marginTop: 8,
  },
  salaryText: {
    color: '#28a745',
    marginTop: 5,
    fontSize: 14,
  },
  dateText: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 5,
  },
  expiryWarning: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 5,
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderColor: '#ccc',
  },
  multiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  successContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  successText: {
    color: '#28a745',
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ApplicationFormScreen;
