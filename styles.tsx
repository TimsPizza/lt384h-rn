import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    // paddingVertical: 8,
    // paddingHorizontal: 4,
    padding: 16,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#F4D35E',
    minWidth: 120,
    margin: 4,
  },
  buttonFoundDisabled: {
    backgroundColor: '#61FF7E',
  },
  buttonScanningDisabled: {
    backgroundColor: '#F6D0B1',
  },
  buttonForceDisabled: {
    backgroundColor: '#69353F',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  container: {
    flex: 1,
    // justifyContent: 'center',
    flexWrap: 'wrap',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
    width: '100%',
    // gap: 10,
  },
  containerInner: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    width: '100%',
    marginTop:20,
  },
  containerInnerCentered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});