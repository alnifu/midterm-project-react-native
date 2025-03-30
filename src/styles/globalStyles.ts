// globalStyles.ts
import { StyleSheet } from 'react-native';

export const globalStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: theme.colors.background,
    },
    text: {
      color: theme.colors.text,
      fontSize: 14,
    },
    textTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    input: {
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 8,
      color: theme.colors.text,
      backgroundColor: theme.colors.card,
    },

    searchBar: {
      height: 40,
      flex: 1,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      backgroundColor: theme.colors.card,
    },

    jobItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderRadius: 8,
      marginVertical: 5,
    },
    companyLogo: {
      width: 50,
      height: 50,
      marginBottom: 5,
      borderRadius: 25,
    },
    buttonContainer: { flexDirection: 'row', marginTop: 10 },
    button: {
      flex: 1,
      padding: 10,
      marginHorizontal: 5,
      borderRadius: 5,
    },
    removeButton: {
      backgroundColor: '#ff4444',
    },
    buttonText: {
      color: '#fff',
      textAlign: 'center',
    },
  });
