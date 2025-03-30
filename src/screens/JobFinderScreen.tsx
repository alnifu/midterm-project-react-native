import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Image,
  Animated,
} from 'react-native';
import { JobContext, Job } from '../context/JobContext';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { globalStyles } from '../styles/globalStyles';
import { MaterialIcons } from '@expo/vector-icons';

type JobFinderScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'JobFinder'
>;

const JobFinderScreen = () => {
  const {
    filteredJobs,
    savedJobs,
    loadMoreJobs,
    searchJobs,
    addJob,
    loading,
    loadingMore,
  } = useContext(JobContext);

  const { toggleTheme, theme } = useContext(ThemeContext);
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation<JobFinderScreenNavigationProp>();
  const scaleAnim = useState(new Animated.Value(1))[0];

  // ✅ Handle Search Input
  const handleSearch = (text: string) => {
    setSearchText(text);
    searchJobs(text);
  };

  const handleToggleTheme = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    toggleTheme();
  };

  // ✅ Format Date to Display (e.g., 5 days ago)
  const getTimeAgo = (pubDate?: number) => {
    const seconds = Math.floor((Date.now() - pubDate * 1000) / 1000);
    const intervals: any = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };
    for (const key in intervals) {
      const interval = Math.floor(seconds / intervals[key]);
      if (interval >= 1) return `${interval} ${key}${interval > 1 ? 's' : ''} ago`;
    }
    return 'Just now';
  };

  // ✅ Check if Job is Expired
  const isExpired = (expiryDate?: number) => {
    return expiryDate && expiryDate * 1000 < Date.now();
  };

  // ✅ Render Job Item
  const renderJobItem = ({ item }: { item: Job }) => {
    const isSaved = savedJobs.find((job) => job.id === item.id);
    const expired = isExpired(item.expiryDate);
    const timeAgo = getTimeAgo(item.pubDate);

    return (
      <View
        style={[
          globalStyles(theme).jobItem,
          {
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.card,
          },
        ]}
      >
        {/* Company Logo + Info */}
        <View style={styles.headerContainer}>
          <Image
            source={{ uri: item.companyLogo }}
            style={styles.companyLogo}
            resizeMode="contain"
          />
          <View style={{ flex: 1 }}>
            <Text style={globalStyles(theme).textTitle}>{item.title}</Text>
            <Text style={globalStyles(theme).text}>{item.companyName}</Text>
          </View>
        </View>

        {/* Job Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>{item.jobType}</Text>
          <Text
            style={styles.detailText}
          >
            • {item.workModel}
          </Text>
          <Text style={styles.detailText}>• {item.seniorityLevel}</Text>
          <Text style={styles.detailText}>• {item.mainCategory}</Text>
        </View>

        {/* Salary Info */}
        <Text style={styles.salaryText}>
          {item.minSalary && item.maxSalary
            ? `$${item.minSalary.toLocaleString()} - $${item.maxSalary.toLocaleString()}`
            : 'Salary not disclosed'}
        </Text>

        {/* Date + Expiry Warning */}
        <Text style={styles.dateText}>
          Posted: {timeAgo} • {item.pubDate ? new Date(item.pubDate * 1000).toLocaleDateString() : 'N/A'}
        </Text>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              isSaved ? styles.disabledButton : styles.saveButton,
            ]}
            disabled={!!isSaved}
            onPress={() => addJob(item)}
          >
            <Text style={styles.buttonText}>
              {isSaved ? 'Saved' : 'Save Job'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              expired ? styles.disabledButton : styles.applyButton,
            ]}
            disabled={expired}
            onPress={() =>
              navigation.navigate('ApplicationForm', {
                job: item,
                fromSaved: false,
              })
            }
          >
            <Text style={styles.buttonText}>
              {expired ? 'Expired' : 'Apply'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={globalStyles(theme).container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TextInput
          style={[
            globalStyles(theme).searchBar,
            {
              borderColor: theme.colors.border,
              color: theme.colors.text,
            },
          ]}
          placeholder="Search jobs..."
          placeholderTextColor={theme.colors.text}
          value={searchText}
          onChangeText={handleSearch}
        />

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              {
                backgroundColor: theme.dark
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.1)',
                shadowColor: theme.dark ? '#FFD700' : '#333',
                shadowOpacity: 0.3,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 4,
              },
            ]}
            onPress={handleToggleTheme}
          >
            <MaterialIcons
              name={theme.dark ? 'dark-mode' : 'light-mode'}
              size={28}
              color={theme.dark ? '#FFD700' : '#333'}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* ✅ Loading Indicator for Fetching Jobs */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={{ color: theme.colors.text, marginTop: 10 }}>
            Fetching jobs...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => item.id}
          renderItem={renderJobItem}
          onEndReached={loadMoreJobs}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.loadingMoreContainer}>
                <ActivityIndicator size="small" color="#28a745" />
                <Text style={{ color: theme.colors.text, marginTop: 5 }}>
                  Loading more jobs...
                </Text>
              </View>
            ) : null
          }
        />
      )}

      <TouchableOpacity
        style={styles.savedJobsButton}
        onPress={() => navigation.navigate('SavedJobs')}
      >
        <Text style={styles.buttonText}>View Saved Jobs</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  companyLogo: {
    width: 50,
    height: 50,
    marginRight: 12,
    borderRadius: 8,
  },
  detailsContainer: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  detailText: {
    color: '#6c757d',
    marginRight: 8,
  },
  remoteText: {
    color: '#28a745',
    fontWeight: 'bold',
  },
  hybridText: {
    color: '#ffc107',
    fontWeight: 'bold',
  },
  salaryText: {
    color: '#28a745',
    marginTop: 5,
    fontWeight: 'bold',
  },
  dateText: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 5,
  },
  expiryWarning: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 5,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  toggleButton: {
    padding: 8,
    borderRadius: 25,
    backgroundColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingMoreContainer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: { flexDirection: 'row', marginTop: 10 },
  button: {
    flex: 1,
    padding: 10,
    backgroundColor: '#007bff',
    marginHorizontal: 5,
    borderRadius: 5,
  },
  applyButton: { backgroundColor: '#28a745' },
  saveButton: { backgroundColor: '#6c757d' },
  disabledButton: { backgroundColor: '#ccc' },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  savedJobsButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#28a745',
    borderRadius: 5,
  },
});

export default JobFinderScreen;
