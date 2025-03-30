import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import JobFinderScreen from '../screens/JobFinderScreen';
import SavedJobsScreen from '../screens/SavedJobsScreen';
import ApplicationFormScreen from '../screens/ApplicationFormScreen';

export type RootStackParamList = {
  JobFinder: undefined;
  SavedJobs: undefined;
  ApplicationForm: { job: any; fromSaved: boolean };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="JobFinder" component={JobFinderScreen} options={{ title: 'Job Finder' }} />
      <Stack.Screen name="SavedJobs" component={SavedJobsScreen} options={{ title: 'Saved Jobs' }} />
      <Stack.Screen name="ApplicationForm" component={ApplicationFormScreen} options={{ title: 'Apply' }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
