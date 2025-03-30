import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { JobContext, Job } from '../context/JobContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { ThemeContext } from '../context/ThemeContext'; // ✅ Import ThemeContext
import { globalStyles } from '../styles/globalStyles'; // ✅ Import globalStyles

type SavedJobsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SavedJobs'
>;

const SavedJobsScreen = () => {
  const { savedJobs, removeJob } = useContext(JobContext);
  const { theme } = useContext(ThemeContext); // ✅ Get theme
  const navigation = useNavigation<SavedJobsScreenNavigationProp>();

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

  // ✅ Render Job Item with Additional Details
  const renderJobItem = ({ item }: { item: Job }) => {
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
          {item.companyLogo ? (
            <Image
              source={{ uri: item.companyLogo }}
              style={styles.companyLogo}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.placeholderLogo} />
          )}
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
        {expired && <Text style={styles.expiryWarning}>⚠️ This job has expired</Text>}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              expired ? styles.disabledButton : { backgroundColor: theme.colors.primary },
            ]}
            disabled={expired}
            onPress={() =>
              navigation.navigate('ApplicationForm', {
                job: item,
                fromSaved: true,
              })
            }
          >
            <Text style={styles.buttonText}>
              {expired ? 'Expired' : 'Apply'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.removeButton]}
            onPress={() => removeJob(item.id)}
          >
            <Text style={styles.buttonText}>Remove Job</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={globalStyles(theme).container}>
      <FlatList
        data={savedJobs}
        keyExtractor={(item) => item.id}
        renderItem={renderJobItem}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={globalStyles(theme).text}>No saved jobs yet.</Text>
        }
      />
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
  placeholderLogo: {
    width: 50,
    height: 50,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: '#ccc',
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
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: '#dc3545',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SavedJobsScreen;
